import { useEffect, useState } from "react";

export const useOrigin = () => {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])


    /* The line `const origin = typeof window !== 'undefined' && window.location.origin ?
    window.location.origin : ''` is checking if the `window` object is defined and if the
    `window.location.origin` property exists. */
    const origin = typeof window !== 'undefined' && window.location.origin ? window.location.origin : ''

    if (!mounted) return ''

    return origin

}
