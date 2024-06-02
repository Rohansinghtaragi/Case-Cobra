'use client'
import { configuration } from '@prisma/client'
import Phone from '@/components/Phone'
import React, { useEffect, useState } from 'react'
import Confetti from 'react-dom-confetti'
import { COLORS, MODELS } from '@/validators/option-validator'
import { cn, formatPrice } from '@/lib/utils'
import { ArrowRight, Check } from 'lucide-react'
import { BASE_PRICE, PRODUCT_PRICES } from '@/config/products'
import { Button } from '@/components/ui/button'
import { useMutation } from '@tanstack/react-query'
import { createCheckoutSession } from './actions'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'
import { useKindeBrowserClient} from '@kinde-oss/kinde-auth-nextjs'
import LoginModal from '@/components/LoginModal'

const DesignPreview = ({configuration}: {configuration: configuration}) => {
    const router = useRouter()
    const [showConfetti, setShowConfetti] = useState<boolean>(false)
    useEffect(() => setShowConfetti(true), [])

    const { user } = useKindeBrowserClient()
    const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false)

    const { color, croppedImageUrl, model, finish, material} = configuration
    const {label: modelLabel} = MODELS.options.find((m) => m.value === model)!
    const tw = COLORS.find((c) => c.value === color)?.tw

    const {toast} = useToast()
    const totalPrice =  (BASE_PRICE + (finish=='textured'?3_00:0) + (material=='polycarbonate'?5_00:0))/100

    const {mutate: createPaymentSession} = useMutation({
      mutationKey: ['get-checkout-session'],
      mutationFn: createCheckoutSession,
      onSuccess: ({ url }) => {
        if(url){
          router.push(url)
        }
        else{
          throw new Error('Unable to retrieve payment URL')
        }
      },
      onError: (error) => {
        toast({
          title: 'Something went wrong',
          description: 'There was an error at our end. Please try again later.',
          variant: 'destructive',
        })
        console.log(error)
      }
    })

    const handleCheckout = () => {
      if(user) {
        createPaymentSession({configId: configuration.id})
      }
      else{
        localStorage.setItem('configurationId', configuration.id)
        setIsLoginModalOpen(true)
      }
    }

  return (
    <>
    <div aria-hidden="true" className="pointer-events-none select-none absolute inset-0 overflow-hidden flex justify-center">
        <Confetti active={showConfetti}
           config = {{
            spread: 140,
            elementCount: 300,
            dragFriction: 0.12,
            duration: 5000,
            height: '10px',
            width: '10px',
            stagger: 3,
            colors: ["#a864fd", "#29cdff", "#78ff44", "#ff718d", "#fdff6a"]
          }}
        />
    </div>

    <LoginModal isOpen={isLoginModalOpen} setIsOpen={setIsLoginModalOpen} />

    <div className="mt-20 mb-10 grid grid-cols-1 text-sm sm:grid-cols-12 sm:grid-rows-1 sm:gap-x-6 md:gap-x-8 lg:gap-x-12">
        <div className="md:col-span-4 lg:col-span-3 md:row-span-2 md:row-end-2">
            <Phone imgSrc={croppedImageUrl!} className={cn(`bg-${tw}`, "max-w-[150px] md:max-w-full")} />
        </div>

        <div className="mt-6 sm:col-span-9 sm:mt-0 md:row-end-1">
          <h3 className="text-3xl font-bold tracking-tight text-gray-900">
            Your {modelLabel} Case
          </h3>
          <div className="mt-3 flex items-center gap-1 5 text-base">
            <Check className="w-4 h-4 text-green-600" />
            In stock and ready to ship
          </div>
        </div>

        <div className="sm:col-span-12 md:col-span-9 text-base">
          <div className="grid grid-cols-1 gap-y-8 border-b border-gray-200 py-8 sm:grid-cols-2 sm:gap-x-6 sm:py-6 md:py-10">
            <div>
              <p className="font-medium text-zinc-950">
                Highlights
              </p>
              <ol className="mt-3 text-zinc-700 list-disc list-inside">
                <li>Wireless charging compatible</li>
                <li>TPU shock absorption</li>
                <li>Packaging made from recycled material</li>
                <li>5 years print warranty</li>
              </ol>
            </div>

            <div>
            <p className="font-medium text-zinc-950">
                Highlights
              </p>
              <ol className="mt-3 text-zinc-700 list-disc list-inside">
                <li>High-quality, durable material</li>
                <li>Scratch and fingerprint resistant</li>
              </ol>
            </div> 
          </div>

          <div className="mt-8">
            <div className="bg-gray-100 p-6 sm:rounded-lg sm:p-8">
              <div className="flow-root text-sm">
                <div className="flex items-center justify-between py-1 mt-2">
                  <p className="text-gray-600">Base Price</p>
                  <p className="font-medium text-gray-900">
                    {formatPrice(BASE_PRICE /100)}
                  </p>
                </div>

                {finish === 'textured'?(
                  <div className="flex items-center justify-between py-1 mt-2">
                    <p className="text-gray-600">Textured Finish</p>
                    <p className="font-medium text-gray-900">
                      {formatPrice(PRODUCT_PRICES.finish.textured /100)}
                    </p>
                  </div>
                ): null}

                {material === 'polycarbonate'?(
                  <div className="flex items-center justify-between py-1 mt-2">
                    <p className="text-gray-600">Soft Polycarbonate Material</p>
                    <p className="font-medium text-gray-900">
                      {formatPrice(PRODUCT_PRICES.material.polycarbonate /100)}
                    </p>
                  </div>
                ): null}

                <div className="my-2 h-px bg-gray-200" />
                <div className="flex items-center justify-between py-2">
                  <p className="font-semibold text-gray-900">
                    Order total
                  </p>
                  <p className="font-semibold text-gray-900">
                      {formatPrice(totalPrice)}
                    </p>
                </div>

              </div>
            </div>

            <div className="mt-8 flex justify-end pb-12">
                <Button onClick={() => handleCheckout()} className='px-4 sm:px-6 lg:px-8'>
                  Check out <ArrowRight className="ml-1.5 h-4 w-4 inline" />
                </Button>
            </div>
          </div>
        </div>
    </div>
    </>
  )
}

export default DesignPreview