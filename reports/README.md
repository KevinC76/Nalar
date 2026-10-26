# Validation

Nalar is a local development demo with synthetic data. Detailed JSON reports,
conversation transcripts, screenshots and runtime records are generated locally
in this directory and are excluded from Git.

## Verified behavior

- Publication checks on 26 October 2026 repeated the production build,
  TypeScript, four unit tests and eight integration groups successfully. A
  source-only checkout also passed TypeScript without local build/config files.
- Next.js production build and TypeScript checks pass on Node.js 22.
- Four unit tests cover 15 modules, 75 questions, scoring, review scheduling,
  chunking, graph validation, context bounds and citation IDs.
- Eight integration groups use a real isolated ChironDB process and the published
  SDK. AI responses in this suite come from an explicit deterministic fixture;
  they do not establish real model quality.
- The real-provider development campaign on 25 October 2026 used
  `gpt-4.1-2025-04-14` and `text-embedding-3-small` with 1,536 dimensions.
  Recall@6 was 1.00 on 45 curated queries. Nine tutor responses and four additional
  unsupported-question/graph-grounding checks completed and were inspected
  against retrieved sources by Codex.
- The active corpus contains 105 points and 125 graph relations. Restart,
  ownership, sessions, index replay, failed activation and source validation
  were checked with the real database.
- Desktop/mobile views were checked at widths of 1,440 and 390 CSS pixels.

These are development checks on a small curated corpus. They are not a held-out
model evaluation, educator approval, BEIR/MTEB/ann-benchmarks result, production
security qualification or general prompt-injection certification.

## Reproduce

Follow the database and environment setup in the project README, then run:

```sh
npm run check
npm test
npm run build
npm run test:integration
```

The integration suite uses separate ports and data, and stops its own processes.
Its database artifacts remain under the ignored `.runtime/` directory.

For real-provider checks, configure your own keys, index the corpus, start the
application and run:

```sh
npm run knowledge:index
npm run rag:evaluate
npm run tutor:evaluate
```

The tutor evaluator creates synthetic accounts and revokes their login sessions
after testing. Responses still require direct review of factual support,
language and teaching quality; successful streaming alone is insufficient.
