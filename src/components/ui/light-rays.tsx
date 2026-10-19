"use client"

import { useEffect, useState, type CSSProperties } from "react"
import { motion } from "motion/react"
import { cn } from "@/lib/utils"

interface LightRay {
  id: number
  width: string
  delay: number
  duration: number
  rotate: number
  left: string
  gradient: string
}

interface LightRaysProps extends React.HTMLAttributes<HTMLDivElement> {
  ref?: React.Ref<HTMLDivElement>
  count?: number
  color?: string
  blur?: number
  speed?: number
  length?: string
}

const createRays = (count: number, cycle: number): LightRay[] => {
  if (count <= 0) return []
  return Array.from({ length: count }, (_, i) => {
    const progress = i / count
    const width = 40 + Math.random() * 120
    const delay = progress * cycle
    const duration = cycle * (0.6 + Math.random() * 0.4)
    const rotate = -20 + Math.random() * 40
    const left = `${progress * 100}%`
    return {
      id: i,
      width: `${width}px`,
      delay,
      duration,
      rotate,
      left,
      gradient: `linear-gradient(to bottom, transparent, currentColor, transparent)`,
    }
  })
}

function Ray({
  width,
  delay,
  duration,
  rotate,
  left,
  gradient,
  length,
}: LightRay & { length: string }) {
  return (
    <motion.div
      style={
        {
          position: "absolute",
          top: "-10%",
          left,
          width,
          height: length,
          background: gradient,
          transform: `rotate(${rotate}deg)`,
          transformOrigin: "top center",
        } as CSSProperties
      }
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 1, 0] }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
        repeatDelay: duration * 0.1,
      }}
    />
  )
}

export function LightRays({
  className,
  style,
  count = 7,
  color = "rgba(160, 210, 255, 0.2)",
  blur = 36,
  speed = 14,
  length = "70vh",
  ref,
  ...props
}: LightRaysProps) {
  const [rays, setRays] = useState<LightRay[]>([])
  const cycleDuration = Math.max(speed, 0.1)

  useEffect(() => {
    setRays(createRays(count, cycleDuration))
  }, [count, cycleDuration])

  return (
    <div
      ref={ref}
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      style={{ color, ...style }}
      {...props}
    >
      <div
        className="absolute inset-0"
        style={{ filter: `blur(${blur}px)` }}
      >
        {rays.map((ray) => (
          <Ray key={ray.id} {...ray} length={length} />
        ))}
      </div>
    </div>
  )
}
