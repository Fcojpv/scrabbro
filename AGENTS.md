<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- The ScrabBro game renders client-only (ClientOnly + lazy) on "/" because its contexts read localStorage during init; keep browser-only code inside that boundary.
- ScoreHistory uses its own bounded table scroll container for sticky column headers and totals; display totals from players.score so edits, bingo bonuses, and penalties remain consistent with the leaderboard.
- The table scroller must stay swipe-transparent for the view carousel: no overscroll-behavior and no touch-action override, so horizontal drags latch to SwipeableViews (the table cannot scroll horizontally) while vertical pans scroll the table.
- ScoreHistory listens to both table and page scrolling for compact player headers; keep identification in sticky columns and expose full names through accessible popovers so abbreviations remain identifiable.
- Score annotations live in game state (RoundScore.edited, adjustments, penalties) and are persisted; ScoreHistory only renders them, so totals still come from players.score.
- ScoreHistory derives its scroll cue from measured scroll geometry and observes size changes; position it above the measured sticky footer so totals stay unobstructed.
