---
name: legal-pages
description: 'Use when the user asks for a privacy policy, terms of service, terms and conditions, or "legal pages" for their site: it reads what the site really does with data, asks only for the facts the code cannot tell, and adds both pages in the site''s language and design with footer links. Not for cookie or consent banners, or any other legal document (contracts, data processing agreements, disclaimers, imprints).'
---

# Legal pages

Writes a privacy policy and terms of service for the site in this project. Nothing else: no cookie or consent banner, no other legal document. If the user asks for one of those, say it is outside what this skill does.

The pages describe what the site actually does. A clause for a practice the site does not have is wrong, not cautious.

Work in this order.

## 1. Read what the site does with data

Read the project before asking anything. Find and note, with the file each fact comes from:

- **forms** and their fields: contact, sign-up, newsletter, checkout, search, file upload; where each submits and what happens to the data;
- **accounts**: sign-up and sign-in, what a profile stores, whether accounts can be deleted;
- **payments**: the payment provider and what the site itself sees or stores;
- **analytics and other third-party scripts**: analytics, tag managers, chat widgets, embedded video, maps, fonts or other assets loaded from third-party servers, advertising pixels;
- **cookies and browser storage**: what the site sets itself and what the third-party scripts set;
- **email sending**: transactional and marketing mail, and the provider;
- **storage**: the database and file storage, and where they are hosted when the configuration says so;
- **logs**: what the server or the hosting records about requests;
- **children**: anything aimed at children or collecting age.

A static site with no forms, no scripts and no cookies has a short privacy policy. Say so; do not pad it.

## 2. Ask only for what the code cannot tell

Ask the user, in one message, only for facts the project does not contain:

- the legal name of the business or person running the site;
- its postal address;
- the contact email for privacy and legal questions;
- the countries its customers or visitors are in;
- for the terms: what is sold or provided, the refund and cancellation policy, any age limit.

Add a question only when the code raises it, for example how long contact messages are kept when the site stores them.

Never invent any of these. When the user does not answer, write a clearly marked placeholder on the page, such as `[Business legal name]` or `[Refund policy: to be completed]`, and list every placeholder in the final message.

## 3. Write the pages

- Write in the site's language. A site with several languages gets each page in each language, following the site's existing pattern for translated pages.
- Use the site's own layout, components and styles. The pages are part of the site, not a pasted document: same header, footer, type and spacing.
- Put the date of the last update at the top of each page.
- Plain language, short sections with headings, lists where they help. Explain what is collected, why, who receives it, how long it is kept and how to ask for access or deletion.
- Describe only what the site does. No clause for accounts, payments, analytics, cookies, newsletters or children unless step 1 found them.
- Name the third parties the site really uses, by name, with what they receive.
- Use the paths the site's routing conventions suggest, such as `/privacy` and `/terms`, unless pages already exist; then update them in place.

The privacy policy covers, where they apply: who runs the site and how to contact them; what is collected and how; why it is used and, for visitors in the EU, UK or similar regimes, the legal basis; who receives it, including transfers abroad; how long it is kept; the visitor's rights and how to use them; cookies and similar storage; security in plain terms; children; how changes are announced. The section list and the questions behind each are in [references/privacy-policy.md](references/privacy-policy.md).

The terms of service cover, where they apply: who provides the site and the service; what is offered; accounts and the user's obligations; prices, payment, delivery, refunds and cancellation; acceptable use; intellectual property; limits of liability as far as the law allows; termination; governing law and disputes; how the terms change; contact.

## 4. Link them from every page

Add links to both pages in the footer of every page, in the footer component when there is one. Match the footer's existing link style. Check that every page actually renders the footer, including error and landing pages with their own layout.

## 5. Final message

Tell the user, in the chat and not on the page:

- that these pages are a draft and not legal advice, and that a lawyer should review them before relying on them;
- the clauses a lawyer should check, named specifically for this site: for example the legal basis for each use of data, international transfers, retention periods, the refund policy, the liability limits, the governing law, consumer rights in the customers' countries;
- every placeholder left on the pages;
- that the pages must be updated when the site later gains a form, accounts, payments, analytics or another third-party service, and that this skill can update them then.

Do not put disclaimers, review markers or notes to the user on the pages themselves.
