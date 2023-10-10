'use client'


import { useForm } from "react-hook-form"

import axios from 'axios'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle }
    from "../ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { useToast } from "@/components/ui/use-toast"


import { Button } from '../ui/button'
import { FileUpload } from '../FileUpload'
import { useRouter } from 'next/navigation'
import { useModal } from '@/hooks/use-modal-store'
import qs from "query-string"

const formSchema = z.object({

    fileUrl: z.string().min(1, { message: 'Se requiere archivo' })
})

export const MessageFileModal = () => {

    const { data, isOpen, onClose, type } = useModal()
    const router = useRouter()

    const { apiUrl, query } = data

    const isModalOpen = isOpen && type === 'message-file'

    const { toast } = useToast()

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fileUrl: ''
        }
    })

    const handleClose = () => {
        form.reset()
        onClose()
    }

    const isLoading = form.formState.isSubmitting

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        // console.log(values)
        try {
            const url = qs.stringifyUrl({
                url: apiUrl || '',
                query
            })

            await axios.post(url, {
                ...values,
                content: values.fileUrl
            })
            toast({
                title: 'Mensaje enviado',
                description: 'Tu mensaje ha sido enviado correctamente'
            })
            form.reset()
            router.refresh()
            handleClose()

        } catch (error) {
            console.log(error)
            toast({
                title: 'Error',
                description: 'No se pudo enviar el mensaje'
            })
        }
    }


    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-semibold">
                        Añade un archivo a tu mensaje
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-500">
                        Selecciona un archivo para enviarlo como mensaje
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
                        <div className="space-y-8 px-6">
                            <div className="flex items-center justify-center text-center">
                                <FormField
                                    control={form.control}
                                    name='fileUrl'
                                    render={({ field, formState }) => (
                                        <FormItem>
                                            <FormControl>
                                                <FileUpload
                                                    endpoint='messageFile'
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                        <DialogFooter className="bg-gray-100 px-6 py-4">
                            <Button disabled={isLoading} variant='primary'>
                                Enviar
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}