# CloudDojo Landing Page - Design Rules & Guidelines

## Overview

This document establishes the rules, guidelines, and best practices for the CloudDojo landing page design system. These rules ensure consistency, maintainability, and quality across all marketing touchpoints.

---

## Core Design Principles

### 1. **Consistency Over Creativity**
- Maintain established patterns even when tempted to "make it special"
- Exceptions must be justified and documented
- One design system, applied everywhere

### 2. **User Value First**
- Every element must serve user needs
- Remove anything that doesn't add value
- Clarity trumps cleverness

### 3. **Performance Matters**
- Design with performance budget in mind
- Optimize images, animations, assets
- Test on slow connections and devices

### 4. **Accessibility is Non-Negotiable**
- WCAG 2.1 AA minimum standard
- Test with screen readers
- Keyboard navigation must work

### 5. **Mobile-First**
- Design for mobile, enhance for desktop
- Touch targets minimum 44x44px
- Test on real devices, not just simulators

---

## Visual Design Rules

### Typography

#### Hierarchy
```
MUST follow this hierarchy:
- H1: Only one per page, 4xl-6xl, heading-gradient
- H2: Section titles, 4xl-5xl, heading-gradient
- H3: Subsection titles, 2xl-3xl, text-foreground
- H4: Component titles, xl-2xl, text-foreground
- Body: sm-xl, text-foreground or text-muted-foreground
```

#### Font Sizing Scale
```tsx
// REQUIRED sizes only
text-xs    // 12px - Captions, footnotes
text-sm    // 14px - Body text, descriptions  
text-base  // 16px - Default body
text-lg    // 18px - Emphasized body
text-xl    // 20px - Small headings
text-2xl   // 24px - Component headings
text-3xl   // 30px - Subsection headings
text-4xl   // 36px - Section headings (mobile)
text-5xl   // 48px - Section headings (desktop)
text-6xl   // 60px - Hero headings

// FORBIDDEN: text-7xl and above (too large)
```

#### Line Height
```tsx
// MUST use these line heights
leading-none      // 1 - Large display text only
leading-tight     // 1.25 - Headings
leading-normal    // 1.5 - Body text (default)
leading-relaxed   // 1.625 - Long-form content

// FORBIDDEN: leading-loose (too spaced for marketing)
```

#### Font Weights
```tsx
// ALLOWED weights
font-normal   // 400 - Body text
font-medium   // 500 - Emphasized text
font-semibold // 600 - Component labels
font-bold     // 700 - Headings

// FORBIDDEN: font-light, font-extrabold (off-brand)
```

### Color Usage

#### Text Colors
```tsx
// PRIMARY text colors
text-foreground            // Main text
text-muted-foreground      // Secondary text
text-muted-foreground/50   // Tertiary/disabled text

// FEATURE colors (for icons, accents only)
text-pink-400      // AI/Magic features
text-teal-400      // Learning/Education
text-blue-400      // Intelligence/Analysis
text-emerald-400   // Growth/Progress
text-orange-400    // Action/Practice
text-violet-400    // Platform/Scale
text-cyan-400      // Competition/Social

// FORBIDDEN: text-red, text-yellow (except for X icons)
// FORBIDDEN: Random color choices without system
```

#### Background Colors
```tsx
// ALLOWED backgrounds
bg-background          // Page background
bg-secondary          // Cards, sections
bg-secondary/30       // Hover states
bg-muted             // Buttons, inputs
bg-neutral-900       // Tooltips, modals

// FORBIDDEN: Bright backgrounds (too harsh)
// FORBIDDEN: Gradient backgrounds (except NoiseBackground)
```

#### Border Colors
```tsx
// REQUIRED border colors
border-border       // Default borders
border-border/50    // Subtle separators
border-foreground   // Emphasis (Pro plan)

// FORBIDDEN: Colored borders (except red for X icons)
```

### Spacing

