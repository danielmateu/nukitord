'use client'

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle }
    from "../ui/dialog"

import { useModal } from "@/hooks/use-modal-store"

import { Button } from "../ui/button"

import { useEffect, useState } from 'react';
import axios from "axios"
import qs from "query-string";
import { useToast } from "@/components/ui/use-toast"

export const DeleteMessageModal = () => {

    const { isOpen, onClose, type, data } = useModal()

    const { toast } = useToast()
    const [isMounted, setIsMounted] = useState(false)

    const isModalOpen = isOpen && type === 'delete-message'
    const { apiUrl, query } = data

    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    const onClick = async () => {
        try {
            setIsLoading(true)

            const url = qs.stringifyUrl({
                url: apiUrl || '',
                query
            })
            await axios.delete(url)

            toast({
                title: 'Mensaje eliminado',
                description: 'Tu mensaje ha sido eliminado correctamente'
            })

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
                                    Eliminar el mensaje
                                </DialogTitle>
                                <DialogDescription className="text-center text-zinc-500">
                                    ¿Estás seguro de que quieres eliminar el mensaje? <br />
                                    Será eliminado permanentemente.
                                </DialogDescription>
                            </>
                        )
                    }
                    {
                        isLoading && (
                            <>
                                <p className="text-center">Eliminando el mensaje </p>
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
