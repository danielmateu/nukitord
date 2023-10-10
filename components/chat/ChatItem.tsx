'use client'

import { Member, MemberRole, Profile } from "@prisma/client"
import { UserAvatar } from "../UserAvatar"
import { ActionTooltip } from "../ActionTooltip"
import { Edit, FileIcon, ShieldAlert, ShieldCheck, Trash } from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"


import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import axios from "axios"

import qs from 'query-string'
import { useForm } from "react-hook-form"
import { Button } from "../ui/button"
import { useModal } from "@/hooks/use-modal-store"

import { useParams, useRouter } from "next/navigation"




interface ChatItemProps {
    id: string
    content: string
    member: Member & {
        profile: Profile
    },
    timeStamp?: string
    fileUrl: string | null
    deleted: boolean
    currentMember: Member
    isUpdated?: boolean
    socketUrl: string
    socketQuery: Record<string, string>
}

const formSchema = z.object({
    content: z.string().min(1),
})

const roleIconMap = {
    "GUEST": null,
    "MODERATOR": <ShieldCheck className="h-4 w-4 ml-2 text-indigo-500" />,
    "ADMIN": <ShieldAlert className="h-4 w-4 ml-2 text-rose-500" />,
}

export const ChatItem = ({
    id,
    content,
    member,
    timeStamp,
    fileUrl,
    deleted,
    currentMember,
    isUpdated,
    socketUrl,
    socketQuery
}: ChatItemProps) => {

    const fileType = fileUrl?.split('.').pop()

    const isAdmin = currentMember.role === MemberRole.ADMIN
    const isModerator = currentMember.role === MemberRole.MODERATOR
    const isOwner = currentMember.id === member.id
    const canDeleteMessage = !deleted && (isAdmin || isModerator || isOwner)
    const canEditMessage = !deleted && isOwner && !fileUrl
    const isPdf = fileType === 'pdf' && fileUrl
    const isImage = !isPdf && fileUrl
    const params = useParams()
    const router = useRouter()

    const [isEditing, setIsEditing] = useState(false)

    const [isLoading, setIsLoading] = useState(false)
    const { onOpen } = useModal()

    const onMemberClick = () => {
        if (member.id === currentMember.id) return

        router.push(`/servers/${params?.serverId}/conversations/${member.id}`)
    }

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const url = qs.stringifyUrl({
                url: `${socketUrl}/${id}`,
                query: socketQuery
            })

            await axios.patch(url, values)
            form.reset()
            setIsEditing(false)
        } catch (error) {
            console.log(error);
        }
    }

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            content,
        }
    })

    useEffect(() => {
        const handleKeyDown = (e: any) => {
            if (e.key === 'Escape' || e.keyCode === 27) {
                setIsEditing(false)
            }
        }

        window.addEventListener('keydown', handleKeyDown)

        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [])


    useEffect(() => {
        form.reset({
            content,
        })
    }, [content, form])

    return (
        <div className='relative group flex items-center hover:bg-black/5 p-4 transition w-full'>
            <div className="group flex gap-x-2 items-star w-full">
                <div
                    onClick={onMemberClick}
                    className="cursor-pointer hover:drop-shadow-md transition">
                    <UserAvatar src={member.profile.imageUrl} />
                </div>
                <div className="flex flex-col w-full">
                    <div className="flex items-center gap-x-2">
                        <div className="flex items-center">
                            <p
                                onClick={onMemberClick}
                                className="font-semibold text-sm hover:underline cursor-pointer">
                                {member.profile.name}
                            </p>
                            <ActionTooltip
                                label={member.role}
                                side="right"
                                align="end"
                            >
                                {roleIconMap[member.role]}
                            </ActionTooltip>
                        </div>
                        <span className="text-xs text-zinc-500 dark:tax-zinc-400">
                            {timeStamp}
                        </span>
                    </div>
                    {isImage && (
                        <a href={fileUrl} target="_black" rel="noopener noreferer" className="relative aspect-square rounded-md mt-2 overflow-hidden border flex items-center bg-secondary h-48 w-48">
                            <Image
                                src={fileUrl}
                                alt={content}
                                fill
                                className="object-cover"
                            />
                        </a>
                    )}
                    {isPdf && (
                        <div className="flex items-center relative p-2 mt-2 rounded-md bg-background/10">
                            <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400" />
                            <a href={fileUrl} target="_black" rel="noopener noreferer" className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline">
                                Archivo PDF
                            </a>
                        </div>
                    )}
                    {!fileUrl && !isEditing && (
                        <p className={cn("text-sm text-zinc-600 dark:text-zinc-300",
                            deleted && "italic text-zinc-500 dark:text-zinc-400 text-xs mt-1"
                        )}>
                            {content}
                            {isUpdated && !deleted && (
                                <span className="text-[10px] mx-2 text-zinc-500 dark:text-zinc-400">
                                    (editado)
                                </span>
                            )}
                        </p>
                    )}
                    {!fileUrl && isEditing && (
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-start w-full gap-x-2 pt-2">
                                <FormField
                                    control={form.control}
                                    name="content"
                                    render={({ field }) => (
                                        <FormItem
                                            className="flex-1"
                                        >
                                            {/* <FormLabel>Username</FormLabel> */}
                                            <FormControl>
                                                <div className="relative w-full">
                                                    <Input
                                                        disabled={isLoading}
                                                        className="p-2 bg-zinc-200/90 dark:bg-zinc-700/75 border-none boder-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
                                                        placeholder="Editar mensaje" {...field} />
                                                </div>
                                            </FormControl>
                                            <FormDescription>
                                                Presiona ESC para cancelar, Enter para guardar
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button
                                    disabled={isLoading}
                                    size='sm' type="submit">
                                    Guardar
                                </Button>
                            </form>
                        </Form>
                    )}
                </div>
                {canDeleteMessage && (
                    <div className="hidden group-hover:flex items-center gap-x-2 absolute p-1 -top-2 right-5 bg-white dark:bg-zinc-800 border rounded-sm">
                        {canEditMessage && (
                            <ActionTooltip
                                label='Editar mensaje'
                                side="left"
                            >
                                <Edit
                                    onClick={() => setIsEditing(true)}
                                    className="cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hvoer:text-zinc-300 transition"
                                />
                            </ActionTooltip>
                        )}
                        <ActionTooltip
                            label='Eliminar mensaje'
                            side="top"
                        >
                            <Trash
                                onClick={() => onOpen('delete-message', {
                                    apiUrl: `${socketUrl}/${id}`,
                                    query: socketQuery
                                })}
                                className="cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hvoer:text-zinc-300 transition"
                            />
                        </ActionTooltip>
                    </div>
                )}
            </div>
        </div>
    )
}