#### Section Spacing
```tsx
// REQUIRED section padding
className="py-16 md:py-24 px-4 sm:px-6 lg:px-14 max-w-7xl mx-auto"

// Vertical: py-16 (mobile) → py-24 (desktop)
// Horizontal: px-4 (mobile) → px-6 (tablet) → px-14 (desktop)
// Max width: max-w-7xl (1280px)
// Centering: mx-auto

// FORBIDDEN: Random spacing values
// FORBIDDEN: Inconsistent padding per section
```

#### Component Spacing
```tsx
// REQUIRED internal spacing
gap-2   // Tight elements (icon + text)
gap-4   // Related elements
gap-6   // Separate components
gap-8   // Section divisions
gap-12  // Major divisions

// FORBIDDEN: Odd numbers (gap-3, gap-5, gap-7)
```

#### Margin/Padding Scale
```tsx
// USE ONLY these values
0, 1, 2, 3, 4, 6, 8, 12, 16, 20, 24

// AVOID: 5, 7, 9, 10, 11, 13, 14, 15, etc.
```

### Border Radius

#### Sharp Corners Rule
```tsx
// DEFAULT: No border radius
className="rounded-none"

// EXCEPTIONS (must be justified):
rounded-full    // Pill buttons, avatars
rounded-lg      // Tooltips ONLY

// FORBIDDEN: rounded, rounded-md, rounded-xl
```

### Shadows

#### Allowed Shadows
```tsx
// SUBTLE shadows only
shadow-sm       // Buttons, cards
shadow-md       // Elevated elements
shadow-lg       // Modals, tooltips
shadow-2xl      // Hero images

// FORBIDDEN: shadow-xl (too heavy)
// FORBIDDEN: Colored shadows
```

---

## Component Rules

### Buttons

#### Button Variants
```tsx
// PRIMARY: Default variant
<Button variant="default" size="lg">
  Action
</Button>

// SECONDARY: Outline variant
<Button variant="outline" size="lg">
  Action
</Button>

// SPECIAL: NoiseBackground (Pro plan only)
<NoiseBackground>
  <button>Action</button>
</NoiseBackground>

// FORBIDDEN: Custom styled buttons outside system
```

#### Button Sizes
```tsx
// REQUIRED sizes
size="sm"     // Small actions
size="default" // Standard
size="lg"      // Primary CTAs

// FORBIDDEN: size="icon" on text buttons
```

#### Button States
```tsx
// MUST implement all states
:hover        // Visual feedback
:active       // Press feedback
:focus        // Keyboard navigation
:disabled     // Inactive state

// REQUIRED animations
transition-all duration-200  // Smooth transitions
group-hover:-translate-x-1   // Text moves left
group-hover:translate-x-1    // Icon moves right
```

#### Button Icons
```tsx
// RULES:
// 1. Icons must be 20px or 12px only
// 2. Always wrap text in <span> for separate animation
// 3. Use group/group-hover for coordinated animation
// 4. Icons must have semantic meaning

// CORRECT:
<button className="group">
  <span className="group-hover:-translate-x-1">{text}</span>
  <Icon className="group-hover:translate-x-1" />
</button>

// FORBIDDEN: Icon without animation
// FORBIDDEN: Multiple icons in one button
```

### Cards

#### Card Structure
```tsx
// REQUIRED structure
<div className="border rounded-none p-8 flex flex-col">
  <h3 className="text-2xl font-bold mb-2">{title}</h3>
  <p className="text-muted-foreground mb-6">{description}</p>
  <div className="space-y-3 flex-grow">
    {content}
  </div>
</div>

// MUST have:
// - border (not shadow)
// - rounded-none
// - p-8 padding
// - flex flex-col layout
```

#### Hover States
```tsx
// OPTIONAL but recommended
hover:bg-secondary/30
transition-colors

// FORBIDDEN: Dramatic hover effects (scale, shadow changes)
```

### Icons

#### Icon Sizing
```tsx
// REQUIRED sizes only
12px  // Button chevrons
16px  // Info icons
18px  // Feature icons (duo-tone)
20px  // Comparison icons, button icons
24px  // Large button icons

// FORBIDDEN: Random sizes, inline size values
```

