# এরপর কী কী লাগবে · What is needed next

Everything below is **not** built yet. Ordered by impact. Each item says *why it matters* and *what it takes*.

---

## 1. Backend, accounts and sync — the biggest missing piece

Right now progress lives in `localStorage` on one device. Lose the browser profile and the progress is gone (the JSON export is the only safety net).

**What is needed**
- A database: **Supabase** (Postgres + auth + row-level security) is the fastest fit; Firebase or Pocketbase also work.
- Tables: `profiles`, `cards` (word_id, stability, difficulty, due, reps, lapses), `sessions`, `drafts`, `badges`, `xp_events`.
- A sync layer in `src/core/sync.ts` that replays the local event log upward and merges on login (last-write-wins per card is enough to start).
- Anonymous-first accounts: let people use the app, then "claim" their progress with a login. The store is already event-shaped, so this is a migration, not a rewrite.

**Effort:** 2–4 days · **Cost:** free tier is enough for thousands of learners.

## 2. Social: leaderboard, classrooms, shared decks

The single strongest retention lever in every successful language app, and impossible without item 1.
- Weekly league with XP (the XP/day series already exists in `analytics.dailySeries`).
- Teacher dashboard: create a class, assign levels, see who is falling behind.
- Shareable decks (URL-encoded word id lists) and friend challenges.

**Effort:** 3–5 days after the backend exists.

## 3. A real AI tutor behind the same interface

The current tutor is a curated offline engine. It is genuinely useful, but it cannot answer open questions.
- Add `src/core/llm.ts` implementing the same `ask(input, ctx) → TutorReply` contract; keep the offline engine as the fallback.
- Server-side proxy for the API key (never ship a key in the bundle). Any provider works — Claude, GPT, Gemini, or a local model.
- Prompt the model with the learner's state: their CEFR level, the cards that keep lapsing, their last writing draft, and the Bangla transfer errors they repeat.
- Guardrails: force the reply into the existing block format (`para`, `good`, `bad`, `list`, `quiz`) so the UI needs no changes.

**Effort:** 1–2 days · **Cost:** ~$0.001–0.01 per conversation.

## 4. Better pronunciation scoring

Browser `SpeechRecognition` gives a transcript, not a phoneme analysis, so a learner with a heavy accent but correct words can score low, and the reverse can happen too.
- **Azure Speech SDK** or **Google Cloud Speech** return per-phoneme accuracy and stress information.
- Record the attempt with `MediaRecorder` so the learner can compare their audio with the model.
- Store attempts so a learner can hear their own progress over months.

**Effort:** 2–3 days · **Cost:** per-minute API billing; needs a free-tier plan.

## 5. Content: the corpus is a starter, not a library

Shipped today: 120 words, 5 passages, 24 dictation lines, 24 grammar drills, 12 idioms, 12 placement items, 5 writing prompts, 10 explainer articles, 16 error patterns.

**To be genuinely competitive**
- **2 000–5 000 words**, CEFR-tagged, each with IPA, Bangla meaning, 2 examples, collocations and **native-speaker audio** (licensed recordings, not TTS).
- **50+ reading passages** across topics Bangladeshi learners actually meet (admissions, job market, climate, tech, health).
- **Grammar bank of 200+ drills** with explanations reviewed by a teacher.
- A **content pipeline**: move the curriculum out of `src/data/*.ts` into JSON/CSV or a headless CMS, add a validator (the `tests/data.test.ts` rules already are that validator) and a review workflow.
- **Teacher review** of every Bangla translation and every CEFR label — this is the one thing an AI cannot self-certify.

**Effort:** ongoing; 1–2 weeks for a first serious expansion, plus a content editor in the team.

## 6. Design assets

- App icons in 192/512 (the manifest currently reuses `assets/logo.png`), favicon set, apple-touch-icon.
- Illustrations for empty states and the onboarding (today it uses icon badges).
- An OG image for social sharing and a proper `og:` / `twitter:` meta block.
- A short brand guide: the palette is defined as CSS variables in `src/style.css` (`--ej-accent`, `--ej-accent-2`), so a rebrand is a 5-line change.

**Effort:** 2–3 days with a designer.

## 7. Engineering hygiene that is missing today

| Item | Why |
|---|---|
| **ESLint + Prettier + editorconfig** | Consistency once more people contribute. Not configured yet — `tsc --noEmit` and the tests are the only gates. |
| **GitHub Actions CI** | Run `typecheck`, `test`, `build` on every push; fail the PR otherwise. |
| **Deploy pipeline** | Cloudflare Pages / Vercel / Netlify. `npm run build` already produces a static `dist/`; a preview deploy per branch makes review trivial. |
| **Error tracking** | Sentry or GlitchTip — right now a runtime error is invisible. |
| **Product analytics** | Plausible or Umami (privacy-friendly) to learn which labs are actually used. |
| **Lighthouse budget** | The bundle is ~205 kB JS with no framework; keep it that way with a CI budget assertion. |
| **Component tests for the UI layer** | The smoke test covers the happy path through the shell; per-view interaction tests would catch regressions faster. |

**Effort:** 1 day for CI + lint + deploy; 1 day for tracking.

## 8. Accessibility and inclusion

- A real audit with **axe-core** and a screen reader (Bangla TTS support is uneven — worth testing on Android and iOS separately).
- Focus management: the modal traps focus correctly, but the command palette and the review card should announce state changes through a live region.
- Keyboard-only playthrough of every lab, plus visible focus rings tuned for the dark theme.
- Optional **WCAG AA contrast check** on the chart colours.

**Effort:** 2 days for the audit and fixes.

## 9. Mobile

- PWA install flow is wired (manifest + service worker) but needs iOS-specific testing: no push, no `beforeinstallprompt`, service-worker quirks.
- Offline audio: bundle short clips for the most common 500 words so Listening works on a bad connection.
- Push notifications for the review queue (needs a backend + web push VAPID keys) — the single best streak-keeping feature.

**Effort:** 2–3 days for PWA hardening; push needs item 1.

## 10. Legal, privacy and content licences

- **Privacy policy** — the honest version is short and a selling point: "your progress never leaves your device until you log in".
- **Terms of use** and an age gate if children will use it.
- **Licence the content**: every passage, recording and translation needs a clear owner. The five passages shipped here are original to this repo.
- Choose the repo licence (currently none is declared) before inviting contributors.

**Effort:** half a day with a lawyer's template.

## 11. Product questions to settle before building more

1. Who exactly is the first user — HSC student, admission candidate, job seeker, or garment-sector worker learning spoken English?
2. Free forever, or freemium (sync + AI tutor behind a paid tier)?
3. Bangla-first or English-first for the marketing site?
4. Do we want a native app (Capacitor/React Native) or is the PWA enough?

---

## Suggested order for the next two sprints

**Sprint 1 (foundation):** ESLint + CI + deploy → Supabase auth & card sync → JSON import/export already done → error tracking.
**Sprint 2 (value):** LLM tutor behind the existing contract → leaderboard → corpus expansion to 500 words with native audio → accessibility audit.

## What could not be verified in the build environment

- No audio device, so `SpeechSynthesis` output and `SpeechRecognition` accuracy were never exercised for real — both are feature-detected and degrade with a message.
- No outbound internet, so the Google Fonts request and any external API could not be loaded here; the app itself needs neither to run.
- iOS Safari behaviour (dialog element, `SpeechRecognition` prefixes, PWA install) was not tested.
