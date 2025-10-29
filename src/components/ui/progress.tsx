"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

function Progress({
  className,
  value,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root>) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full bg-white/10",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className="h-full w-full flex-1 transition-all duration-300 ease-in-out rounded-full"
        style={{ 
          transform: `translateX(-${100 - (value || 0)}%)`,
          background: 'linear-gradient(135deg, hsl(217, 91%, 60%) 0%, hsl(316, 73%, 69%) 50%, hsl(266, 85%, 58%) 100%)'
        }}
      />
    </ProgressPrimitive.Root>
  )
}

export { Progress }