#### Icon Colors
```tsx
// MUST use currentColor
<path fill="currentColor" />

// Apply color via className
<Icon className="text-teal-400" />

// FORBIDDEN: Hardcoded fill colors in SVG
// FORBIDDEN: Inconsistent color assignments
```

#### Icon Structure
```tsx
// REQUIRED component structure
export function IconName({ size = "18px", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 18 18"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {/* paths */}
    </svg>
  );
}

// MUST include:
// - size prop with default
// - viewBox matching size
// - ...props spread
```

### Tooltips

#### Tooltip Implementation
```tsx
// REQUIRED structure
<div className="relative group">
  <IconInfoCircle className="text-muted-foreground/50 cursor-help" />
  <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-64 p-3 bg-neutral-900 text-white text-xs rounded-lg shadow-lg z-10">
    {tooltipText}
    <div className="absolute left-4 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-neutral-900"></div>
  </div>
</div>

// MUST have:
// - cursor-help on trigger
// - dark background (bg-neutral-900)
// - white text for contrast
// - arrow pointer
// - z-10 for stacking
// - w-64 max width
```

#### Tooltip Content
```
// RULES:
// - 1-2 sentences maximum
// - Benefit-focused, not feature-focused
// - No jargon or marketing speak
// - Specific, actionable language

// GOOD: "Practice with real exam-style questions powered by AI that provides instant hints when you're stuck."
// BAD: "Our comprehensive AI-powered learning platform leverages advanced algorithms."
```

---

## Layout Rules

### Grid Systems

#### Feature Grids
```tsx
// MOBILE: Single column
className="grid grid-cols-1"

// TABLET: 2 columns
className="grid grid-cols-1 sm:grid-cols-2"

// DESKTOP: 4 columns max
className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"

// FORBIDDEN: More than 4 columns
// FORBIDDEN: Asymmetric grids (e.g., 1-2-3 pattern)
```

#### Pricing Grid
```tsx
// REQUIRED layout
className="grid grid-cols-1 md:grid-cols-3 gap-8"

// RULES:
// - Always 3 columns on desktop
// - Stack on mobile
// - Equal width columns
// - Consistent gap-8

// FORBIDDEN: 2-column or 4-column pricing
```

#### Comparison Table
```tsx
// REQUIRED columns
className="grid grid-cols-[1fr_1.5fr_1.5fr] gap-4"

// RATIONALE:
// - Feature column narrower (1fr)
// - CloudDojo/Others wider for content (1.5fr each)
// - Balanced visual weight

// FORBIDDEN: Equal width columns
// FORBIDDEN: Percentage-based widths
```

### Responsive Breakpoints
```tsx
// TAILWIND DEFAULTS (use these)
sm: 640px   // Tablet portrait
md: 768px   // Tablet landscape
lg: 1024px  // Desktop
xl: 1280px  // Large desktop

// FORBIDDEN: Custom breakpoints
// FORBIDDEN: max-w-* that don't align with these
```

### Max Widths
```tsx
// CONTENT max widths
max-w-7xl   // 1280px - Main content (default)
max-w-6xl   // 1152px - Pricing grid
max-w-5xl   // 1024px - Info sections
max-w-4xl   // 896px  - Long-form text
max-w-3xl   // 768px  - Subheadings
max-w-2xl   // 672px  - Centered content

// RULE: Always pair with mx-auto
className="max-w-7xl mx-auto"

// FORBIDDEN: max-w-full (loses max width control)
```

---

## Animation Rules

### Animation Duration
```tsx
// REQUIRED durations only
duration-100   // 100ms - Quick feedback
duration-200   // 200ms - Standard transitions (DEFAULT)
duration-300   // 300ms - Complex animations
duration-500   // 500ms - Page transitions

// FORBIDDEN: duration-75, duration-150, duration-700+
```

### Animation Easing
```tsx
// DEFAULT: ease (Tailwind default)
transition-all

// SPECIFIC easing (when needed)
ease-in       // Accelerating
ease-out      // Decelerating
ease-in-out   // Smooth start/end

// FORBIDDEN: Custom cubic-bezier (use defaults)
```

