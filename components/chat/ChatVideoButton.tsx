'use client'

import { Video, VideoOff } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import qs from 'query-string'
import { ActionTooltip } from '../ActionTooltip'



export const ChatVideoButton = () => {

    const searchParams = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()

    const onClick = () => {
        const url = qs.stringifyUrl({
            url: pathname || '',
            query: {
                video: isVideo ? undefined : true
            }
        }, { skipNull: true })

        router.push(url)
    }

    const isVideo = searchParams?.get('video') === 'true'

    const Icon = isVideo ? VideoOff : Video
    const tooltipLabel = isVideo ? 'Finaliza la video llamada' : 'Inicia una video llamada'

    return (
        <ActionTooltip
            side='bottom'
            label={tooltipLabel}
        >
            <button
                onClick={onClick}
                className='hover:opacity-75 transition mr-4'
            >
                <Icon className='h-6 w-6 text-zinc-500 dark:text-zinc-400' />
            </button>
        </ActionTooltip>
    )
}
