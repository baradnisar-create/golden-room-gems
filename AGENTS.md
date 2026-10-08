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

# Project rules

- Site content (contact, rooms, facilities, videos) lives in `src/lib/site.ts`; edit there so all pages stay in sync.
- Booking requests are inserted from the browser into `booking_requests` (anon insert-only RLS); only admins (via `has_role`) can read/update/delete.
- First account to sign up becomes admin via DB trigger; roles live in `user_roles`, never on profiles.
- Admin panel lives under `src/routes/_authenticated/` (client-only gate).
- Guest AI assistant: streaming server route src/routes/api/chat.ts; knowledge built from src/lib/site.ts so answers stay in sync with site content.
