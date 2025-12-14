export type FooterLink = {
  label: string;
  href: string;
};

export type FooterSection = {
  title: string;
  links: FooterLink[];
};

export const footerLinks: FooterSection[] = [
  {
    title: "Platform",
    links: [
      { label: "Features", href: "/#features" },
      { label: "Demo", href: "/demo" },
      { label: "Dashboard", href: "/dashboard" },
      { label: "Pricing", href: "/pricing" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Blog", href: "/blog" },
      { label: "Contact", href: "/contact" },
      { label: "About", href: "/about" },
      { label: "Community", href: "/#testimonials" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact Sales", href: "/contact" },
      { label: "Careers", href: "/#cta" },
      { label: "Partners", href: "/#providers" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/tos" },
      { label: "Security", href: "/#faq" },
      { label: "Compliance", href: "/#faq" },
    ],
  },
];
