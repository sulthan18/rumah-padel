"use client"

import { motion, useReducedMotion, Variants } from "framer-motion"
import { createContext, useContext } from "react"

// Context to handle staggering if needed across different components
const AnimationContext = createContext({ stagger: false })

export function BlurIn({
    children,
    className,
    delay = 0,
    duration = 0.8,
    fullWidth = false,
}: {
    children: React.ReactNode
    className?: string
    delay?: number
    duration?: number
    fullWidth?: boolean
}) {
    const shouldReduceMotion = useReducedMotion()

    const variants: Variants = {
        hidden: { opacity: 0, filter: "blur(10px)", y: 20 },
        visible: {
            opacity: 1,
            filter: "blur(0px)",
            y: 0,
            transition: { duration, delay, ease: "easeOut" }
        }
    }

    if (shouldReduceMotion) {
        variants.hidden = { opacity: 0 }
        variants.visible = { opacity: 1, transition: { duration } }
    }

    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "0px 0px -100px" }}
            variants={variants}
            className={className}
            style={{ width: fullWidth ? "100%" : "auto" }}
        >
            {children}
        </motion.div>
    )
}

export function ScaleIn({
    children,
    className,
    delay = 0,
    duration = 0.5,
    fullWidth = false,
}: {
    children: React.ReactNode
    className?: string
    delay?: number
    duration?: number
    fullWidth?: boolean
}) {
    const shouldReduceMotion = useReducedMotion()

    const variants: Variants = {
        hidden: { opacity: 0, scale: 0.9 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                duration,
                delay,
                type: "spring",
                stiffness: 260,
                damping: 20
            }
        }
    }

    if (shouldReduceMotion) {
        variants.hidden = { opacity: 0 }
        variants.visible = { opacity: 1, transition: { duration } }
    }

    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "0px 0px -100px" }}
            variants={variants}
            className={className}
            style={{ width: fullWidth ? "100%" : "auto" }}
        >
            {children}
        </motion.div>
    )
}

export function SlideIn3D({
    children,
    className,
    delay = 0,
    duration = 0.8,
    direction = "up"
}: {
    children: React.ReactNode
    className?: string
    delay?: number
    duration?: number
    direction?: "up" | "down" | "left" | "right"
}) {
    const shouldReduceMotion = useReducedMotion()

    const transforms = {
        up: { y: 100, rotateX: 45 },
        down: { y: -100, rotateX: -45 },
        left: { x: -100, rotateY: -45 },
        right: { x: 100, rotateY: 45 }
    }

    const transform = transforms[direction]

    const variants: Variants = {
        hidden: {
            opacity: 0,
            ...transform,
            perspective: 1000
        },
        visible: {
            opacity: 1,
            x: 0,
            y: 0,
            rotateX: 0,
            rotateY: 0,
            transition: {
                duration,
                delay,
                type: "spring",
                stiffness: 100,
                damping: 20
            }
        }
    }

    if (shouldReduceMotion) {
        variants.hidden = { opacity: 0 }
        variants.visible = { opacity: 1, transition: { duration } }
    }

    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "0px 0px -100px" }}
            variants={variants}
            className={className}
            style={{ transformStyle: "preserve-3d", perspective: "1000px" }}
        >
            {children}
        </motion.div>
    )
}

export function TextReveal({
    text,
    className,
    delay = 0
}: {
    text: string
    className?: string
    delay?: number
}) {
    const words = text.split(" ")

    const container: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.12, delayChildren: delay }
        }
    }

    const child: Variants = {
        hidden: { opacity: 0, y: 20, filter: "blur(10px)" },
        visible: {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            transition: {
                type: "spring",
                damping: 12,
                stiffness: 100
            }
        }
    }

    return (
        <motion.div
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className={`flex flex-wrap ${className}`}
        >
            {words.map((word, index) => (
                <motion.span
                    variants={child}
                    style={{ marginRight: "0.25em" }}
                    key={index}
                    className="inline-block"
                >
                    {word}
                </motion.span>
            ))}
        </motion.div>
    )
}
