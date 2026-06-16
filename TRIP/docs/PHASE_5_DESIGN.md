# Phase 5 Design: Responsive Design

## Understanding Summary
- **Goal**: Ensure the existing WANDERSYNC AI design is fully functional and visually consistent across all screen sizes (320px to 4K).
- **Approach**: Use Vanilla CSS media queries to handle stacking and scaling while preserving the current design.
- **Key Constraints**: No Tailwind v4 migration; no visual design changes; absolute fidelity to the current aesthetic.

## Final Design

### 1. Breakpoint Strategy
- **Mobile (< 768px)**: 
    - Convert 2-column layouts (Map/Timeline) to single-column vertical stacks.
    - Sidebars move to toggleable drawers or overlay modals.
    - Reduce padding and font sizes (scale factor ~0.85).
- **Desktop (768px - 1440px)**:
    - Current 2-column "side-by-side" layout remains the default.
- **Ultra-Wide (> 1440px)**:
    - Implement a `max-width: 1200px` container for the main content to preserve readability.

### 2. Component Adjustments
- **Map View**: Full-screen width on mobile; side-anchored on desktop.
- **Trip Timeline**: Optimise spot cards for narrower widths (smaller margins, condensed text).

## Decision Log

| Decision | Chosen Option | Alternatives Considered | Rationale |
| :--- | :--- | :--- | :--- |
| **Responsive Tooling** | Vanilla CSS Media Queries | Tailwind, Styled Components | Complies with the user mandate to preserve existing design and avoid new CSS frameworks. |
| **Mobile UX Pattern** | Vertical Stacking | Horizontal Scrolling, Pagination | Stacking is more intuitive for trip itineraries and matches standard mobile UX patterns. |

## Assumptions
1. The current layout logic is mostly flexbox/grid based, allowing for easy media query overrides.
2. Users prefer a "single-view" map on mobile rather than a permanent split screen.

## Key Risks
- **Cumulative Layout Shift (CLS)**: Dynamic stacking may cause elements to jump as components load.
- **Map Interaction**: Ensuring the map remains performant and interactable on small touch targets.
