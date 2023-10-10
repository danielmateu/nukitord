'use client'

import { cn } from "@/lib/utils";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { ActionTooltip } from "../ActionTooltip";

interface NavigationItemProps {
    id: string;
    name: string;
    imageUrl: string;
}

export const NavigationItem = ({
    name,
    imageUrl,
    id
}: NavigationItemProps) => {

    const params = useParams()
    const router = useRouter()

    const onClick = () => {
        router.push(`/servers/${id}`)
    }

    return (
        <ActionTooltip
            side="right"
            align="center"
            label={name}
        >
            <button
                className="group relative flex items-center mb-2"
                onClick={onClick}
            >
                <div className={cn(
                    "absolute left-0 bg-primary rounded-r-full transition-all w-[4px]",
                    params?.serverId !== id && "group-hover:h-[20px]",
                    params?.serverId === id ? "h-[36px]" : "h-[8px]"
                )} />

                <div className={cn(
                    "relative group flex mx-3 h-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden",
                    params?.serverId === id && "bg-primary/10 text-primary rounded-[16px]"
                )}>
                    <Image
                        width={50}
                        height={50}
                        src={imageUrl}
                        alt="Channel Image"
                    />
                </div>


            </button>

        </ActionTooltip>
    )
}