### Transform Rules
```tsx
// ALLOWED transforms
translate-x-1  // 4px horizontal
translate-y-1  // 4px vertical
scale-98       // Slight scale down (active state)
scale-105      // Slight scale up (emphasis)

// FORBIDDEN: Large transforms (translate-x-10+, scale-150)
// FORBIDDEN: Rotation (except icons in rare cases)
// FORBIDDEN: Skew, 3D transforms
```

### Animation Best Practices
```tsx
// DO:
// - Use transform (GPU accelerated)
// - Use opacity
// - Use transition-all for multiple properties
// - Keep duration under 500ms

// DON'T:
// - Animate width/height (use scale)
// - Animate colors excessively
// - Use animations on first page load
// - Animate without transition class
```

---

## Content Rules

### Writing Voice

#### Tone Guidelines
```
DO:
✓ Be conversational ("you", "we")
✓ Use contractions ("don't", "can't")
✓ Be specific ("200+ tests" not "many tests")
✓ Address pain points directly
✓ Use comparisons to clarify
✓ Be honest and transparent

DON'T:
✗ Use corporate speak
✗ Use buzzwords ("synergy", "leverage")
✗ Make vague claims
✗ Use jargon without explanation
✗ Be overly formal
✗ Use emojis (unless user content)
```

#### Example Patterns
```
// FEATURE DESCRIPTIONS
GOOD: "Like a study partner, but on steroids. Knows your strengths and weaknesses better than you do."
BAD: "Comprehensive AI-powered adaptive learning companion utilizing machine learning algorithms."

// HEADLINES
GOOD: "AI that actually helps you pass your certification"
BAD: "Next-Generation Artificial Intelligence Learning Platform"

// COMPARISONS
GOOD: "Interactive tests with AI hints" vs "Static PDFs and brain dumps"
BAD: "Advanced learning materials" vs "Traditional resources"

// CTAs
GOOD: "Start Free Trial"
BAD: "Begin Your Journey"
```

### Headline Formula
```
Pattern: [BENEFIT] + [FOR WHOM] + [DIFFERENTIATOR]

Examples:
✓ "Pass your cloud certification. Without the boring stuff."
✓ "Built for cloud professionals, not certification mills"
✓ "AI that actually helps you pass your certification"

Avoid:
✗ "Welcome to CloudDojo"
✗ "The Future of Learning"
✗ "Transform Your Career"
```

### Feature Description Formula
```
Pattern: [WHAT IT IS] + [SPECIFIC BENEFIT] + [HOW IT HELPS]

Example:
"Practice with real exam-style questions powered by AI that provides instant hints and explanations when you're stuck."

- What: "Practice with real exam-style questions"
- Specific: "powered by AI"
- How: "provides instant hints when you're stuck"
```

### Call-to-Action Copy
```
GOOD CTAs:
✓ "Start Free Trial"
✓ "Get Started"
✓ "Try CloudDojo Free"
✓ "Start Learning"

BAD CTAs:
✗ "Submit"
✗ "Click Here"
✗ "Learn More" (too vague)
✗ "Begin Your Journey" (too fluffy)
```

---

## Accessibility Rules

### Color Contrast
```
REQUIRED RATIOS (WCAG 2.1 AA):
- Normal text (< 18px): 4.5:1 minimum
- Large text (≥ 18px): 3:1 minimum
- Icons/graphics: 3:1 minimum

TEST EVERY:
- Text color on background
- Icon color on background
- Button text on button background
- Hover states

TOOLS:
- Chrome DevTools Lighthouse
- WebAIM Contrast Checker
- WAVE browser extension
```

### Keyboard Navigation
```tsx
// ALL interactive elements MUST:
// 1. Be focusable (button, a, input elements)
// 2. Have visible focus state
// 3. Work with Enter/Space keys
// 4. Follow logical tab order

// REQUIRED focus styles
focus:outline-none focus:ring-2 focus:ring-primary

// FORBIDDEN: tabindex > 0
// FORBIDDEN: Removing outline without replacement
```

