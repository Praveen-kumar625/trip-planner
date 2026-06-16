# Phase 8 Design: Accessibility

## Understanding Summary
- **Goal**: Ensure the WANDERSYNC AI platform is inclusive and compliant with WCAG 2.1 Level AA standards.
- **Approach**: Full WCAG Audit focusing on semantic HTML, screen reader support for AI streaming, and robust keyboard focus management.
- **Key Constraints**: No visual design changes, must support 200% browser zoom, absolute Zero-CJK in accessibility metadata.

## Final Design

### 1. Semantic Architecture & Screen Reader Support
- **HTML5 Landmarks**: Use `<main>`, `<nav>`, `<aside>`, and `<section>` to provide a clear document structure.
- **Aria-Live Regions**: 
    - Implement `aria-live="polite"` for the trip generation stream to announce progress updates (e.g., "Day 1 generated").
    - Implement `aria-live="assertive"` for critical error notifications.
- **Descriptive Labels**: Every icon-only button (e.g., "✕", "＋") must have a clear `aria-label`.

### 2. Navigation & Focus Management
- **Keyboard Trapping**: Implement focus traps in all modals (Auth, Nearby Search) to ensure users cannot tab into the background.
- **Interactive Map**:
    - Ensure map markers are focusable (`tabindex="0"`).
    - Provide keyboard shortcuts for zooming and panning the map view.
- **Visual Focus**: Standardize on a high-contrast focus ring (e.g., `2px solid var(--color-primary-600)`) for all interactive elements.

### 3. Visual & Zoom Optimization
- **Contrast Ratios**: Audit and adjust colors to meet the 4.5:1 ratio for standard text.
- **Scalable UI**:
    - Use `rem` and `em` units for all layout and typography.
    - Ensure the "Trip Timeline" does not break or overflow when browser zoom is at 200%.
- **Reduced Motion**: Respect `prefers-reduced-motion` by disabling complex AI path animations on the map.

## Decision Log

| Decision | Chosen Option | Alternatives Considered | Rationale |
| :--- | :--- | :--- | :--- |
| **Compliance Target** | WCAG 2.1 AA | Level A, Level AAA | Industry standard for modern web applications; balances high inclusivity with practical engineering constraints. |
| **Streaming Feedback** | ARIA Live Regions | Toast Notifications | Live regions are less intrusive for frequent AI status updates and better integrated into the screen reader's flow. |

## Assumptions
1. External map providers (AMap) allow for custom accessibility properties on markers.
2. Users have access to standard assistive technologies (NVDA, VoiceOver).

## Key Risks
- **Dynamic Content**: Managing focus during high-speed AI generation cycles without disorienting the user.
- **Map Accessibility**: Maps are inherently visual; providing a meaningful text-based alternative for a complex itinerary is challenging.
