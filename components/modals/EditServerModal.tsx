'use client'

import { useForm } from "react-hook-form"
import { useToast } from "@/components/ui/use-toast"

import axios from 'axios'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle }
    from "../ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'


import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { FileUpload } from '../FileUpload'
import { useRouter } from 'next/navigation'
import { useModal } from "@/hooks/use-modal-store"
import { useEffect, useState } from "react"

const formSchema = z.object({
    name: z.string().min(1, { message: 'Se requiere un nombre para el servidor ' }),
    imageUrl: z.string().min(1, { message: 'Se requiere una imagen para el servidor ' })
})



export const EditServerModal = () => {

    const { isOpen, onClose, type, data } = useModal()
    const router = useRouter()
    const { toast } = useToast()

    const isModalOpen = isOpen && type === 'edit-server'
    const [isMounted, setIsMounted] = useState(false)

    const { server } = data

    useEffect(() => {
        setIsMounted(true)
    }, [])

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            imageUrl: ''
        }
    })

    useEffect(() => {
        if (server) {
            form.setValue('name', server.name)
            form.setValue('imageUrl', server.imageUrl)
        }
    }, [form, server])


    const isLoading = form.formState.isSubmitting

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        // console.log(values)
        try {
            await axios.patch(`/api/servers/${server?.id}`, values)
            toast({
                title: 'Servidor actualizado',
                description: 'Tu servidor ha sido actualizado correctamente'
            })
            form.reset()
            router.refresh()
            onClose()
        } catch (error) {
            console.log(error)
            toast({
                title: 'Error',
                description: 'Ha ocurrido un error al actualizar el servidor'
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
                        !isLoading && (
                            <>
                                <DialogTitle className="text-2xl text-center font-semibold">
                                    Edita tu servidor
                                </DialogTitle>
                                <DialogDescription className="text-center text-zinc-500">
                                    Desde aquí puedes cambiar el nombre y la imagen de tu servidor.
                                </DialogDescription>
                            </>
                        )

                    }
                    {
                        isLoading && (
                            <>
                                <p className="text-center">Editando el servidor <span className="font-semibold text-indigo-500">{server?.name}</span></p>

                            </>
                        )
                    }
                </DialogHeader>
                {
                    !isLoading && (
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
                                <div className="space-y-8 px-6">
                                    <div className="flex items-center justify-center text-center">
                                        <FormField
                                            control={form.control}
                                            name='imageUrl'
                                            render={({ field, formState }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <FileUpload
                                                            endpoint='serverImage'
                                                            value={field.value}
                                                            onChange={field.onChange}
                                                        />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <FormField
                                        control={form.control}
                                        name='name'
                                        render={({ field, formState }) => (
                                            <FormItem>
                                                <FormLabel
                                                    className='uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70'
                                                >
                                                    Nombre del servidor
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        disabled={isLoading}
                                                        className='bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0'
                                                        placeholder='Introduce el nombre de tu servidor'
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <DialogFooter className="bg-gray-100 px-6 py-4">
                                    <Button disabled={isLoading} variant='primary'>
                                        Guardar
                                    </Button>
                                </DialogFooter>
                            </form>
                        </Form>
                    )
                }
                {
                    isLoading && (
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
