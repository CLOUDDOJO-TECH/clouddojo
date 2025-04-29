// app/checkout/route.ts
import { Checkout } from "@polar-sh/nextjs";

export const GET = Checkout({
  accessToken: process.env.POLAR_ACCESS_TOKEN!,
  // Use checkout_id with underscore to match error message
  successUrl: process.env.NODE_ENV === 'production'
    ? `${process.env.NEXT_PUBLIC_APP_URL}/confirmation?checkout_id={CHECKOUT_ID}`
    : "http://localhost:3000/confirmation?checkout_id={CHECKOUT_ID}",
  ...(process.env.NODE_ENV === 'development' ? { server: "sandbox" } : {})
});