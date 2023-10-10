import { Hash } from "lucide-react"

interface ChatWelcomeProps {
    name: string
    type: 'channel' | 'conversation'
}

export const ChatWelcome = ({
    name,
    type
}: ChatWelcomeProps) => {
    return (
        <div className="space-y-2 px-4 mb-4">
            {type === 'channel' && (
                <div className="flex items-center justify-center h-[75px] w-[75px] rounded-full bg-zinc-500 dark:bg-zinc-700">
                    <Hash size={32} className="text-white" />
                </div>
            )}
            <p className="text-xl md:text-3xl font-semibold">
                {type === 'channel' ? `Bienvenido a #` : ``}{name}
            </p>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm">
                {type === 'channel' ? `Este es el comienzo del canal #${name}.` : `Este es el comienzo de tu conversación con ${name}.`}
            </p>
        </div>
    )
}
