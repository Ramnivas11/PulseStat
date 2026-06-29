# Frontend Reconstruction Rules

* Preserve all backend functionality.
* Never modify API contracts without explicit approval.
* Never modify authentication logic.
* Never rename or replace src/proxy.ts.
* Use shadcn/ui as the primary component system.
* Customize shadcn components heavily; avoid default styling.
* Use Framer Motion for application interactions.
* Use GSAP + ScrollTrigger only for public marketing pages.
* Build mobile-first responsive layouts.
* Use strict TypeScript.
* Prefer reusable shared components.
* Ask for approval before high-risk refactors.
* Work incrementally and verify functionality after every major change.
