"use client"

import { CompanyCard } from "../company-card"


export interface VendorCompaniesProps {
  className?: string
}

export function VendorCompanies
({ className = "" }: VendorCompaniesProps) {
  const companies = [
    {
      name: "Google",
      logo: "/placeholder.svg?height=24&width=24",
      questionCount: 34,
    },
    {
      name: "Amazon",
      logo: "/placeholder.svg?height=24&width=24",
      questionCount: 61,
    },
    {
      name: "TikTok",
      logo: "/placeholder.svg?height=24&width=24",
      questionCount: 35,
    },
    {
      name: "ByteDance",
      logo: "/placeholder.svg?height=24&width=24",
      questionCount: 27,
    },
    {
      name: "Apple",
      logo: "/placeholder.svg?height=24&width=24",
      questionCount: 13,
    },
    {
      name: "Microsoft",
      logo: "/placeholder.svg?height=24&width=24",
      questionCount: 19,
    },
    {
      name: "Atlassian",
      logo: "/placeholder.svg?height=24&width=24",
      questionCount: 17,
    },
    {
      name: "LinkedIn",
      logo: "/placeholder.svg?height=24&width=24",
      questionCount: 18,
    },
    {
      name: "Uber",
      logo: "/placeholder.svg?height=24&width=24",
      questionCount: 15,
    },
  ]

  return (
    <section className={`py-16 px-4 md:px-8 lg:px-16 flex flex-col items-center justify-center ${className}`}>
      {/* Heading */}
      <div className="mb-16 max-w-4xl">
        <h2 className="text-white text-4xl md:text-5xl font-bold leading-tight mb-6">
          Leverage insider tips
          <br />
          from leading companies
        </h2>
        <p className="text-zinc-400 text-lg leading-relaxed">
          Practicing company-specific questions is the quickest way to ace specific interviews. We regularly survey and
          update lists for known questions tested in top companies around the world.
        </p>
      </div>

      {/* Company Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {companies.map((company) => (
          <CompanyCard
            key={company.name}
            name={company.name}
            logo={company.logo}
            questionCount={company.questionCount}
            onClick={() => console.log(`Clicked on ${company.name}`)}
          />
        ))}
      </div>
    </section>
  )
}
