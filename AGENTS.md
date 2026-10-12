# Architecture rules
- Keep third-party feedback inside a shared dialog with a configured, validated Google Forms URL; Google owns responses and submission confirmation.
- Manage temporary feedback pause at the game page without unmounting game views; timers preserve their clock state and resume without counting paused time.
- Keep elapsed-time pause calculations in a pure clock module with focused tests so timer behavior is deterministic.