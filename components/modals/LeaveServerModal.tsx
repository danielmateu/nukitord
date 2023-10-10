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

export const LeaveServerModal = () => {

    const { isOpen, onClose, type, data } = useModal()
    const router = useRouter()
    const { toast } = useToast()

    const isModalOpen = isOpen && type === 'leave-server'
    const { server } = data
    const [isMounted, setIsMounted] = useState(false)

    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    const onClick = async () => {
        try {
            setIsLoading(true)

            await axios.patch(`/api/servers/${server?.id}/leave`)
            toast({
                title: 'Servidor abandonado',
                description: 'Has abandonado el servidor correctamente'
            })
            router.refresh()
            router.push('/')
            onClose()

        } catch (error) {
            console.log(error);
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
                                    Salir del servidor
                                </DialogTitle>
                                <DialogDescription className="text-center text-zinc-500">
                                    ¿Estás seguro de que quieres salir del servidor <span className="font-semibold text-indigo-500">{server?.name}</span>?
                                </DialogDescription>
                            </>
                        )
                    }
                    {
                        isLoading && (
                            <>
                                <p className="text-center">Abandonando el servidor <span className="font-semibold text-indigo-500">{server?.name}</span></p>
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
