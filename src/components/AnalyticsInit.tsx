'use client';

import { useEffect, useRef } from 'react';
import { initMixpanel } from '@/lib/mixpanel';

export default function AnalyticsInit() {
    const initialized = useRef(false);

    useEffect(() => {
        if (!initialized.current) {
            initialized.current = true;
            initMixpanel();
        }
    }, []);

    return null;
}
