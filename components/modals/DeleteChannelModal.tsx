'use client'

// import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle }
    from "../ui/dialog"

import { useModal } from "@/hooks/use-modal-store"

import { Button } from "../ui/button"

import { useEffect, useState } from 'react';
import axios from "axios"
import { useParams, useRouter } from "next/navigation";
import qs from "query-string";
import { useToast } from "@/components/ui/use-toast"

export const DeleteChannelModal = () => {

    const { isOpen, onClose, type, data } = useModal()
    const router = useRouter()
    const { toast } = useToast()
    const [isMounted, setIsMounted] = useState(false)

    const isModalOpen = isOpen && type === 'delete-channel'
    const { server, channel } = data

    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    const onClick = async () => {
        try {
            setIsLoading(true)

            const url = qs.stringifyUrl({
                url: `/api/channels/${channel?.id}`,
                query: {
                    serverId: server?.id
                }
            })
            await axios.delete(url)

            toast({
                title: 'Canal eliminado',
                description: 'Tu canal ha sido eliminado correctamente'
            })

            router.refresh()
            router.push(`/servers/${server?.id}`)
            onClose()

        } catch (error) {
            console.log(error);
            toast({
                title: 'Error',
                description: 'Ha ocurrido un error al eliminar el canal'
            })
        } finally {
            setIsLoading(false)
        }
    }

    if (!isMounted) return null
    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    {
                        !isLoading && (
                            <>
                                <DialogTitle className="text-2xl text-center font-semibold">
                                    Eliminar el canal
                                </DialogTitle>
                                <DialogDescription className="text-center text-zinc-500">
                                    ¿Estás seguro de que quieres eliminar el canal? <br />
                                    <span className="font-semibold text-indigo-500">#{channel?.name}</span> será eliminado permanentemente.
                                </DialogDescription>
                            </>
                        )
                    }
                    {
                        isLoading && (
                            <>
                                <p className="text-center">Eliminando el canal <span className="font-semibold text-indigo-500">{channel?.name}</span></p>
                                <div className="spinner">
                                    <div className="double-bounce1"></div>
                                    <div className="double-bounce2"></div>
                                </div>
                            </>

                        )
                    }
                </DialogHeader>
                <DialogFooter className="bg-gray-100 px-6 py-4">
                    <div className="flex items-center justify-between w-full">
                        <Button
                            disabled={isLoading}
                            onClick={onClose}
                            variant={'ghost'}
                        >Cancelar</Button>
                        <Button
                            disabled={isLoading}
                            onClick={onClick}
                            variant={'primary'}
                        >Confirmar</Button>
                    </div>

                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
