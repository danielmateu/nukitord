'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import {
    Form,
    FormControl,
    FormField,
    FormItem,
} from "@/components/ui/form"

import { Input } from "@/components/ui/input"
import { Plus, Smile } from 'lucide-react'
import axios from 'axios'
import qs from 'query-string'
import { ActionTooltip } from '../ActionTooltip'
import { useToast } from '../ui/use-toast'
import { useModal } from '@/hooks/use-modal-store'
import { EmojiPicker } from '../EmojiPicker'
import { useRouter } from 'next/navigation'

interface ChatInputProps {
    apiUrl: string
    query: Record<string, any>
    name: string
    type: 'conversation' | 'channel'
}

const formSchema = z.object({
    content: z.string().nonempty()
})

export const ChatInput = ({
    apiUrl,
    query,
    name,
    type
}: ChatInputProps) => {

    const { onOpen } = useModal()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            content: '',
        }
    })

    const isLoading = form.formState.isSubmitting;

    const { toast } = useToast()
    const router = useRouter()

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            const url = qs.stringifyUrl({
                url: apiUrl,
                query
            })

            await axios.post(url, data)
            // toast({
            //     title: 'Mensaje enviado',
            //     description: 'Tu mensaje ha sido enviado correctamente',

            // })
            form.reset()
            router.refresh()

        } catch (error) {
            console.log(error);
            toast({
                title: 'Error',
                description: 'No se pudo enviar el mensaje',

            })
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                        <FormItem>
                            {/* <FormLabel>Username</FormLabel> */}
                            <FormControl>
                                <div className="relative p-4 pb-6">
                                    <ActionTooltip
                                        label='Adjuntar archivo'
                                        side="left"
                                        align="center"

                                    >
                                        <button
                                            type="button"
                                            onClick={() => onOpen('message-file', { apiUrl, query })}
                                            className='absolute top-7 left-8 h-[24px] w-[24px] bg-zinc-500 hover:bg-zinc-600 dark:bg-zinc-400 dark:hover:bg-zinc-300 transition rounded-full p-1 flex items-center justify-center'
                                        >
                                            <Plus className='text-white dark:text-[#313338]' />
                                        </button>
                                    </ActionTooltip>
                                    <Input disabled={isLoading}
                                        placeholder={`Mensaje ${type === 'conversation' ? name : '#' + name}`}
                                        className='px-14 py-6 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200'
                                        {...field}
                                    />
                                    <div className="absolute top-7 right-8">
                                        <EmojiPicker
                                            onChange={(emoji: string) => field.onChange(field.value + emoji)}
                                        />
                                    </div>
                                </div>
                            </FormControl>
                        </FormItem>
                    )}
                />
            </form>
        </Form >
    )
}
