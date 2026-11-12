# RepoAtelier skill — editing and visual reference

## Good opening copy

Use: `[Project] helps [specific user] achieve [observable result] using [distinguishing method].`

Prefer: 'Compare two JSON files and get a readable change report.'
Avoid: 'A revolutionary AI-powered platform that seamlessly unlocks transformative insights.'

## Document order

For CLI: promise -> 30-second command -> sample output -> install -> options -> limits.
For web: promise -> real UI screenshot -> live demo if real -> quickstart -> key flows -> limitations.
For library/API: promise -> tiny call example -> expected output -> API essentials -> install and compatibility.
For maintained OSS: promise -> practical demo -> install -> docs -> contributing/security/release info.

## Badge and visual style

Use up to three important badges in simple repos. Every badge must connect to an actual observable status. Prefer clean headings, code examples and one useful screenshot over banners of random icons. GitHub README supports Markdown images/GIFs; animation may be disabled by users.

## Copy quality tests

- Could a first-time visitor explain what it does after reading the first paragraph?
- Can they complete a quickstart without guessing prerequisites?
- Are all commands real and up-to-date?
- Does every number or benchmark have a source and method?
- Does the screenshot show real current functionality?
- Are known limitations clearly disclosed?

## Never

Fake features, fake tests, fake stars, fake downloads, fake endorsements, invented package registry entries, stock photos presented as actual app output, sensitive screenshots, unapproved licenses, silent remote writes, discarded human authorship.
