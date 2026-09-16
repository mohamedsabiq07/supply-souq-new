# Supply Souq: website research and five design directions

Research date: 16 September 2026. Prepared to choose a design direction before building a full model.

## Recommendation

Start with **1. Quote Desk**. Make the first screen explain one useful transaction: describe an electrical material requirement, receive supplier quotations, and compare the offers. Show a small, clearly labelled example of the result beside a plain headline. This communicates more about Supply Souq than a generic skyline, an animated market ticker, or a broad procurement slogan.

The strongest alternative is **3. Project Studio** if the priority is a more premium impression. **2. Materials Market** is the most familiar browsing experience. All five concepts should use the same truthful business description so the decision is about design and usability, rather than five different business promises.

**Proposed headline:** “Compare electrical material quotes for your UAE project.”

**Proposed supporting copy:** “Describe the materials, quantities and delivery location you need. Review supplier offers by specification, price and delivery terms.”

**Primary action:** “Request material quotes.” **Secondary action:** “See an example comparison.”

This copy is a design recommendation. Final wording must match the service actually available at launch, especially supplier coverage, matching, delivery responsibilities, and response expectations.

## Scope and confidence

- The website audit concerns the **local project version**, including its React source and available product flows. The supplied Vercel URL is protected; its live rendering and behavior have **not been inspected** for this report. Findings are not a claim about what an unauthenticated visitor currently sees in production.
- Public comparator pages and primary UX research were reviewed on 16 September 2026. The comparison records observable positioning and interface patterns; it does not establish competitors’ conversion rates or independently validate their marketing claims.
- The project currently presents an **electrical materials procurement service**. It should not be redesigned as a broad cement, steel, sand, and blocks marketplace merely because those categories appear on competitors’ websites.
- The source includes simulated uploads, illustrative financial data, and hardcoded marketing claims. These cannot be promoted as verified operational capabilities or outcomes.
- No full website implementation or publishing is proposed at this stage. The immediate deliverable is five concepts for selection, with enough detail to compare them intelligently.

## What the current project communicates

### Preserve the useful foundation

Supply Souq has a concrete core idea: a buyer submits a requirement and compares supplier quotations. The project contains manual RFQ creation, supplier profiles, and quotation comparison interfaces. That gives the design a useful product story to show, rather than requiring an invented brand narrative.

The local catalog contains ten electrical category groups: low-voltage cables and building wires; medium/high-voltage cables; switchgear, distribution boards and circuit breakers; conduits, trays and containment; fire-resistant and instrument cables; earthing and lightning protection; lighting; wiring accessories; transformers/substations; and solar/UPS equipment. These are catalog definitions in source, not evidence of live stock or supplier capacity. See [catalog definitions](<C:/Users/moham/Desktop/supply souq antigravity/src/data/seedData.ts:3>).

The supplier directory reinforces this specialization with “Verified UAE Electrical Suppliers & Stockists.” Its location controls currently list Dubai, Sharjah and Ajman. A future design should show only confirmed service coverage, even if broader UAE positioning remains appropriate. See [supplier directory](<C:/Users/moham/Desktop/supply souq antigravity/src/pages/public/SuppliersPage.tsx:26>).

### Improve first-screen comprehension

The main headline, “UAE Procurement, Simplified,” communicates a broad benefit but does not immediately identify electrical materials or the quotation model. The surrounding promises introduce uploads, speed, wholesale pricing and verification before the visitor has a simple picture of the transaction. See [homepage hero](<C:/Users/moham/Desktop/supply souq antigravity/src/pages/public/HomePage.tsx:129>).

The primary “Post Live RFQ (100% Free)” label uses an acronym and operational language. “Request material quotes” is easier for an unfamiliar buyer to interpret. The first occurrence of RFQ can be explained as “request for quotation”; it does not need to be the main action label.

The cost-audit action competes with the core buyer task. Cinematic sections, problem storytelling and feature bands precede the explicit three-step explanation. A visitor therefore has to work through a long presentation to understand a relatively simple exchange. See [homepage sequence](<C:/Users/moham/Desktop/supply souq antigravity/src/pages/public/HomePage.tsx:250>).

