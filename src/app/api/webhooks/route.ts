import { db } from "@/db"
import { headers } from "next/headers"
import { NextResponse } from "next/server"
import {stripe} from '@/lib/stripe'
import Stripe  from "stripe"
import {Resend} from 'resend'
import OrderReceivedEmail from '@/components/email/OrderReceivedEmail'

const resend = new Resend(process.env.RESEND_API_KEY!)

export async function POST(req: Request) {
    try{
        const body = await req.text()
        const signature = headers().get("stripe-signature")

        if(!signature){
            throw new Response('Invalid signature', {status: 400})
        }

        const event = stripe.webhooks.constructEvent(body, signature, process.env.WEBHOOK_SIGNING_SECRET!)

        if(event.type === 'checkout.session.completed'){
            if(!event.data.object.customer_details?.email){
                throw new Error('Missing user email')
            }

            const session = event.data.object as Stripe.Checkout.Session

            const {userId, orderId} = session.metadata || {
                userId: null,
                orderId: null,
            }

            if(!userId || !orderId){
                throw new Error("Invalid request metadata")
            }

            const billingAddress = session.customer_details!.address
            const shippingAddress = session.shipping_details!.address
            
            const updatedOrder = await db.order.update({
                where: {
                    id: orderId,
                },
                data: {
                    isPaid: true,
                    shippingAddress: {
                        create: {
                            name: session.customer_details!.name!,
                            city: shippingAddress!.city!,
                            country: shippingAddress!.country!,
                            postalCode: shippingAddress!.postal_code!,
                            state: shippingAddress!.state!,
                            street: shippingAddress!.line1!,
                            
                        }
                    },
                    billingAddress: {
                        create: {
                            name: session.customer_details!.name!,
                            city: billingAddress!.city!,
                            country: billingAddress!.country!,
                            postalCode: billingAddress!.postal_code!,
                            state: billingAddress!.state!,
                            street: billingAddress!.line1!,

                        }
                    },
                }

            })

            await resend.emails.send({
                from: 'CaseCobra <gauravgkb99@gmail.com>',
                to: [event.data.object.customer_details.email],
                subject: 'Thanks for your order!',
                react: OrderReceivedEmail({
                  orderId,
                  orderDate: updatedOrder.createdAt.toLocaleDateString(),
                  // @ts-ignore
                  shippingAddress: {
                    name: session.customer_details!.name!,
                    city: shippingAddress!.city!,
                    country: shippingAddress!.country!,
                    postalCode: shippingAddress!.postal_code!,
                    street: shippingAddress!.line1!,
                    state: shippingAddress!.state,
                  },
                }),
              })
        }

        return NextResponse.json({result: event, ok: true})
    }
    catch(error){
        console.log(error)
        return NextResponse.json({message: error, ok: false},  {status: 500})
    }
    
}