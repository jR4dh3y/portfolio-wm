## general guidelines:

- use bun for the package manager
- when installing new packages, use bun add instead of manually editing the package.json file
- dont build the project locally or create dev environment.
- dont mix logic with ui components, keep them separate
- use modern svelte and sveltekit patterns and primitives
- avoid as any at all costs, try to infer types from functions as much as possible
- use tailwindcss for styling whenever possible, only resort to custom css if needed
- every svelte component should have lang="ts"
- run bun run lint to check for linting errors, bun run format, and bun run check to check for errors after making changes.
- dont write monolithic files, break them down into smaller, reusable pieces
- use components for UI

## Before You Start Coding

### Ask Yourself:

1. **Does this already exist?**
   - Search the codebase for similar functionality
   - Check the utility folders listed in "Core Principles"

2. **Can I extend something existing?**
   - Maybe a utility just needs one more function
   - Maybe a component just needs one more prop

3. **Where should this live?**
   - Is it reusable? → Put in `utils/` or `pkg/`
   - Is it specific to one feature? → Keep it local
   - Is it a constant? → Put in config

4. **Am I duplicating anything?**
   - If you're copying code, stop and extract it
   - If you're defining the same type twice, use the existing one

5. **Is this function doing too much?**
   - Can you describe it in one sentence without "and"?
   - If not, break it down

## Svelte 5 & Global Stores State Management

1. **Never clear global stores from within component `$effect` blocks.**
   - In responsive layouts (e.g., separate mobile and desktop DOM trees), a component might be rendered multiple times simultaneously.
   - If one instance clears a global store (like a navigation request) after processing it, the other instance will miss the update and fail to trigger its effect.
2. **Use nonces for deduplication.**
   - When firing one-off events via stores, attach a `nonce` or unique ID to the event payload.
   - Let each component track its `lastProcessedNonce` locally to avoid running the same event twice, rather than clearing the global store.
