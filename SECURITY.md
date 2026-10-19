# Security Policy

## Reporting a vulnerability

Please **do not open a public issue** for a security problem.

Report it privately using GitHub's [private vulnerability reporting](https://github.com/Vigesh-VS/qr-generator/security/advisories/new) (Security tab, then **Report a vulnerability**). Include:

- what the problem is and where it is,
- steps to reproduce it,
- what an attacker could do with it.

You can expect a first reply within 7 days. Once the problem is fixed, we are happy to credit you if you want.

## Supported versions

Only the latest version on the `main` branch (the one deployed to production) receives fixes.

## How the app protects users

- **Everything runs in the browser.** There is no server, no database, no accounts and no analytics. What you type is never sent anywhere.
- **Text is never treated as code.** When a QR code holds plain text, scanning it opens the `/view` page, which shows the text as plain text only. It is never rendered as HTML and never turned into a clickable link.
- **Warning on the view page.** The page reminds readers that anyone can make a QR code with any text.
- **Input limits.** Text is limited to 500 characters and links to 1,500 characters, and the encoded size is capped so codes stay scannable.
- **Phishing guard.** Links with a username or password in them (such as `https://google.com@evil.example`) are refused.
- **Hidden characters removed.** Control characters and invisible text-direction characters are stripped from input.
- **Browser protections.** `vercel.json` sets a strict Content-Security-Policy (no third-party scripts, no framing), `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy` and HSTS. The `/view` page is also marked `noindex`.
- **Dependencies** are kept up to date with Dependabot.

## What a QR code cannot protect against

A QR code from this app can point to any website the creator chooses. Before you scan a code from an unknown source, check the address your phone shows before opening it.