### Screen Readers
```tsx
// USE semantic HTML
<button> not <div onClick>
<nav> for navigation
<main> for main content
<header>, <footer> appropriately

// ARIA labels when needed
<IconInfoCircle aria-label="More information" />

// Hide decorative elements
<div aria-hidden="true">{decorativeIcon}</div>

// FORBIDDEN: Divs for everything
```

### Alternative Text
```tsx
// IMAGES: Descriptive alt text
<Image 
  src="/preview.png" 
  alt="CloudDojo AI analysis dashboard showing quiz results" 
/>

// DECORATIVE: Empty alt
<Image src="/pattern.svg" alt="" />

// ICONS: aria-label if interactive
<IconInfoCircle aria-label="Tooltip: AI feedback details" />
```

### Touch Targets
```
MINIMUM SIZE: 44x44px

GOOD:
<button className="px-4 py-3"> // ≥ 44px height
<Link className="p-4"> // 64px × 64px

BAD:
<button className="px-2 py-1"> // Too small
<Icon size="16px" onClick={} /> // Not a touch target
```

---

## Performance Rules

### Image Optimization
```tsx
// REQUIRED: Use Next.js Image component
import Image from "next/image";

<Image
  src={imageSource}
  alt="Description"
  fill  // or width/height
  className="object-cover"
  placeholder="blur"  // MUST use for imported images
  priority  // Only for above-fold images
/>

// FORBIDDEN: <img> tags
// FORBIDDEN: Large image files (> 500KB)
// FORBIDDEN: No placeholder
```

### Image Formats
```
REQUIRED:
- WebP for photos (smaller, modern)
- SVG for icons, logos (scalable)
- PNG for screenshots with transparency

FORBIDDEN:
- JPEG (use WebP instead)
- GIF for animations (use video)
- Unoptimized images
```

### Animation Performance
```tsx
// USE GPU-accelerated properties
transform      // ✓
opacity        // ✓
filter         // ✓ (use sparingly)

// AVOID repaints
width/height   // ✗ (use transform: scale)
top/left       // ✗ (use transform: translate)
background     // ✗ (use opacity)

// RESPECT user preferences
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Code Splitting
```tsx
// DYNAMIC imports for heavy components
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <Spinner />,
  ssr: false  // If client-side only
});

// USE for:
// - Modals, dialogs
// - Charts, visualizations
// - Third-party widgets

// DON'T use for:
// - Above-fold content
// - Core navigation
// - Critical UI elements
```

### Bundle Size
```
RULES:
- First-party JavaScript: < 100KB gzipped
- Third-party libraries: Justify each addition
- Tree-shake unused code
- Avoid large dependencies

AUDIT:
npm run build && npm run analyze
```

---

## Testing Rules

### Browser Support
```
MUST support:
✓ Chrome (last 2 versions)
✓ Firefox (last 2 versions)
✓ Safari (last 2 versions)
✓ Edge (last 2 versions)

SHOULD support:
- iOS Safari (last 2 versions)
- Chrome Android (last 2 versions)

DON'T support:
✗ IE11 (end of life)
✗ Opera Mini (too limited)
```

### Device Testing
```
REQUIRED devices:
- iPhone 13/14 (iOS Safari)
- Samsung Galaxy S21+ (Chrome Android)
- iPad Pro (iOS Safari)
- Desktop 1920×1080 (Chrome)
- Desktop 1366×768 (Edge)

TEST:
- Touch interactions
- Scroll behavior
- Form inputs
- Button sizing
- Text readability
```

### Responsive Testing
```
REQUIRED breakpoints:
320px   // Small mobile
375px   // iPhone SE
768px   // Tablet portrait
1024px  // Tablet landscape
1280px  // Desktop
1920px  // Large desktop

VERIFY:
- No horizontal scroll
- Touch targets ≥ 44px
- Text remains readable
- Images don't overflow
- Layouts don't break
```

---

## Version Control Rules

### File Organization
```
STRUCTURE:
/features/marketing/components/
  /section-name/
    index.tsx         // Main component
    icons.tsx         // Icons if needed
    section-name.tsx  // Additional components

