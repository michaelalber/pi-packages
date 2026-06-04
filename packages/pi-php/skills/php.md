# php

Use this skill when working on PHP, Laravel, Eloquent ORM, or Vue.js / TypeScript projects.

## Before writing any code
1. Call `search_knowledge("Laravel {pattern}", collection="php")` — Laravel, Eloquent, PSR standards
2. Call `search_knowledge("{component}", collection="javascript")` for Vue.js / TypeScript work
3. Call `search_knowledge("{pattern}", collection="patterns")` for service layer, repository, DDD questions
4. Call `search_code_examples("{pattern}", language="php")` for implementation examples
5. Use returned patterns — never invent method signatures or library APIs

## Invariants
- `declare(strict_types=1)` at the top of every PHP file — no exceptions
- Type-hint all function parameters and return types
- Use Laravel Form Requests for all input validation — never trust raw `$request->input()`
- Use Eloquent ORM or the Query Builder with bound parameters — no raw string-concatenated SQL ever
- Access config values via `config('key')` helpers — never call `env()` directly in application code
- Store secrets in `.env` (gitignored); `config/` files reference `env()` only
- Follow PSR-12 coding style; enforce with PHP-CS-Fixer or PHP_CodeSniffer
- Prefer service classes with constructor injection over `static` facades in business logic
- Mark all generated blocks: `# <AI-Generated START>` ... `# <AI-Generated END>`

## Task approach
- Single method or function: generate directly
- Feature touching 2+ files: list steps → wait for confirmation → execute one file at a time
- Any uncertainty about a Laravel API: `[CANNOT COMPLETE: <reason>]` — never guess

## Quality gates
- Cyclomatic complexity per method < 10
- Pest (or PHPUnit) test file created before production file
- All public service methods have doc-block comments
- Code coverage target ≥ 80% for business logic, ≥ 95% for security-critical paths

## Eloquent / database rules
- Use Eloquent relationships (`hasMany`, `belongsTo`, etc.) — do not hand-roll joins for relational data
- Eager-load relationships with `with()` to prevent N+1 queries
- Never concatenate user input into raw SQL queries or `DB::statement()` calls
- Name migrations descriptively: `add_email_index_to_users`, not `migration_001`
- Run migrations in a separate step — coordinate with the database owner

## Vue.js rules
- Use Composition API (`<script setup>`) — not Options API for new components
- Type all props and emits with TypeScript interfaces
- Keep components under 200 lines — extract composables for reusable logic

## grounded-code collections for this project type
| Collection | Use for |
|---|---|
| `php` | PHP manual, Laravel 5.5 / 6.x / 12.x, Eloquent, PSR standards |
| `javascript` | Vue.js 2/3, TypeScript, composables |
| `patterns` | Service layer, repository pattern, DDD, vertical slice |
| `internal` | XP practices, TDD, OWASP, engineering standards |