Navigation currently emphasizes items such as pricing, “Onboarding SOP” and cost audit. Buyers need familiar destinations such as Materials, How it works, For suppliers and Contact. Internal terminology such as SOP should become “Getting started” if that content remains useful. See [navigation](<C:/Users/moham/Desktop/supply souq antigravity/src/components/layout/Navbar.tsx:163>).

### Resolve journey gaps alongside the visual design

These are source-level findings, not completed live-account tests:

- **Preserve intent through sign-in.** The homepage sends a requested destination to login, but the ordinary success callback routes to the role dashboard without consuming that destination. A buyer who begins a request can therefore lose the expected continuation. See [homepage action](<C:/Users/moham/Desktop/supply souq antigravity/src/pages/public/HomePage.tsx:54>) and [login callback](<C:/Users/moham/Desktop/supply souq antigravity/src/App.tsx:309>).
- **Make Materials a real destination.** Both the categories and supplier views currently render the supplier directory. Public navigation is primarily state-based rather than reflected in normal URLs, limiting expected sharing, refresh and back-navigation behavior. See [view rendering](<C:/Users/moham/Desktop/supply souq antigravity/src/App.tsx:265>) and [navigation state](<C:/Users/moham/Desktop/supply souq antigravity/src/App.tsx:158>).
- **Close the intermediate-width navigation gap.** Desktop navigation begins at the medium breakpoint, while the mobile menu is hidden from the smaller breakpoint. The resulting 640–767 px interval lacks the normal navigation controls in the reviewed styling. See [desktop navigation](<C:/Users/moham/Desktop/supply souq antigravity/src/components/layout/Navbar.tsx:86>) and [mobile controls](<C:/Users/moham/Desktop/supply souq antigravity/src/components/layout/Navbar.tsx:275>).
- **Provide working contact and policy paths.** Footer legal labels are non-interactive spans and the footer does not render concrete phone/email details. Add valid destinations and confirmed business contact information. See [footer](<C:/Users/moham/Desktop/supply souq antigravity/src/components/layout/Footer.tsx:140>).

The existing comparison component already exposes useful price, delivery, payment and tax-presentation fields. It is a stronger starting point for an honest hero demonstration than an invented dashboard. See [quotation comparison](<C:/Users/moham/Desktop/supply souq antigravity/src/components/rfq/QuotationComparisonTable.tsx:286>).

### Separate demonstrated functionality from promises

| Source finding | Design implication |
|---|---|
| The invoice scanner’s upload handler sets a fixed filename and displays sample results after a delay. [Handler](<C:/Users/moham/Desktop/supply souq antigravity/src/components/audit/InvoiceAuditScanner.tsx:213>) | Do not advertise a working invoice upload, OCR or live price audit. An example can be shown only as an explicitly labelled demonstration. |
| The RFQ photo handler inserts a fixed image and prepared item data. [Handler](<C:/Users/moham/Desktop/supply souq antigravity/src/components/rfq/RFQWizard.tsx:255>) | The concepts should start with manual requirements. Do not use “Upload your BOQ” as the main action until a real, validated upload flow exists. |
| Homepage metrics, customer figures, savings, testimonials and a five-quote guarantee are hardcoded in the reviewed component. [Metrics](<C:/Users/moham/Desktop/supply souq antigravity/src/pages/public/HomePage.tsx:196>), [testimonials](<C:/Users/moham/Desktop/supply souq antigravity/src/pages/public/HomePage.tsx:619>), [guarantee](<C:/Users/moham/Desktop/supply souq antigravity/src/pages/public/HomePage.tsx:750>) | Treat these as unsupported by the reviewed source. Publish them only when there is a dated, attributable evidence trail and an operational basis for guarantees. Hardcoding alone does not prove a claim false. |
| The market ticker says “LIVE TELEMETRY,” while financial values can be randomly varied in application state. [Ticker](<C:/Users/moham/Desktop/supply souq antigravity/src/components/ui/MarketTicker.tsx:51>), [state update](<C:/Users/moham/Desktop/supply souq antigravity/src/context/AppDataContext.tsx:454>) | Remove apparent live-market signals from the concepts. If an example price is useful, label it “Example — not a live quotation.” |
| The supplier directory filters supplier company type but does not also filter verification status while displaying verification language. [Directory](<C:/Users/moham/Desktop/supply souq antigravity/src/pages/public/SuppliersPage.tsx:24>) | Verification should be a specific, supported status with an explanation of what was checked. Avoid blanket claims that every visible supplier is verified. |
| A “Trusted by” treatment sits near manufacturer names. [Brand definitions](<C:/Users/moham/Desktop/supply souq antigravity/src/pages/public/HomePage.tsx:70>) | Separate materials/brands offered from customer endorsements, authorized relationships and partnerships. These mean different things. |

