/**
 * SectionDivider — premium SVG wave / angled dividers between page sections.
 *
 * Usage:
 *   <SectionDivider from="#ffffff" to="#fdf6ee" />
 *   <SectionDivider from="#fdf6ee" to="#1c1814" variant="wave" />
 *
 * `from` = background of the section ABOVE
 * `to`   = background of the section BELOW
 */

interface SectionDividerProps {
    from: string
    to: string
    /** "wave" | "tilt" | "curve" — default "wave" */
    variant?: 'wave' | 'tilt' | 'curve'
    /** flip the SVG horizontally */
    flip?: boolean
}

export default function SectionDivider({
    from,
    to,
    variant = 'wave',
    flip = false,
}: SectionDividerProps) {
    const outerStyle = {
        background: from,
        lineHeight: 0,
        display: 'block',
        overflow: 'hidden',
    }

    const transform = flip ? 'scaleX(-1)' : undefined

    if (variant === 'tilt') {
        return (
            <div style={outerStyle} aria-hidden="true">
                <svg
                    viewBox="0 0 1440 60"
                    xmlns="http://www.w3.org/2000/svg"
                    preserveAspectRatio="none"
                    style={{ display: 'block', width: '100%', height: '60px', transform }}
                >
                    <polygon points="0,0 1440,60 1440,60 0,60" fill={to} />
                    <polygon points="0,0 1440,60 0,60" fill={to} />
                </svg>
            </div>
        )
    }

    if (variant === 'curve') {
        return (
            <div style={outerStyle} aria-hidden="true">
                <svg
                    viewBox="0 0 1440 70"
                    xmlns="http://www.w3.org/2000/svg"
                    preserveAspectRatio="none"
                    style={{ display: 'block', width: '100%', height: '70px', transform }}
                >
                    <ellipse cx="720" cy="0" rx="780" ry="70" fill={to} />
                </svg>
            </div>
        )
    }

    // default: wave
    return (
        <div style={outerStyle} aria-hidden="true">
            <svg
                viewBox="0 0 1440 72"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="none"
                style={{ display: 'block', width: '100%', height: '72px', transform }}
            >
                <path
                    d="M0,36 C240,72 480,0 720,36 C960,72 1200,0 1440,36 L1440,72 L0,72 Z"
                    fill={to}
                />
            </svg>
        </div>
    )
}
