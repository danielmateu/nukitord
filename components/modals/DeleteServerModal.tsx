'use client'

// import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle }
    from "../ui/dialog"

import { useModal } from "@/hooks/use-modal-store"

import { Button } from "../ui/button"

import { useEffect, useState } from 'react';
import axios from "axios"
import { useRouter } from "next/navigation";

import { useToast } from "@/components/ui/use-toast"

export const DeleteServerModal = () => {

    const { isOpen, onClose, type, data } = useModal()
    const [isMounted, setIsMounted] = useState(false)
    const router = useRouter()
    const { toast } = useToast()

    const isModalOpen = isOpen && type === 'delete-server'
    const { server } = data

    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    const onClick = async () => {
        try {
            setIsLoading(true)

            await axios.delete(`/api/servers/${server?.id}`)
            toast({
                title: 'Servidor eliminado',
                description: 'Tu servidor ha sido eliminado correctamente'
            })
            router.refresh()
            router.push('/')
            onClose()

        } catch (error) {
            console.log(error);
            toast({
                title: 'Error',
                description: 'Ha ocurrido un error al eliminar el servidor'
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
                                    Eliminar el servidor
                                </DialogTitle>
                                <DialogDescription className="text-center text-zinc-500">
                                    ¿Estás seguro de que quieres eliminar el servidor? <br />
                                    <span className="font-semibold text-indigo-500">{server?.name}</span> Será eliminado permanentemente.
                                </DialogDescription>
                            </>
                        )
                    }
                    {
                        isLoading && (
                            <>
                                <p className="text-center">Eliminando el servidor <span className="font-semibold text-indigo-500">{server?.name}</span></p>
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