The seed operational arrays are empty, but this does **not** establish that the live business has no suppliers or transactions: connected data may populate them. This report flags the absence of supporting evidence in the reviewed project, not the falsity of the underlying business claims.

## Seven platforms: patterns to learn from

| Platform and source | Useful observed pattern | How to adapt it | What should not transfer |
|---|---|---|---|
| [ADBUILD, UAE](https://adbuild.ae/) | Material, supplier, factory, tender, BOQ and project-oriented entry points. | Let people recognize the sector through concrete material categories and an obvious request path. | Its extensive menu would overwhelm a focused electrical quotation service. Some dynamic sections were unavailable in extracted content; that is not evidence that its website is broken. |
| [MawadOnline, UAE](https://mawadonline.com/) | Search, emirate selection, categories, brands and product imagery. | Bring location and familiar electrical materials into the buying journey. | Retail promotions and dense product rows can imply stocked inventory and instant checkout. Category actions should lead to requests for quotes unless direct buying exists. |
| [Tradeling Enterprise](https://ent.tradeling.com/) | Procurement outcomes, onboarding actions, delivery/credit benefits, integrations and customer evidence. | Connect each benefit to a visible workflow: one request, readable offers, delivery terms and comparison. | Its financing, ERP integrations, savings and pricing claims are its own. They are not Supply Souq capabilities by association. |
| [Alibaba Buyer Central](https://buyer.alibaba.com/page/HowItWorks/Page.html) and [official RFQ explanation](https://reads.alibaba.com/unlock-business-opportunities-with-request-for-quotation-rfq-on-alibaba-com/) | Clear request-and-bid logic, supported by specifications, quantity, delivery terms and supplier assessment. | Explain the exchange in three steps and show the details that make quotations comparable. | Supplier scale, response promises, badges and payment protections cannot be borrowed. |
| [Thomas supplier discovery](https://sourcing.thomasnet.com/) and [comparison guide](https://help.thomasnet.com/compare-suppliers) | Search, evaluate and connect; profiles, certification information and structured supplier comparison. | Make comparison visible before registration. Give supplier acquisition a distinct destination. | Do not turn one useful request into a time-consuming directory exercise if matching is the core service. |
| [Procurify](https://www.procurify.com/) | Product tours and interface screenshots explain procurement workflows; named examples support outcomes. | Show an understandable example of the actual task and resulting offers. | A demo-first enterprise sales journey adds friction for a contractor who wants material quotes immediately. |
| [OfBusiness](https://www.ofbusiness.com/) and [supplier portal](https://supplier.ofbusiness.com/) | Material search, industry categories, operational imagery and a separate supplier proposition. | Use authentic material/site imagery and explain the supplier path separately. | Financing, manufacturing scale, geographic reach and growth figures belong to that business model. |

Across these references, the transferable lesson is specificity: recognizable materials, an obvious action, a clear transaction, and evidence relevant to the buyer’s decision. Their colors and visual effects are less important than those elements.

## Evidence behind the recommendations

| Principle | Source evidence and date | Recommendation for Supply Souq |
|---|---|---|
| Explain purpose immediately | NN/G’s homepage guidance calls for a clear purpose, prioritized tasks and concrete content examples. Published 31 October 2001; foundational rather than recent experimental research. [Homepage usability](https://www.nngroup.com/articles/113-design-guidelines-homepage-usability/) | Name electrical materials, UAE projects and quotation comparison in the first screen. Use a small number of clear actions. |
| Earn trust before asking for details | NN/G describes B2B buyers’ need for pricing clarity, useful information before sales contact, and explanations for requested information. Published 1 September 2019. [B2B trust](https://www.nngroup.com/articles/b2b-trust-from-b2c/) | Explain who responds, what submission commits the buyer to, applicable charges, and delivery responsibilities. Provide real company and contact information. |
| Support both search and browsing | Baymard’s search research covers exact products, product types, attributes and common naming variations; poor results can suggest an item is unavailable. Updated 29 April 2026. [Search research](https://baymard.com/blog/ecommerce-search-query-types) | Use recognizable categories and search examples such as cables, circuit breakers and lighting. Support dimensions, specifications and synonyms when product data supports them. |
| Specifications are part of the design | Baymard’s 8 May 2024 B2B electronics study used 168+ sessions with industry professionals and found value in consistent attributes and desktop comparison tables. Its mobile suggestions were not based on mobile participants in that study. [B2B research](https://baymard.com/blog/b2b-electronic-components-machinery-launch) | This is an adjacent-industry inference: surface brand, specification, quantity/unit, lead time and commercial terms consistently. Use focused mobile cards rather than forcing a large desktop table onto a phone. |
| Reduce effort, not simply step count | Baymard finds that visible fields and overall effort matter more than the number of checkout steps. Published 26 June 2024. This is checkout evidence, not a direct RFQ conversion experiment. [Form research](https://baymard.com/blog/checkout-flow-average-form-fields) | Begin with requirements, then request the details needed to price and deliver them. Preserve answers; mark optional fields and explain why contact information is needed. |
| Accessible interfaces can still be attractive | WCAG 2.2 addresses contrast, keyboard use, reflow, pointer targets and motion. The minimum target criterion is 24 × 24 CSS px with exceptions; automatically moving content lasting over five seconds alongside other content normally needs pause/stop/hide controls. Interaction-animation disabling is an AAA criterion. [WCAG 2.2](https://www.w3.org/TR/WCAG22/) | Prefer static, legible heroes; support reduced motion, clear focus states and comfortable touch controls. A practical design target of 44–48 px for main buttons goes beyond the AA minimum. |
| Speed and stability support the experience | Google’s current good thresholds are LCP ≤2.5 seconds, INP ≤200 milliseconds and CLS ≤0.1, measured at the 75th percentile, separately for mobile and desktop. [Web Vitals](https://web.dev/articles/vitals) | Avoid heavy autoplay media, compress imagery, reserve image dimensions and measure real-user performance when traffic permits. These are targets, not measured results for Supply Souq. |

These sources support principles, not a guaranteed uplift. Recommendations about colors, composition and page order are design judgment to test with actual users.

## Five concepts to compare

### 1. Quote Desk — recommended

**Character:** white and pale grey, deep navy type, one warm action color, crisp rules, restrained corners. Preserve useful recognition from the existing brand rather than treating a new palette as a requirement.

**First screen:** headline and short explanation on the left; a large, readable comparison on the right. Example requirement: “Cable supply for a commercial fit-out.” Show Supplier A/B/C with consistent specification, quantity/unit, material cost, delivery cost, total and lead time. The whole panel must say **“Illustrative comparison — example prices, not live offers.”** No real supplier name, brand authorization or endorsement should be invented.

**Below:** four electrical material groups, three-step explanation, real operational proof, then focused FAQ and contact.

**Why it attracts:** a buyer can see the useful result before committing. It makes the unfamiliar service tangible and signals an organized, professional process.

**Tradeoff:** excessive miniature dashboard widgets would make the example decorative rather than understandable. Keep it to one requirement and a few decision-making fields.

**Mobile:** show one request summary and two compact offer cards, with a deliberate action to inspect the full comparison.

### 2. Materials Market

**Character:** warm white, dark green/teal, practical product photography, clear category tiles and visible location context.

**First screen:** explicit quotation positioning, a broad “What material do you need?” field, and prominent cards for **Cables & wires, Switchgear & breakers, Lighting, Conduits & trays**. These are plain-language groupings of existing local category definitions, not claims of available inventory.

**Below:** further electrical categories, a sample request, three steps and buyer support.

**Why it attracts:** familiarity and recognition. People who know their material can orient themselves quickly without learning the platform’s vocabulary.

**Tradeoff:** it can be mistaken for an online shop. Use “Request quotes” consistently, explain how prices are obtained, and avoid carts, stock badges or sale prices unless those are real capabilities.

**Mobile:** search stays easy to reach; tiles become a compact two-column grid with readable labels. Do not hide the service explanation behind a large search box.

### 3. Project Studio

**Character:** architectural editorial layout, sand and charcoal, restrained terracotta, generous space, large authentic site or installation photography.

**First screen:** a confident, plain headline beside an electrical installation or construction project photograph, with a compact requirement card. The image should reveal the actual sector, not just a generic skyline.

**Below:** project-oriented entry points such as commercial fit-out, villa wiring or warehouse lighting, grounded in supported templates; material groups; a clear comparison example; real company story and process.

**Why it attracts:** strongest premium impression. It frames Supply Souq as a considered project partner for contractors, engineers and procurement teams.

**Tradeoff:** photography and oversized type can hide the task. Keep both the explanation and primary action in the first screen. Do not imply complete project design, planning or BOQ extraction services without support.

**Mobile:** lead with copy and action, followed by a deliberately cropped image and one compact project card.

### 4. Guided Request

**Character:** calm blue and white, minimal navigation, clear progress, friendly field labels and short helper text.

**First screen:** a brief explanation above a small form: “What electrical materials does your project need?” Start with a material group and requirement description. Show that location and contact details come later. Manual entry is the supported basis; upload is not presented as available.

**Below:** an example of the resulting comparison, process explanation, reassurance and common questions.

**Why it attracts:** it reduces the size of the first decision and suits occasional purchasers who benefit from guidance.

**Tradeoff:** asking for input immediately can be premature. Retain enough context for a first-time visitor, show an example result nearby, and explain any later registration requirement before the buyer invests effort.

**Mobile:** one focused step at a time with persistent progress and a clear next action. Back navigation must preserve all answers.

### 5. Delivery Network

**Character:** dark navy or charcoal, a restrained amber accent, fine location lines, industrial material imagery and readable offer cards.

**First screen:** clear materials-and-quotes positioning, a conceptual UAE service-area illustration and a delivery destination summary. Compare each example offer’s delivery terms as well as its material price.

**Below:** electrical categories, supplier/location explanation, the request-to-comparison process and buyer support.

**Why it attracts:** a distinctive industrial identity, with practical attention to where materials are needed and when.

**Tradeoff:** maps, moving vehicles and dispatch graphics can imply live tracking, owned logistics or guaranteed coverage. Use a labelled conceptual illustration and confirmed service areas. This concept is strongest only if delivery coordination is a real differentiator.

**Mobile:** a simple destination card should replace any map that becomes too small or cluttered.

### Choosing among them

| If the main goal is… | Best starting concept |
|---|---|
| Understand the service immediately | **1. Quote Desk** |
| Find a familiar material quickly | **2. Materials Market** |
| Build a premium, project-oriented impression | **3. Project Studio** |
| Help an unfamiliar buyer begin a request | **4. Guided Request** |
| Emphasize supplier locality and delivery terms | **5. Delivery Network**, subject to actual operations |

Keep the same truthful headline, category scope and core actions in all five visual explorations. Judge them on comprehension, confidence and task success as well as appearance.

## Recommended information architecture

1. **Header:** Materials, How it works, For suppliers, Contact; one primary Request quotes action and a secondary sign-in link.
2. **Hero:** electrical materials, UAE relevance, quotation process, primary action and a clearly labelled comparison example.
3. **Material groups:** recognizable images and plain labels, connected to the actual catalog.
4. **Three steps:** describe requirements; review supplier offers; choose an offer and confirm the next steps. Avoid implying automatic payment, delivery or guarantees beyond the available workflow.
5. **Decision details:** how specifications, quantity, price units, delivery, tax presentation and lead time are compared. Any mock quotation amount is an example, not a current market price.
6. **Evidence and support:** real company details, contact methods, explained supplier checks and documented project examples if available.
7. **Supplier invitation:** a separate short proposition leading to supplier-specific information; do not make buyers choose a role before understanding the product.
8. **FAQ and footer:** coverage, quotation process, costs, delivery responsibilities, request commitment, company information and policies.

If Arabic is offered, make it a properly supported content and right-to-left experience. Do not add a language switch merely as decoration. Validate language priorities with actual buyers rather than assuming them from geography alone.

## Priorities before a full build

| Priority | Work | Definition of done |
|---|---|---|
| **P0: accuracy** | Review claims, simulated features, supplier status and example data. | No fabricated live telemetry, unlabeled sample prices, unsupported endorsements or simulated upload presented as working. |
| **P0: clarity** | Rewrite hero and action labels; bring the transaction example and three steps forward. | A new visitor can explain the material scope, service and next action without scrolling through a story. |
| **P1: findability** | Expose real material categories, understandable navigation and relevant search. | Buyers can find a category or start a requirement using their own terminology. |
| **P1: request completion** | Reduce visible form burden and preserve state; clarify account/contact expectations. | A buyer can complete a realistic manual request without confusion or lost input. |
| **P1: comparison** | Standardize specifications, quantities, units, delivery costs, totals and lead times. | Users can identify meaningful differences without confusing unit price and delivered total. |
| **P1: mobile/accessibility** | Reflow, touch size, contrast, keyboard/focus support and reduced motion. | Core journeys work on a phone and keyboard; essential content is never dependent on animation. |
| **P2: proof and differentiation** | Add permissioned project stories and measurable operational outcomes. | Every published result is attributable, current and clearly defined. |

## Validation plan

Choose two concepts for task-based testing with 6–8 people who resemble actual users: electrical contractors, procurement staff, site engineers and smaller project buyers. This is an initial qualitative round to find issues, not a statistically representative estimate of conversion.

Test mobile and desktop. Counterbalance which concept people see first. Ask for aesthetic preference after tasks so it does not replace evidence about understanding and use.

| Test | What to observe | Proposed initial target |
|---|---|---|
| Ten-second first impression | Ask what the company supplies, what service it provides and what the visitor would do next. | At least 80% explain all three. This is a team-set target, not an industry benchmark. |
| Find a material | Locate a suitable cable or lighting category and identify the relevant specifications. | High unassisted success; record first click, time and terminology mismatches. Establish a baseline before fixing a time target. |
| Start and finish a request | Use synthetic materials, quantities and contact data. | No critical blockers; record errors, abandonment points, account surprises and repeated entry. |
| Compare offers | Explain which example offer fits a delivery deadline and why its total differs. | Users distinguish specification, quantity/unit, delivery cost and lead time; they recognize that all shown prices are illustrative. |
| Assess trust | Ask what information is missing before they would share a requirement. | Repeated unanswered questions become content priorities; do not prompt people to praise the design. |
| Accessibility and speed | Check keyboard, focus, contrast, reflow and reduced motion; measure loading/interactivity/stability. | Address critical accessibility issues and pursue the stated Core Web Vitals targets. No current score is claimed here. |

After launch, track **qualified requests per relevant visit**, form completion and abandonment by step, search failures, quotation availability, mobile completion and repeat use. Instrument these with a clear definition of a qualified request. Do not promise a percentage uplift from this redesign without a valid baseline and sufficient comparison data.

## Decision for the next stage

Select a concept number, or identify a specific combination such as **Quote Desk’s clarity with Project Studio’s photography**. The next model should cover the homepage, materials entry, request flow and comparison experience on desktop and mobile. Any upload, audit, verification, notification or delivery feature requires its own functional validation before appearing as an available service.
