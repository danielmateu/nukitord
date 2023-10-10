'use client'

import { useForm } from "react-hook-form"
import qs from 'query-string'
import axios from 'axios'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

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


import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useParams, useRouter } from 'next/navigation'
import { useModal } from "@/hooks/use-modal-store"
import { ChannelType } from "@prisma/client"
import { useEffect, useState } from "react"

import { useToast } from "@/components/ui/use-toast"


const formSchema = z.object({
    name: z.string().min(1, { message: 'Se requiere un nombre para el canal' }).refine(name => name !== 'general',
        { message: 'El nombre del canal no puede ser "general"' }),
    type: z.nativeEnum(ChannelType)

})

export const CreateChannelModal = () => {

    const [isMounted, setIsMounted] = useState(false)
    const { isOpen, onClose, type, data } = useModal()

    const router = useRouter()
    const params = useParams()
    const { toast } = useToast()

    const { channelType } = data

    const isModalOpen = isOpen && type === 'create-channel'

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            type: channelType || ChannelType.TEXT
        }
    })
    useEffect(() => {
        setIsMounted(true)
    }, [])

    useEffect(() => {
        if (channelType) {
            form.setValue('type', channelType)
        } else {
            form.setValue('type', ChannelType.TEXT)
        }

    }, [channelType, form])

    const isLoading = form.formState.isSubmitting

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        // console.log(values)
        try {
            const url = qs.stringifyUrl({
                url: '/api/channels',
                query: {
                    serverId: params?.serverId
                }
            })
            await axios.post(url, values)
            toast({
                title: 'Canal creado',
                description: 'El canal se ha creado correctamente'
            })
            form.reset()
            router.refresh()
            onClose()
        } catch (error) {
            console.log(error)
            toast({
                title: 'Error',
                description: 'No se pudo crear el canal',
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
                    {
                        !isLoading ? (
                            <DialogTitle className="text-2xl text-center font-semibold">
                                Crea tu propio canal
                            </DialogTitle>
                        ) : (
                            <DialogTitle className="text-2xl text-center font-semibold">
                                Estamos creando tu canal
                            </DialogTitle>

                        )
                    }
                </DialogHeader>
                {
                    !isLoading ? (
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
                                                        placeholder='Introduce el nombre de tu canal'
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
                                        Crear
                                    </Button>
                                </DialogFooter>
                            </form>
                        </Form>
                    ) : (
                        <div className="spinner">
                            <div className="double-bounce1"></div>
                            <div className="double-bounce2"></div>
                        </div>
                    )
                }
            </DialogContent>
        </Dialog>
    )
}
