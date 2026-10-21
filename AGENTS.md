# AGENTS.md

- Image sharing uses the Web Share API called synchronously from the button click on a pre-generated File (preview dialog), with a "press and hold the image" fallback; never report a download as successful inside an Android WebView. Why: WebViews ignore `<a download>` and browsers drop share calls made after an await.
- Installability is manifest-only (no service worker). Why: avoids stale cached versions in preview and Capacitor shell.
