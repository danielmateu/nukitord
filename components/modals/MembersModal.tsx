'use client'

import { useEffect, useState } from 'react';
import { MemberRole } from '@prisma/client';

import { ServerWithMembersWithProfiles } from "@/types"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle }
    from "../ui/dialog"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger
} from "../ui/dropdown-menu"

import { ScrollArea } from "../ui/scroll-area"

import { Check, Gavel, Loader2, MoreVertical, Shield, ShieldAlert, ShieldCheck, ShieldQuestion } from "lucide-react"

import { useModal } from "@/hooks/use-modal-store"
import { UserAvatar } from "../UserAvatar"

import qs from 'query-string'
import axios from 'axios';
import { useRouter } from 'next/navigation';

import { useToast } from "@/components/ui/use-toast"

const roleIconMap = {
    'GUEST': null,
    'MODERATOR': <ShieldCheck className="w-4 h-4 ml-2 text-indigo-500" />,
    'ADMIN': <ShieldAlert className="w-4 h-4 ml-2 text-rose-500" />
}

export const MembersModal = () => {

    const { onOpen, isOpen, onClose, type, data } = useModal()
    const { toast } = useToast()

    const [loadingId, setLoadingId] = useState('')

    const isModalOpen = isOpen && type === 'members'
    const { server } = data as { server: ServerWithMembersWithProfiles }

    const router = useRouter()
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    const onKick = async (memberId: string) => {
        try {
            setLoadingId(memberId)

            const url = qs.stringifyUrl({
                url: `/api/members/${memberId}`,
                query: {
                    serverId: server?.id,
                }
            })

            const response = await axios.delete(url)
            toast({
                title: 'Miembro expulsado',
                description: 'El miembro ha sido expulsado correctamente'
            })

            router.refresh()

            onOpen('members', { server: response.data })
        } catch (error) {
            console.log(error)
            toast({
                title: 'Error',
                description: 'Ha ocurrido un error al expulsar al miembro'
            })
        } finally {
            setLoadingId('')
        }
    }

    const onRoleChange = async (memberId: string, role: MemberRole) => {
        try {
            setLoadingId(memberId)

            const url = qs.stringifyUrl({
                url: `/api/members/${memberId}`,
                query: {
                    serverId: server?.id,
                    // memberId
                },
            })

            const response = await axios.patch(url, { role })

            toast({
                title: 'Rol cambiado',
                description: 'El rol del miembro ha sido cambiado correctamente'
            })

            router.refresh()
            onOpen('members', { server: response.data })

        } catch (error) {
            console.log(error);
            toast({
                title: 'Error',
                description: 'Ha ocurrido un error al cambiar el rol del miembro'
            })
        } finally {
            setLoadingId('')
        }
    }

    if (!isMounted) return null

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white text-black overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-semibold">
                        Gestionar miembros
                    </DialogTitle>
                    <DialogDescription
                        className="text-center text-zinc-500"
                    >
                        {server?.members?.length} miembros
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea
                    className="mt-8 max-h-[420px] pr-6"
                >
                    {server?.members?.map(member => (
                        <div
                            key={member.id}
                            className="flex items-center gap-x-2 mb-6">
                            <UserAvatar src={member.profile.imageUrl} />
                            <div className="flex flex-col gap-y-1">
                                <div className="flex items-center text-xs font-semibold">
                                    {member.profile.name}
                                    {roleIconMap[member.role]}
                                </div>
                                <p className="text-xs text-zinc-500">{member.profile.email}</p>
                            </div>
                            {server.profileId !== member.profile.id && loadingId !== member.id && (
                                <div className="ml-auto">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger>
                                            <MoreVertical className="w-4 h-4 text-zinc-500" />
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent side='left'>
                                            <DropdownMenuSub>
                                                <DropdownMenuSubTrigger className='flex items-center'>
                                                    <ShieldQuestion className='w-4 h-4 mr-2' />
                                                    <span>Role</span>
                                                </DropdownMenuSubTrigger>
                                                <DropdownMenuPortal>
                                                    <DropdownMenuSubContent>
                                                        <DropdownMenuItem
                                                            onClick={() => onRoleChange(member.id, 'GUEST')}
                                                        >
                                                            <Shield className='h-4 w-4 ml-1 mr-1' />
                                                            Invitado
                                                            {member.role === 'GUEST' && (
                                                                <Check
                                                                    className='h-4 w-4 ml-auto '
                                                                />
                                                            )}
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() => onRoleChange(member.id, 'MODERATOR')}
                                                        >
                                                            <ShieldCheck className='h-4 w-4 ml-1 mr-1' />
                                                            Moderador
                                                            {member.role === 'MODERATOR' && (
                                                                <Check
                                                                    className='h-4 w-4 ml-auto '
                                                                />
                                                            )}
                                                        </DropdownMenuItem>
                                                    </DropdownMenuSubContent>
                                                </DropdownMenuPortal>
                                            </DropdownMenuSub>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem
                                                onClick={() => onKick(member.id)}
                                            >
                                                <Gavel className='h-4 w-4 mr-2' />
                                                Expulsar
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            )}
                            {loadingId === member.id && (
                                <Loader2 className='animate-spin text-zinc-500 ml-auto w-4 h-4' />
                            )}
                        </div>
                    ))}
                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
}
