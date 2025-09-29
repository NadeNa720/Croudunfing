# Design Guidelines for SprzątanieMieszkań.com

## Design Approach
**Reference-Based Approach**: Drawing inspiration from service marketplace leaders like Airbnb and Booking.com for trust-building and clear service presentation, adapted for the Polish cleaning service market.

## Core Design Elements

### A. Color Palette
**Primary Colors:**
- Light Mode: Clean blue 210 75% 45% for trust and professionalism
- Dark Mode: Softer blue 210 65% 55% for reduced eye strain
- Background: Pure white/dark charcoal for maximum contrast

**Accent Colors:**
- Success green 145 70% 50% for confirmation states
- Warning orange 35 85% 55% for attention elements
- Neutral grays 220 10% 85% (light) / 220 15% 25% (dark)

### B. Typography
**Font Stack:** Inter (Google Fonts fallback to Helvetica)
- Headers: 600-700 weight, sized 2xl-4xl
- Body text: 400-500 weight, base-lg sizes
- Service cards: 500 weight for pricing emphasis

### C. Layout System
**Spacing Units:** Consistent use of Tailwind units 2, 4, 6, 8, 12, 16
- Component padding: p-6 standard, p-4 compact
- Section margins: mb-12 between major sections
- Grid gaps: gap-6 for service cards, gap-4 for form elements

### D. Component Library

**Service Cards:**
- Clean white cards with subtle shadow and hover elevation
- Radio selection with blue accent border when selected
- Clear price display with duration and package type
- Prominent "ZAREZERWUJ" CTA buttons

**Booking Form:**
- Single-column layout with grouped sections
- Floating labels for modern feel
- Date/time pickers with Polish localization
- Real-time price calculation display

**Navigation & CTAs:**
- Primary buttons: Blue background with white text
- Secondary actions: Outline style with blue border
- Focus states with visible ring for accessibility

**Modal System:**
- Booking confirmation with service summary
- Backdrop blur for focus
- Clear typography hierarchy for details

### E. Responsive Design
**Mobile-First Approach:**
- Service cards: Single column on mobile, 2-3 columns on desktop
- Form: Full-width inputs with adequate touch targets
- Header: Collapsible navigation if needed

## Visual Treatments

**Background Elements:**
- Subtle gradient overlays on hero section (blue to light blue)
- Clean geometric patterns for section dividers
- Minimal use of shadows for depth without distraction

**Interactive States:**
- Gentle hover transitions (200ms ease)
- Clear selection states for service cards
- Form validation with inline error messages in Polish

## Content Strategy
**Sections (Maximum 5):**
1. Hero with value proposition and quick booking access
2. Service selection cards with all cleaning packages
3. Booking form with real-time calculations
4. "Zobacz jak pracujemy" video section
5. FAQ + Footer with contact information

**Polish Localization:**
- All content in Polish including error messages
- GDPR compliance messaging
- Professional tone reflecting service quality

## Images
No large hero images required. Focus on:
- Small service category icons (cleaning supplies, apartment types)
- Professional team photos in video section if available
- Trust badges or certifications as small graphics

This design emphasizes trust, simplicity, and conversion optimization while maintaining the professional appearance expected in the Polish service market.