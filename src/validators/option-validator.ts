// bg-zinc-900 border-zinc-900
// bg-blue-950 border-blue-950
// bg-rose-900 border-rose-900

import { PRODUCT_PRICES } from "@/config/products"

export const COLORS = [
    { label: 'Black', value: 'black', tw: 'zinc-900' },
    { label: 'Blue', value: 'blue', tw: 'blue-950' },
    { label: 'Rose', value: 'rose', tw: 'rose-900' },
] as const

export const MODELS = {
    phone: 'models',
    options: [
        
        {
            label: 'iPhone 15',
            value: 'iphone15',
        },
        {
            label: 'iPhone 14',
            value: 'iphone14',
        },
        {
            label: 'iPhone 13',
            value: 'iphone13',
        },
        {
            label: 'iPhone 12',
            value: 'iphone12',
        },
        {
            label: 'iPhone 11',
            value: 'iphone11',
        },
    ]
} as const

export const MATERIALS = {
    type: 'material',
    options: [
        {
            label: 'Silicone',
            value: 'silicone',
            description: undefined,
            price: PRODUCT_PRICES.material.silicone
        },
        {
            label: 'Soft Polycarbonate',
            value: 'polycarbonate',
            description: 'Scratch-resistant coating',
            price: PRODUCT_PRICES.material.polycarbonate
        },
    ]
} as const

export const FINISHES = {
    type: 'finish',
    options: [
        {
            label: 'Smooth Finish',
            value: 'smooth',
            description: undefined,
            price: PRODUCT_PRICES.finish.smooth
        },
        {
            label: 'Textured Finish',
            value: 'textured',
            description: 'Soft grippy texture',
            price: PRODUCT_PRICES.finish.textured
        },
    ]
} as const

