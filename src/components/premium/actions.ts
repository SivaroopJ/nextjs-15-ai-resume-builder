"use server";

import { env } from "@/env";
import stripe from "@/lib/stripe";
import { currentUser } from "@clerk/nextjs/server";

export async function createCheckoutSession(priceId: string) {
    const user = await currentUser(); // Gives the whole user object
    // auth() returns the userId

    if (!user) {
        throw new Error("User is unauthorized");
    }

    const session = await stripe.checkout.sessions.create({
        line_items: [{price: priceId, quantity: 1}],
        mode: "subscription",
        success_url: `${env.NEXT_PUBLIC_BASE_URL}/billing/success`,
        cancel_url: `${env.NEXT_PUBLIC_BASE_URL}/billing`,
        customer_email: user.emailAddresses[0].emailAddress, // It is the primary email of a clerk user
        subscription_data: {
            metadata: {
                userId: user.id
            }
        },
        custom_text: {
            terms_of_service_acceptance: {
                message: `I have read AI Resume Builder's [terms of service](${env.NEXT_PUBLIC_BASE_URL}/tos) and agree to them` // [] to set it as a link => described in the clerk/stripe documentations
            }
        },
        consent_collection: {
            terms_of_service: "required"
        }
    })

    if (!session.url) {
        throw new Error("Failed to create checkout session");
    }

    return session.url;
}