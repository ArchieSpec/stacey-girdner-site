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

## Approach image callout removal

- [x] Remove the dedicated Approach page’s image-overlay callout box and its `APPROACH` label.
- [x] Preserve the approved main Approach copy, page structure, and one-click About link while later image replacements are applied separately.
- [x] Confirm the image remains cleanly framed on desktop and mobile after box removal.
- [x] Re-run About and Approach route/link QA before any publication.
- [ ] Publish the approved box removal only after permanent-site verification.

## Pending readability note

- [x] Raise the FAQ minimum readable text size to 11 px and scale the question, answer, and supporting-text hierarchy upward for senior visitors.
- [x] Hold implementation until the user finishes the complete note set.
- [x] Validate FAQ readability and wrapping on desktop, tablet, and mobile before publication.


## Image attribution audit

- [x] Inventory every current Stacey page image and its local asset filename.
- [x] Search Unsplash for exact or defensible matches and identify each photographer only when verifiable.
- [x] Record original source URLs, photographer names, confidence, and license/attribution notes.
- [x] Separate confirmed matches from unresolved or user-supplied/generated assets; never guess credits.
- [x] Present the attribution register for approval before adding linked `Photo by Photographer Name` credits to the site.

## Direct-submit contact form

- [ ] Replace the current `mailto:` contact-form behavior with a direct email relay to `stacey@staceygirdner.com`.
- [x] Add submit, success, error, and loading states without changing the approved V11.5/V2 visual design.
- [ ] Verify the form flow on desktop and mobile; use a real relay key only after Stacey provides or approves the access key.
- [x] Remove the open-ended message/chat field so visitors are not invited to submit private or clinical details.
- [x] Retain only contact information plus preferred contact method (How) and preferred contact timing (When).
- [x] Update privacy guidance and relay payload to reflect contact coordination only.
- [x] Set the FAQ minimum text size to 11px and scale the related question, answer, and supporting text hierarchy for senior readability.
- [x] Verify the FAQ typography at desktop, tablet, and mobile widths without changing the approved content or layout.
- [x] Remove the sentence `Please share contact details only. Do not include confidential, urgent, or crisis information.` from beneath the submit button.
- [x] Confirm the sentence is absent and form spacing remains balanced on mobile, tablet, and desktop.

## Stacey portrait replacement

- [x] Replace the current About-page portrait with the exact uploaded `StaceyGirdner2023WEB-1.jpg` file.
- [x] Preserve the uploaded image at its native 798×1200 dimensions without AI restoration, enlargement, or unauthorized cropping.
- [x] Verify the portrait dimensions, full composition, and About-page layout on desktop, tablet, and mobile.
- [x] Shorten the displayed portrait on desktop so the About page fits within one screen without scrolling.
- [x] Preserve the full portrait and native aspect ratio while reducing its displayed dimensions.
- [x] Keep the portrait comfortably readable on tablet and mobile instead of forcing the desktop height limit at every breakpoint.

## FAQ computed-size correction

- [x] Correct the first FAQ consultation answer so its actual computed size is never below 11px.
- [x] Verify the exact sentence beginning `The free consultation is a brief, 15-minute conversation` at mobile, tablet, and desktop widths.
- [x] Confirm no later compiled or responsive CSS rule reduces FAQ answers to 9px.

## Sitewide 11px minimum typography

- [x] Audit computed visitor-facing font sizes on every public route at mobile, tablet, and desktop widths.
- [x] Enforce an absolute 11px minimum for all visitor-facing text, including labels, navigation, buttons, notes, footer text, and form guidance.
- [x] Scale body copy, navigation, questions, headings, and display titles proportionally above the 11px floor to preserve the approved hierarchy.
- [x] Recheck wrapping, navigation fit, button fit, and one-page desktop layouts after the typography increase.

## Senior-friendly readability hierarchy

- [x] Increase body copy and FAQ answers to 17–18px for comfortable senior reading.
- [x] Increase form controls and buttons to 16px, navigation and labels to 14px, and credits and footer text to at least 13px.
- [x] Preserve a proportional distinction between body text, supporting text, questions, headings, and display titles.
- [x] Correct any new wrapping, navigation-fit, button-fit, image-credit, or one-screen layout issues caused by the larger text.
- [x] Audit computed typography and responsive layout on every public route at mobile, tablet, and desktop widths.

