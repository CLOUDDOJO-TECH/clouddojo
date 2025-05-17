import type { Config } from "tailwindcss";
const colors = require("tailwindcss/colors");

const config = {
    darkMode: ["class"],
    content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/(auth)/*.{js,ts,jsx,tsx,mdx}",
	"./src/app/(dashboard)/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    // Add dynamic color classes that need to be preserved
    'bg-emerald-100', 'text-emerald-800', 'dark:bg-emerald-900', 'dark:text-emerald-300',
    'bg-orange-100', 'text-orange-800', 'dark:bg-orange-900', 'dark:text-orange-300',
    'bg-red-100', 'text-red-800', 'dark:bg-red-900', 'dark:text-red-300',
    'text-emerald-500', 'text-emerald-600',
    'text-orange-300'
  ],
  theme: {
  	extend: {
  		colors: {
			// Custom colors for Reveni site
			mint: 'hsl(144, 65%, 95%)',       // #e8f9f0
			cstm_teal: 'hsl(198, 45%, 20%)',       // #1d3b4a
			cardPink: 'hsl(350, 100%, 92%)',  // #ffd6dc
			cardPurple: 'hsl(252, 100%, 94%)', // #e5deff
			cardGreen: 'hsl(84, 85%, 90%)',   // #e5f9cd
			cardYellow: 'hsl(52, 100%, 90%)',  // #fef7cd
			lightPurple: 'hsl(255, 100%, 97%)', // #f4f0ff
			footerPink: 'hsl(350, 100%, 94%)',  // #ffe5e9
			
                ...colors,
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
			midnight: {
				DEFAULT: "hsl(222, 47%, 4%)",
				light: "hsl(222, 47%, 10%)",
			  },
			midnighttwo: {
				DEFAULT: "hsl(231, 54, 14%)",
				light: "hsl(231, 54%, 20%)",
			},
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			},
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		keyframes: {
			'spotlight': {
				"0%": {
				  opacity: "0",
				  transform: "translate(-72%, -62%) scale(0.5)",
				},
				"100%": {
				  opacity: "1",
				  transform: "translate(-50%,-40%) scale(1)",
				},
			  },
  			shimmer: {
  				from: {
  					backgroundPosition: '0 0'
  				},
  				to: {
  					backgroundPosition: '-200% 0'
  				}
  			},
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out',
			'spotlight': "spotlight 2s ease .75s 1 forwards",
  		}
  	}
  },
  plugins: [require("tailwindcss-animate"), require('@tailwindcss/typography'),],
} satisfies Config;

export default config;