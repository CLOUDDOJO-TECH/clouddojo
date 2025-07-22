"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckIcon } from "lucide-react";
import { fetchPlans } from "@/config/actions";
import { LsSubscriptionPlan } from "@prisma/client";
import { Plan, NoPlans } from "@/app/dashboard/billing/(components)/plan";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useUser, useAuth } from "@clerk/nextjs";
import Navbar from "@/components/navbar";
import { toast } from "sonner";

export default function PricingPage() {
  const router = useRouter();
  const [plans, setPlans] = useState<LsSubscriptionPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);



  // Get plans data
  useEffect(() => {

    const fetchData = async () => {
      const data = await getData();
      setPlans(data);
      setIsLoading(false);
      if (!data || data.length === 0) {
        toast.error("No subscription plans available at the moment. Please check back later.");
      }
    };
    fetchData();
  }, []);


  // Server-side data fetch - this will run after the client-side check above
  const getData = async () => {
    // Fetch all subscription plans from the database
    const allPlans = await fetchPlans();

    // Sort plans by price
    let sortedPlans = allPlans.sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0));

    // Reorder plans to put the most popular (premium) plan second
    const regularPlans = sortedPlans.filter((plan) =>
      !plan.name?.toLowerCase().includes("premium")
    );

    const premiumPlans = sortedPlans.filter((plan) =>
      plan.name?.toLowerCase().includes("premium")
    );

    // Combine plans with regular plans first, then premium plans
    return [...regularPlans, ...premiumPlans];
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-600">
            Simple, Transparent Pricing
          </h1>
          <p className="text-slate-300 text-xl max-w-3xl mx-auto">
            Choose the plan that's right for your AWS certification journey
          </p>
        </div>
        {/* Pricing Plans */}
        {isLoading ? (
          <div className="flex flex-col justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
            <p className="mt-4 text-slate-300">Loading subscription plans...</p>
          </div>
        ) : plans.length === 0 ? (
          <div className="text-center py-12 px-4">
            <div className="bg-slate-900/50 rounded-lg p-8 max-w-2xl mx-auto border border-slate-800">
              <h3 className="text-xl font-medium text-slate-200 mb-3">No plans available</h3>
              <p className="text-slate-400 mb-6">
                We couldn't find any subscription plans at the moment. Please check back later.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-md text-white transition-colors"
              >
                Refresh
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 max-w-5xl mx-auto">
            {plans.map((plan) => (
              <Plan
                key={plan.id}
                plan={plan}
                isPopular={plan.name?.toLowerCase().includes("pro")}
              />
            ))}
          </div>
        )}


        {/* Feature Comparison */}
        <div className="mt-24 bg-slate-900/50 rounded-2xl p-8 backdrop-blur-sm border border-slate-800">
          <h2 className="text-3xl font-bold text-center mb-10 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-600">
            Compare Plans
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="py-4 px-6 text-slate-300">Feature</th>
                  {plans.map((plan) => (
                    <th key={plan.id} className="py-4 px-6 text-slate-300">{plan.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ["Unlimited practice tests", true, true],
                  ["Progress tracking", true, true],
                  ["Flashcard system", true, true],
                  ["Downloadable PDF reports", true, true],
                  ["Advanced analytics", false, true],
                  ["AI-powered explanations", false, true],
                  ["Mock interviews", false, true],
                  ["Priority support", false, true],
                  ["Community access", false, true]
                ].map(([feature, pro, premium], idx: number) => (
                  <tr key={idx} className="border-b border-slate-800">
                    <td className="py-4 px-6 font-medium text-white">{feature as string}</td>
                    <td className="py-4 px-6">
                      {pro ? <CheckIcon className="text-emerald-500 w-5 h-5" /> : <span className="text-slate-500">—</span>}
                    </td>
                    <td className="py-4 px-6">
                      {premium ? <CheckIcon className="text-emerald-500 w-5 h-5" /> : <span className="text-slate-500">—</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-24 text-center">
          <h2 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-600">
            Frequently Asked Questions
          </h2>

          <div className="max-w-3xl mx-auto grid gap-6 mt-10">
            {[
              {
                q: "Can I cancel my subscription anytime?",
                a: "Yes, you can cancel your subscription at any time. Once canceled, you'll continue to have access until the end of your billing period."
              },
              {
                q: "Is there a money-back guarantee?",
                a: "Absolutely! We offer a 14-day money-back guarantee. If you're not satisfied with our platform, just let us know within 14 days of your purchase for a full refund."
              },
              {
                q: "What payment methods do you accept?",
                a: "We accept all major credit cards, PayPal, and Apple Pay. All payments are securely processed."
              },
              {
                q: "How often is new content added?",
                a: "We regularly update our content library with new practice tests and study materials to keep up with the latest AWS certification exam patterns."
              }
            ].map((faq, idx: number) => (
              <Card key={idx} className="bg-slate-900 border-slate-800 text-left">
                <CardHeader>
                  <CardTitle className="text-white text-xl">{faq.q}</CardTitle>
                </CardHeader>
                <CardContent className="text-slate-300">{faq.a}</CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="mt-16 text-center">
          <p className="text-slate-300">
            All plans come with a <span className="text-emerald-400 font-bold">14-day money-back guarantee</span>. No questions asked.
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-slate-400 mt-4">
            🔒 Secure payment processing
          </div>
        </div>
      </div>
    </div>
  )
}
