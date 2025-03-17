'use client'
import { cn } from '@/lib/utils'
import { CaseColor } from '@prisma/client'
import { AspectRatio } from '@radix-ui/react-aspect-ratio'
import React, { useEffect, useRef, useState } from 'react'

const PhonePreview = ({croppedImageUrl, color}: {croppedImageUrl: string, color: CaseColor}) => {
    const ref = useRef<HTMLDivElement>(null)

    const caseBackgroundColor = color === 'black'? 'bg-zinc-900' : color === 'blue' ? 'bg-blue-950' : 'bg-rose-900'

    const [renderedDimension, setRenderedDimension] = useState({height: 0, width: 0})

    const handleResize = () => {
        if(!ref.current) return

        const {width, height} = ref.current.getBoundingClientRect()

        setRenderedDimension({height, width})
    }
    useEffect(() => {
        handleResize()
        window.addEventListener('resize', handleResize)

        return () => window.removeEventListener('resize', handleResize)
    }, [ref.current])

  return (
    <AspectRatio ref={ref} ratio={3000/2001}>
        <div className="absolute z-20 scale-[1.0352]" 
            style={{
                left: renderedDimension.width / 2 - renderedDimension.width/ (1216/121),
                top: renderedDimension.height / 6.22,
            }}
        >
            <img width={renderedDimension.width/(3000/637)} 
                src={croppedImageUrl} alt="your case image" 
                className={cn("phone-skew relative z-20 rounded-t-[15px] rounded-b-[10px] md:rounded-t-[30px] md:rounded-b-[20px]", caseBackgroundColor)} />
        </div>

        <div className="relative h-full w-full z-40">
            <img src="/clearphone.png" alt="phone" className="pointer-events-none h-full w-full antialiased rounded-md" />
        </div>
    </AspectRatio>
  )
}

export default PhonePreview