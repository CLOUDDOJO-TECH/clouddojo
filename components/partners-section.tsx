export default function PartnersSection() {
  const partners = [
    { name: "AWS", icon: "/vendors/aws.png" },
    { name: "GCP", icon: "/vendors/gcp.png" },
    { name: "Comptia", icon: "/vendors/comptia.png" },
    { name: "Salesforce", icon: "/vendors/salesforce.png" },
    { name: "Sans", icon: "/vendors/sans.png" },
    { name: "Alx", icon: "/vendors/alx.png" },
  ]

  return (
    <section className="py-12 container w-full">
      <p className="text-center text-sm text-gray-400 mb-8">
        Cloudojo is proud to be intergrated with these certification vendors
      </p>
      <div className="flex flex-wrap justify-center gap-8 md:gap-12">
        {partners.map((partner) => (
          <div key={partner.name} className="flex items-center gap-2 text-gray-400">
            <div className="bg-midnight-light/20 p-1.5 rounded-full">
              <div className="">
                <img src={partner.icon} alt={partner.name} className="w-auto h-10" />
              </div>
            </div>
            {/* <span className="text-sm">{partner.name}/span> */}
          </div>
        ))}
      </div>
    </section>
  )
}

// Import Lucide React icons
