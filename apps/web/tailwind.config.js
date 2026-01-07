/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			'ft-black': '#000000',
  			'ft-white': '#FFFFFF',
  			'ft-yellow': '#FFD600',
  			'ft-yellow-dark': '#E5C100', // Hover state for yellow
  			'ft-grey': '#9CA3AF',
  			'ft-border': '#E0E0E0',
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		fontFamily: {
  			plaak: [
  				'Plaak',
  				'sans-serif'
  			],
  			riforma: [
  				'Riforma',
  				'sans-serif'
  			],
  			monument: [
  				'Monument Grotesk Mono',
  				'monospace'
  			],
  			sans: [
  				'Riforma',
  				'system-ui',
  				'sans-serif'
  			]
  		},
  		maxWidth: {
  			'7xl': '1200px'
  		},
  		borderRadius: {
  			sm: '2px',
  			DEFAULT: '4px',
  			md: '4px',
  			lg: '4px' // Maximum per constitution
  		},
  		fontSize: {
  			// Typography scale - Fast Track design system
  			'h1': ['48px', { lineHeight: '1.2', fontWeight: '700' }],
  			'h2': ['36px', { lineHeight: '1.2', fontWeight: '700' }],
  			'h3': ['24px', { lineHeight: '1.3', fontWeight: '400' }],
  			'h4': ['20px', { lineHeight: '1.4', fontWeight: '400' }],
  			'body-lg': ['18px', { lineHeight: '1.5', fontWeight: '400' }],
  			'body': ['16px', { lineHeight: '1.5', fontWeight: '400' }],
  			'body-sm': ['14px', { lineHeight: '1.5', fontWeight: '400' }],
  			'small': ['12px', { lineHeight: '1.4', fontWeight: '500' }],
  		},
  		spacing: {
  			// 8px grid spacing scale
  			'1': '8px',
  			'2': '16px',
  			'3': '24px',
  			'4': '32px',
  			'6': '48px',
  			'8': '64px',
  		},
  		transitionDuration: {
  			'fast': '150ms',
  			'base': '200ms',
  			'slow': '300ms',
  		},
  		transitionTimingFunction: {
  			'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)', // ease-in-out
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
}

