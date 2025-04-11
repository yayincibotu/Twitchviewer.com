import * as React from "react"
import { Separator } from "@/components/ui/separator"

export interface SeparatorWithTextProps {
  children: React.ReactNode
  className?: string
}

export function SeparatorWithText({
  children,
  className,
  ...props
}: SeparatorWithTextProps & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className="relative flex items-center w-full my-4">
      <Separator className="absolute w-full" />
      <div className="z-10 px-2 mx-auto">
        {children}
      </div>
    </div>
  )
}