## Sitewide contrast audit

- [x] Audit every visible text element’s computed foreground and effective background contrast on all public routes at mobile, tablet, and desktop widths.
- [x] Require at least 4.5:1 contrast for normal text and 3:1 for qualifying large text under WCAG AA.
- [x] Check navigation, buttons, form controls, links, photo credits, footer copy, image notes, and focus states separately.
- [x] Confirm no palette correction is required because all measured text pairs pass WCAG AA.
- [x] Rerun senior typography, photo-credit, route, and responsive regressions after the contrast audit.

## Reusable workflow skill

- [x] Create a reusable client-website fidelity and launch skill using the official skill-creation workflow.
- [x] Capture approved-design preservation, change-control, privacy-conscious forms, image attribution, senior-readable typography, contrast, responsive QA, and publication gates.
- [x] Bundle reusable audit scripts and launch checklists without including Stacey-specific personal or project data.
- [x] Validate the skill package and deliver it as an installable skill card.

## Final GitHub publication and WordPress migration

- [ ] Recheck the complete working tree, final QA artifacts, branch, remote, and last published revision before committing.
- [ ] Preserve a rollback reference to the current permanent GitHub Pages revision.
- [ ] Resolve or explicitly gate the missing Web3Forms access key before publishing a final version that claims direct email delivery.
- [ ] Commit and push the exact approved revision to the Stacey GitHub repository.
- [ ] Verify all routes, images, credits, typography, contrast, and contact behavior on the permanent GitHub Pages URL.
- [ ] Inspect the authenticated WordPress environment and choose a migration method that preserves the approved static design.
- [ ] Migrate the site into WordPress without redesigning it or disabling the GitHub rollback source.
- [ ] Verify the WordPress version on mobile, tablet, and desktop before changing any production domain routing.
- [ ] Deliver the GitHub revision, WordPress URL, rollback notes, form dependency, and independent operating instructions.

## Approach image replacement

- [x] Replace the tree-stump image on the Approach page with the exact uploaded `rowan-freeman-_J8IRsA4hG0-unsplash.webp` photograph.
- [x] Preserve the approved Approach page layout and choose a responsive crop that keeps the archway and path legible.
- [x] Update the image alt text to describe the archway opening onto a landscape.
- [x] Re-run the 11px computed-font audit and route suite after the image replacement.
- [x] Replace the Approach image again with the exact Unsplash source photo `UePlohjDqNY` supplied by the user.
- [x] Verify the photographer displayed on the `UePlohjDqNY` source page and add a linked `Photo by …` credit beneath the image.
- [x] Preserve the approved Approach layout while selecting a responsive focal position for the new image.
- [x] Re-run source, credit-link, route, and senior-readable font-floor checks on mobile, tablet, and desktop.

## Photographer credits

- [x] Verify an Unsplash profile or exact source link for Jan Tinneberg, Chris Lawton, Jukan Tateisi, Ambrose Chua, Javier Allegue Barros, Jeremy Bishop, Gregoire Jeanneau, and Nicholas Sampson.
- [x] Add `Photo by Jan Tinneberg` beneath the Home door-opening image.
- [x] Add `Photo by Chris Lawton` beneath the Transitions string-of-leaves image.
- [x] Add `Photo by Jukan Tateisi` beneath the FAQ stairs-with-Lenore image.
- [x] Add `Photo by Ambrose Chua` beneath the Contact orange-stairs image.
- [x] Add `Photo by Javier Allegue Barros` beneath the Fees and Policies street-sign image.
- [x] Add `Photo by Jeremy Bishop` beneath the Individual trees-with-light image.
- [x] Add `Photo by Gregoire Jeanneau` beneath the Couples double-stairs image.
- [x] Add `Photo by Nicholas Sampson` beneath the Professional person-on-mountain image.
- [x] Keep every credit at or above the 11px sitewide minimum and verify all links and layouts on mobile, tablet, and desktop.
