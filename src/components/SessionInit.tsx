'use client'

import { useEffect, useRef } from 'react'
import { useCartStore } from '@/store/cartStore'

export default function SessionInit() {
    const initializeSession = useCartStore((state) => state.initializeSession)
    const initialized = useRef(false)

    useEffect(() => {
        if (!initialized.current) {
            initialized.current = true
            initializeSession()
        }
    }, [initializeSession])

    return null
}
