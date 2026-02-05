"use client"

import { createContext, useContext } from "react"
import { motion, useReducedMotion } from "framer-motion"

const FadeInStaggerContext = createContext(false)

const viewport = { once: true, margin: "0px 0px -200px" }

export function FadeIn({
    children,
    className,
    delay = 0,
    duration = 0.5,
    direction = "up",
    fullWidth = false,
}: {
    children: React.ReactNode
    className?: string
    delay?: number
    duration?: number
    direction?: "up" | "down" | "left" | "right" | "none"
    fullWidth?: boolean
}) {
    const shouldReduceMotion = useReducedMotion()
    const isInStaggerGroup = useContext(FadeInStaggerContext)

    const directionOffset = {
        up: { y: 24, x: 0 },
        down: { y: -24, x: 0 },
        left: { x: 24, y: 0 },
        right: { x: -24, y: 0 },
        none: { x: 0, y: 0 },
    }

    return (
        <motion.div
            variants={{
                hidden: {
                    opacity: 0,
                    ...directionOffset[direction]
                },
                visible: {
                    opacity: 1,
                    y: 0,
                    x: 0,
                    transition: { duration, ease: "easeOut" }
                },
            }}
            transition={{ duration, delay, ease: "easeOut" }}
            {...(isInStaggerGroup
                ? {}
                : {
                    initial: "hidden",
                    whileInView: "visible",
                    viewport,
                })}
            className={className}
            style={{ width: fullWidth ? "100%" : "auto" }}
        >
            {children}
        </motion.div>
    )
}

export function FadeInStagger({
    children,
    className,
    faster = false,
    ...props
}: {
    children: React.ReactNode
    className?: string
    faster?: boolean
} & React.ComponentProps<typeof motion.div>) {
    return (
        <FadeInStaggerContext.Provider value={true}>
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={viewport}
                transition={{ staggerChildren: faster ? 0.12 : 0.2 }}
                className={className}
                {...props}
            >
                {children}
            </motion.div>
        </FadeInStaggerContext.Provider>
    )
}
