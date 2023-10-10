'use client'

import { ServerWithMembersWithProfiles } from "@/types"
import { MemberRole, Role, Server } from "@prisma/client"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { ChevronDown, LogOut, PlusCircle, SettingsIcon, Trash, UserPlus, Users } from "lucide-react"
import { useModal } from "@/hooks/use-modal-store"



interface ServerHeaderProps {
    server: ServerWithMembersWithProfiles
    role?: MemberRole
}

export const ServerHeader = ({
    server,
    role
}: ServerHeaderProps) => {

    const { onOpen } = useModal()

    const isAdmin = role === MemberRole.ADMIN
    const isModerator = isAdmin || role === MemberRole.MODERATOR

    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                asChild
                className="focus:outline-none"
            >
                <button className="w-full text-md font-semibold px-2 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition">
                    {server.name}
                    <ChevronDown className="h-5 w-5 ml-auto mr-6 md:mr-0" />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 text-xs font-medium text-black dark:text-neutral-400 space-y-[2px]">
                {isModerator && (
                    <DropdownMenuItem
                        onClick={() => onOpen('invite', { server })}
                        className="text-indigo-600 dark:text-indigo-400 px-3 py-2 text-sm cursor-pointer"
                    >
                        Invita a un amigo
                        <UserPlus className="h-4 w-4 ml-auto" />
                    </DropdownMenuItem>
                )}
                {isAdmin && (
                    <DropdownMenuItem
                        onClick={() => onOpen('edit-server', { server })}
                        className="px-3 py-2 text-sm cursor-pointer"
                    >
                        Configura el servidor
                        <SettingsIcon className="h-4 w-4 ml-auto" />
                    </DropdownMenuItem>
                )}
                {isAdmin && (
                    <DropdownMenuItem
                        onClick={() => onOpen('members', { server })}
                        className="px-3 py-2 text-sm cursor-pointer"
                    >
                        Manejo de usuarios
                        <Users className="h-4 w-4 ml-auto" />
                    </DropdownMenuItem>
                )}
                {isModerator && (
                    <DropdownMenuItem
                        onClick={() => onOpen('create-channel', { server })}
                        className="px-3 py-2 text-sm cursor-pointer"
                    >
                        Crea un canal
                        <PlusCircle className="h-4 w-4 ml-auto" />
                    </DropdownMenuItem>
                )}
                {isModerator && (
                    <DropdownMenuSeparator />
                )}
                {isAdmin && (
                    <DropdownMenuItem
                        onClick={() => onOpen('delete-server', { server })}
                        className="px-3 py-2 text-sm cursor-pointer text-rose-500"
                    >
                        Elimina el servidor
                        <Trash className="h-4 w-4 ml-auto" />
                    </DropdownMenuItem>
                )}
                {!isAdmin && (
                    <DropdownMenuItem
                        onClick={() => onOpen('leave-server', { server })}
                        className="px-3 py-2 text-sm cursor-pointer hover:text-rose-500 "
                    >
                        Abandona el servidor
                        <LogOut className="h-4 w-4 ml-auto" />
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
