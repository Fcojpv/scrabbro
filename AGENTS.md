# AGENTS.md

- Image sharing and image clipboard writes run directly from a click with a pre-generated PNG, feature detection and handled failures. Never treat long-press or a requested download as confirmed saving. Why: WebViews and browsers do not guarantee those operations.
- Browser handoff uses a validated result snapshot in an HTTPS URL fragment and the isolated /result page, never a blob URL; keep game storage untouched. Why: blob URLs cannot transfer between browsers, and sharing must not replace the active game. External launch still depends on the installed host.
- Installability is manifest-only (no service worker). Why: avoids stale cached versions in preview and Capacitor shell.
