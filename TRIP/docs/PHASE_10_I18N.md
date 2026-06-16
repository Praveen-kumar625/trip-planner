# Phase 10 Design: Internationalization

## Understanding Summary
- **Goal**: Implement a production-ready translation system supporting English and Hinglish while maintaining strict Zero-CJK compliance.
- **Approach**: Dynamic JSON loading via i18next-http-backend with a header-based language switcher.
- **Architecture**: Externalized locale files in `public/locales/` with persistence via Zustand/LocalStorage.
- **Key Constraints**: Zero-CJK across all UI and metadata; efficient bundle size (lazy-loading translations).

## Final Design

### 1. Translation Architecture
- **Locale Management**: Move all strings from `i18n.js` to `public/locales/{en|hinglish}/translation.json`.
- **Dynamic Loading**: Integrate `i18next-http-backend` to fetch translations asynchronously on app initialization or language switch.
- **Fallbacks**: Standardize English (`en`) as the primary fallback language for all missing keys.

### 2. Language Switcher (EN/HI)
- **UI Location**: Integrated into the `TripHeader` component as a persistent toggle or dropdown.
- **State Management**:
    - Current language stored in `useAuthStore`.
    - Automated detection on first visit via `i18next-browser-languagedetector`.
- **Visuals**: Maintain the existing aesthetic while ensuring clear affordance for the active language.

### 3. Zero-CJK Audit & Compliance
- **UI Sweep**: Systematic audit of all components in `src/features/` to replace residual Chinese characters with translation keys.
- **Data Sanitization**: Ensure AMap provider results are parsed to strip CJK descriptions before they reach the frontend state.
- **Metadata**: Verification that all `<title>`, `<meta>`, and `aria-label` tags are strictly English/Hinglish.

## Decision Log

| Decision | Chosen Option | Alternatives Considered | Rationale |
| :--- | :--- | :--- | :--- |
| **Switcher Location** | Header Toggle | Settings Sidebar, Footer | Provides immediate visibility and ease of use for the target audience. |
| **Translation Format** | External JSON | Hardcoded JS Objects | Decouples content from logic and supports Phase 7 performance goals (smaller initial bundle). |

## Assumptions
1. Hinglish translations will use the Latin alphabet exclusively (Transliterated Hindi).
2. Users prefer manual control over language choice despite automatic detection.

## Key Risks
- **Key Fragmentation**: Managing missing keys across multiple namespaces as the feature set grows.
- **AMap Strings**: Some AMap error messages or UI elements (if using their built-in components) may default to Chinese; requires robust wrapper-level sanitization.
