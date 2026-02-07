# Noor Web

Healthcare AI assistant platform built with Next.js.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS v4
- **UI Components**: Base UI (`@base-ui-components/react`) - unstyled, accessible
- **AI**: OpenAI SDK, Streamdown for markdown rendering
- **Animations**: Framer Motion
- **Icons**: Lucide React

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (dashboard)/        # Authenticated app pages
│   ├── (marketing)/        # Public pages
│   └── api/                # API routes
├── components/             # React components
├── lib/
│   ├── openai.ts           # OpenAI client config
│   ├── prompts.ts          # System prompts
│   └── types/              # Shared TypeScript types
```

## Commands

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run lint     # Run linter
```

## Key Conventions

### Base UI Components
Import from `@base-ui-components/react/[component]`. Use Tailwind's `data-[attr]:` syntax for state-based styles (e.g., `data-[disabled]:opacity-50`).

### AI/LLM Code
- OpenAI config lives in `lib/openai.ts`
- System prompts live in `lib/prompts.ts` (keep content separate from code)
- Shared types in `lib/types/`
- Use Streamdown with `isAnimating` prop for streaming markdown

### Design Tokens
Use semantic color classes: `text-heading`, `bg-bg`, `text-text`. Defined in `globals.css`.

### Animations
Use Framer Motion for animations. Add animations tastefully to enhance UX:
- Use `ease: "easeInOut"` for all transitions
- Use `AnimatePresence` for enter/exit animations on conditional elements
- Use `motion.div` with `layout` prop for smooth reflows when content changes
- Keep durations short (0.15-0.2s) for snappy interactions
- Avoid animating elements that remount frequently (use JSX variables instead of inline function components)

## Gotchas

- IMPORTANT: Streamdown requires shadcn-compatible CSS variables in `globals.css`
- Base UI components are unstyled - always add Tailwind classes
