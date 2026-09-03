# Stacey Website — Recovery and Controlled UI/UX Refinement

- [x] Recover the Stacey Version 11.5 repository and verify the `pre-post-call-update` baseline commit.
- [x] Restore the locally approved V2 overlay files and three approved image assets from preserved sources or Git objects.
- [x] Confirm the recovered build reproduces the last verified Home, About, Individual, Couples, FAQ, Policies, and Contact state before applying any new refinement.
- [x] Preserve all approved Version 11.5/V2 content, imagery, page order, and layout composition.
- [x] Audit desktop and 390 px mobile typography for readable sizes, balanced line lengths, and intentional wrapping.
- [x] Audit vertical spacing, navigation behavior, CTA clarity, touch targets, image crops, contrast, and keyboard focus.
- [x] Apply only restrained CSS and behavior refinements; do not redesign pages or rewrite clinical copy.
- [x] Re-test every public route on desktop and mobile after refinement.
- [x] Capture representative final renders for user approval before publication.

## Headline-wrap correction

- [x] Inventory every primary page headline and any forced `<span>` or block-level line-break behavior.
- [x] Replace awkward forced breaks with natural phrase-aware wrapping without changing approved wording.
- [x] Keep headline sizes calm and proportional to Version 11.5 rather than enlarging them.
- [x] Increase Stacey’s header name, credential, navigation labels, and Consultation control by approximately 10% without increasing the header’s overall height.
- [x] Confirm the enlarged desktop navigation still fits cleanly at laptop widths and does not crowd the Consultation control.
- [x] Validate all primary pages at 390 px phone, 660 px wide-phone, 768 px tablet, 1024 px laptop, and 1440 px desktop widths.
- [x] Correct isolated one-word lines and collisions with the header while preserving the established layout.
- [x] Increase multiline display line-height enough to separate descenders and ascenders, including “ready” above “let’s” on Contact.
- [x] Verify no serif glyph collisions remain in any two-line or three-line page title.
- [x] Re-run route, menu, CTA, FAQ, Policies, and contact-form structure QA after the typography fix.
- [x] Capture representative corrected pages for user approval before publication.
## GitHub publication

- [x] Confirm the reviewed local revision is `038375a`; publish that exact committed revision without including later checklist-only edits.
- [x] Inspect GitHub authentication and remote production-branch state without changing the remote.
- [x] Restore authenticated write access without requesting or exposing a password.
- [x] Do not use the sandbox GitHub/Google sign-in flow; it is not accessible to the user.
- [x] Use a repository-scoped write credential approved through GitHub.
- [x] Confirm the remote production branch divergence and preserve the prior state as a rollback branch.
- [x] Publish reviewed revision `038375a` to the production branch after authentication, divergence review, and user confirmation.
- [x] Wait for GitHub Pages to deploy the new production revision successfully.
- [x] Verify the permanent public Home, About, Individual, Couples, Professional, Transitions, FAQ, Policies, and Contact routes on desktop and mobile.
- [x] Confirm the permanent site displays the final approved images, headline wraps, CTA labels, and Contact line spacing.
- [x] Provide the permanent public URL only after deployment and route verification succeed.

## Ways to Begin navigation update

- [x] Replace the three existing Therapy, Approach, and Specialties cards with four cards.
- [x] Use the exact navigation-matched labels and order: `01 Individual`, `02 Couples`, `03 Professional`, `04 Transitions`.
- [x] Link Individual to `/individual/`, Couples to `/couples/`, Professional to `/executives/`, and Transitions to `/life-transitions/` under the Stacey base path.
- [x] Preserve the approved Ways to Begin section position, typography, borders, colors, and visual hierarchy.
- [x] Confirm four equal columns on desktop, two columns at tablet width, and one clear column on mobile.
- [x] Confirm each card works through a real click and opens the correct existing page.
- [x] Publish this correction independently of the deferred form-relay work.

## Footer emphasis update

- [x] Increase the highlighted right-side footer group’s size, weight, and contrast without changing its position.
- [x] Give `Fees, policies + parking` a clearly recognizable link treatment and preserve its existing Policies destination.
- [x] Keep `Dr. Stacey Girdner` legible but visually secondary to the practical-information link.
- [x] Confirm the emphasized footer remains balanced on desktop, tablet, and mobile.
- [x] Apply the same footer treatment consistently across every route through the shared overlay stylesheet.

## FAQ reassurance update

- [x] Remove the standalone note `You do not need to know exactly what to say before you call.` from below the FAQ list.
- [x] Replace the first FAQ answer with three shorter sentences for easier reading.
- [x] End the first FAQ answer with `You do not need to know exactly what to say before you call.`
- [x] Preserve the existing first question, accordion styling, approved child-staircase image, and all other provisional FAQ content.
- [x] Confirm the revised first answer expands and reads clearly on desktop and mobile.

## One-click About to Approach flow

- [x] Identify the existing `Learn about my approach` control and the duplicated static Approach section appended to About.
- [x] Remove only the duplicated static Approach section from About, including now-unused overlay styling.
- [x] Change the existing control to navigate directly to `/stacey-girdner-site/approach/` in one click.
- [x] Preserve the full dedicated Approach page, its approved content, imagery, typography, and layout.
- [x] Confirm About ends cleanly without an empty gap after the duplicate section is removed.
- [x] Confirm real-click navigation works on desktop and mobile and no second click is required.
- [ ] Publish and verify the permanent About and Approach pages before client handoff.

## About portrait clarity

- [x] Measure the current portrait file’s native dimensions, compression, and desktop/mobile rendered size.
- [x] Search preserved uploads, repository history, and public results for a higher-resolution version of the same approved portrait.
- [x] Confirm no higher-resolution copy of the same approved portrait is available before restoration.
- [x] Restore and upscale the approved portrait while preserving Stacey’s facial identity, expression, hair, clothing, background, and crop.
- [x] Web-optimize the restored image to 1200×1600 and approximately 404 KB for clarity without unnecessary page weight.
- [x] Confirm the portrait remains prominent, clear, and safely cropped on desktop and mobile.
- [ ] Publish the portrait correction after the completed side-by-side fidelity review.
