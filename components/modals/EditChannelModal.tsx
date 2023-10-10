'use client'

import { ChannelType } from "@prisma/client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useParams, useRouter } from 'next/navigation'

import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import axios from 'axios'
import qs from 'query-string'

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle }
    from "../ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { useModal } from "@/hooks/use-modal-store"
import { useToast } from "@/components/ui/use-toast"

import { Button } from '../ui/button'
import { Input } from '../ui/input'

const formSchema = z.object({
    name: z.string().min(1, { message: 'Se requiere un nombre para el canal' }).refine(name => name !== 'general',
        { message: 'El nombre del canal no puede ser "general"' }),
    type: z.nativeEnum(ChannelType)

})

export const EditChannelModal = () => {

    const { isOpen, onClose, type, data } = useModal()

    const router = useRouter()
    const params = useParams()
    const { toast } = useToast()

    const { channel, server } = data

    const isModalOpen = isOpen && type === 'edit-channel'
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            type: channel?.type || ChannelType.TEXT
        }
    })


    useEffect(() => {
        if (channel) {
            form.setValue('name', channel.name)
            form.setValue('type', channel.type)
        }

    }, [channel, form])

    const isLoading = form.formState.isSubmitting

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        // console.log(values)
        try {
            const url = qs.stringifyUrl({
                url: `/api/channels/${channel?.id}`,
                query: {
                    serverId: server?.id
                }
            })
            await axios.patch(url, values)
            toast({
                title: 'Canal editado',
                description: 'El canal se ha editado correctamente'
            })

            form.reset()
            router.refresh()
            onClose()
        } catch (error) {
            console.log(error)
            toast({
                title: 'Error',
                description: 'No se pudo editar el canal'
            })
        }
    }

    const handleClose = () => {
        form.reset()
        onClose()
    }

    if (!isMounted) return null

    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-semibold">
                        Edita tu canal
                    </DialogTitle>
                </DialogHeader>
                {
                    !isLoading && (
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
                                <div className="space-y-8 px-6">

                                    <FormField
                                        control={form.control}
                                        name='name'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel
                                                    className='uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70'
                                                >
                                                    Nombre del canal
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        disabled={isLoading}
                                                        className='bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0'
                                                        placeholder='Modifica el nombre de tu canal'
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name='type'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Tipo de canal</FormLabel>
                                                <Select
                                                    disabled={isLoading}
                                                    onValueChange={field.onChange}
                                                    defaultValue={field.value}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger
                                                            className="bg-zinc-300/50 border-0 focus:ring-0 text-black ring-offset-0 focus:ring-offset-0 capitalize outline-none"
                                                        >
                                                            <SelectValue
                                                                placeholder='Selecciona el tipo de canal' />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {
                                                            Object.values(ChannelType).map(type => (
                                                                <SelectItem
                                                                    key={type}
                                                                    value={type}
                                                                    className='capitalize'
                                                                >
                                                                    {type.toLowerCase()}
                                                                </SelectItem>
                                                            ))
                                                        }
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <DialogFooter className="bg-gray-100 px-6 py-4">
                                    <Button disabled={isLoading} variant='primary'>
                                        Editar
                                    </Button>
                                </DialogFooter>
                            </form>
                        </Form>
                    )
                }
                {
                    isLoading && (
                        <>
                            <p className="text-center">Editando el canal <span className="font-semibold text-indigo-500">{channel?.name}</span></p>
                            <div className="spinner">
                                <div className="double-bounce1"></div>
                                <div className="double-bounce2"></div>
                            </div>
                        </>
                    )
                }
            </DialogContent>
        </Dialog>
    )
}