NAMING:
- PascalCase for components
- kebab-case for files
- descriptive, not generic
```

### Component Naming
```tsx
// GOOD:
export const PricingSection = () => {}
export const ComparisonTable = () => {}
export const IconCheckCircle = () => {}

// BAD:
export const Pricing = () => {}  // Too generic
export const Comp = () => {}  // Unclear
export const Icon = () => {}  // Too broad
```

### CSS Class Organization
```tsx
// ORDER:
// 1. Layout (flex, grid, block)
// 2. Positioning (relative, absolute)
// 3. Size (w-, h-, max-w-)
// 4. Spacing (p-, m-, gap-)
// 5. Typography (text-, font-)
// 6. Visual (bg-, border-, shadow-)
// 7. Interactions (hover:, focus:, transition-)
// 8. Responsive (sm:, md:, lg:)

// EXAMPLE:
className="
  flex items-center justify-between
  relative
  w-full max-w-7xl
  px-4 py-8
  text-lg font-semibold
  bg-background border-b
  hover:bg-secondary transition-colors
  sm:px-6 lg:px-14
"
```

---

## Documentation Rules

### Code Comments
```tsx
// USE comments for:
// - Complex logic explanation
// - Rationale for unusual approaches
// - TODOs with ticket numbers
// - Performance considerations

// DON'T comment:
// - Obvious code
// - Every single line
// - Temporary debugging

// GOOD:
// NoiseBackground animation GPU-accelerated for 60fps
const animatedGradient = useSpring({ ... });

// BAD:
// Set the state to true
setState(true);
```

### Component Documentation
```tsx
/**
 * PricingSection - Displays pricing plans with animated CTAs
 * 
 * Features:
 * - 3-tier pricing (Free Trial, Pro, Gold)
 * - NoiseBackground on Pro plan
 * - Color-coded check icons
 * - Responsive grid layout
 * 
 * @example
 * <PricingSection />
 */
export const PricingSection = () => {}
```

---

## Review Checklist

### Before Committing
```
UI/UX:
□ Follows sharp corner rule (rounded-none)
□ Uses heading-gradient for titles
□ Consistent spacing (px-4 sm:px-6 lg:px-14)
□ Button animations work (opposite-direction translation)
□ Hover states implemented
□ Mobile responsive
□ Touch targets ≥ 44px

Accessibility:
□ Color contrast ≥ 4.5:1
□ Keyboard navigation works
□ Focus states visible
□ Alt text on images
□ Semantic HTML used

Performance:
□ Images optimized (WebP, blur placeholder)
□ No layout shift (CLS)
□ Animations under 500ms
□ Bundle size checked

Content:
□ Copy follows voice guidelines
□ No jargon or buzzwords
□ Specific, benefit-focused
□ CTAs clear and actionable

Code Quality:
□ TypeScript types correct
□ No console.logs
□ Proper imports
□ Component props documented
```

---

## Breaking the Rules

### When to Break Rules
Sometimes rules must be broken. Document why:

```tsx
// EXCEPTION: Using rounded corners here because pill shape
// is expected UI pattern for avatar images
<Image className="rounded-full" />
```

### Approval Required
These changes require team review:
- New color additions
- Breaking accessibility rules
- New animation patterns
- Changing core spacing
- Adding dependencies
- Changing icon sizes

---

## Maintenance

### Regular Audits
```
MONTHLY:
- Run Lighthouse audit
- Check broken links
- Review analytics
- Update dependencies

QUARTERLY:
- Accessibility audit (WAVE, axe)
- Performance budget review
- Content freshness check
- A/B test results review
```

### Updates & Iterations
```
PROCESS:
1. Document change request
2. Design review
3. Implement with feature flag
4. A/B test if applicable
5. Monitor metrics
6. Document learnings
7. Update design docs
```

---

**Document Version**: 1.0  
**Last Updated**: December 15, 2025  
**Authored by**: Glen Miracle
