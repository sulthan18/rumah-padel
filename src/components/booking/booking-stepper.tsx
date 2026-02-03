"use client"

import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface BookingStepperProps {
    currentStep: 1 | 2 | 3
    isPaymentSuccess?: boolean
    isCurrentStepChecked?: boolean
}

export function BookingStepper({ currentStep, isPaymentSuccess = false, isCurrentStepChecked = false }: BookingStepperProps) {
    const steps = [
        {
            number: 1,
            label: "Pilih Jadwal",
            isCompleted: currentStep > 1,
        },
        {
            number: 2,
            label: "Pembayaran",
            isCompleted: currentStep > 2 || (currentStep === 2 && isPaymentSuccess),
        },
        {
            number: 3,
            label: "Selesai",
            isCompleted: currentStep > 3 || (currentStep === 3 && isCurrentStepChecked),
        },
    ]

    return (
        <div className="hidden md:flex items-center gap-2 text-sm z-50">
            {steps.map((step, index) => {
                const isActive = step.number === currentStep
                const isCheck = step.isCompleted || (step.number === 3 && isActive) // Step 3 always checked if active? Or just active.
                // User requirement: "Selesai, dibagian tersebut berubah menjadi centang"
                // So if currentStep is 3, Step 3 should HAVE checkmark.

                const showCheck = step.isCompleted || (step.number === 3 && currentStep === 3)

                return (
                    <div key={step.number} className="flex items-center gap-2">
                        {index > 0 && (
                            <div className={cn(
                                "w-8 h-0.5",
                                isActive || step.isCompleted ? "bg-primary" : "bg-zinc-200"
                            )} />
                        )}

                        <div className={cn(
                            "flex items-center gap-2",
                            isActive ? "font-bold text-foreground" : "text-muted-foreground",
                            step.isCompleted && "text-primary font-medium"
                        )}>
                            <div className={cn(
                                "rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold transition-all",
                                showCheck ? "bg-primary text-white" :
                                    isActive ? "bg-primary text-white shadow-lg shadow-primary/30" : "bg-zinc-200 text-zinc-500"
                            )}>
                                {showCheck ? <Check className="w-3.5 h-3.5" /> : step.number}
                            </div>
                            <span>{step.label}</span>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
