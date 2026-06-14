# Feature Specification: DriveMind — Conversational Car-Recommendation Assistant

**Feature Branch**: `001-drivemind`

**Created**: 2026-06-11

**Status**: Draft

**Input**: User description: "Build DriveMind — an AI car-recommendation assistant that car dealers add to their websites so visitors can find the right used car through natural conversation. The system is made of three separate but connected applications."

## Overview

DriveMind helps used-car shoppers find the right vehicle by describing their needs in plain
language instead of operating filters. It is delivered as three separate but connected applications:

- **Dealer Website (NextGear Motors)** — a realistic used-car dealership site where visitors browse
  inventory and where the DriveMind assistant ("Otto") appears as a launchable chat widget. The
  dealer's inventory is this site's own source of truth, retrievable by the DriveMind platform
  through a protected interface.
- **Admin Dashboard** — a control panel where a dealer connects their inventory source, triggers a
  Sync that pulls and enriches every car into the assistant's knowledge base tagged to that dealer,
  and views sync progress and what has been ingested.
- **Chatbot Assistant** — the runtime that powers Otto: it interprets a visitor's natural-language
  request (hard constraints and fuzzy intent), finds the most relevant cars from only that dealer's
  synced inventory, and returns a short friendly reply plus up to five recommended cars, each with a
  one-line reason, along with suggested follow-up prompts.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Shopper finds cars by describing needs in plain language (Priority: P1)

A visitor on the dealer website opens the Otto chat widget and types what they want in everyday
language — a precise request like "an SUV under $25,000" or a fuzzy one like "a fun weekend car" or
"something reliable for a young family". Otto replies with a short, friendly message and a list of up
to five real, in-stock cars from that dealer's inventory, each accompanied by a one-line reason it
was chosen.

**Why this priority**: This is the core value of the entire product — turning vague human intent into
relevant, real recommendations. Without it, nothing else matters. It is the primary reason a dealer
would add DriveMind and the primary reason a shopper would engage.

**Independent Test**: With a dealer's inventory already synced, open Otto, submit both a precise and a
fuzzy request, and confirm each returns a friendly reply plus ≤5 in-stock cars with per-car reasons,
and that every recommended car exists in that dealer's inventory.

**Acceptance Scenarios**:

1. **Given** a dealer with synced inventory, **When** a shopper asks "I need an SUV under $25,000",
   **Then** Otto returns a friendly reply and up to five SUVs priced under $25,000 that are in that
   dealer's inventory, each with a one-line reason.
2. **Given** a dealer with synced inventory, **When** a shopper asks "a fun weekend car", **Then**
   Otto returns up to five relevant in-stock cars (e.g., sporty/convertible/coupe styles) each with a
   reason explaining the fit, without requiring the shopper to name a body type or price.
3. **Given** a request that matches no inventory (e.g., "an electric pickup under $5,000" with none in
   stock), **When** the shopper submits it, **Then** Otto responds honestly that nothing matches and
   suggests adjusting the request, recommending zero fabricated cars.
4. **Given** an off-topic request ("what's the weather?" or "write me a poem"), **When** the shopper
   submits it, **Then** Otto politely declines and steers the conversation back to choosing a car.

---

### User Story 2 - Dealer connects and syncs inventory in one action (Priority: P2)

A dealer opens the Admin Dashboard, provides the location and access credential for their inventory
source, and triggers a Sync. The system pulls every available car, enriches each with a plain-language
description of who/what it is best for, and stores it in the assistant's knowledge base tagged to that
dealer. The dashboard shows progress and a count of how many cars are now searchable.

**Why this priority**: Recommendations (P1) are only possible once a dealer's real inventory is in the
knowledge base. This is the onboarding path that makes the assistant useful for a given dealer, and it
is the dealer-facing half of the product.

**Independent Test**: In the Admin Dashboard, enter a valid inventory location and credential, trigger
Sync, and confirm progress is shown, every available car becomes searchable (count matches the source),
each ingested car carries an enrichment describing its best use, and all cars are tagged to that dealer.

**Acceptance Scenarios**:

1. **Given** a dealer on the dashboard with a valid inventory location and credential, **When** they
   trigger Sync, **Then** the system pulls all available cars, enriches each, stores them tagged to
   that dealer, shows progress while running, and displays a final searchable-car count matching the
   source inventory.
2. **Given** an invalid or unreachable inventory location/credential, **When** the dealer triggers
   Sync, **Then** the system reports a clear failure without partially corrupting the knowledge base
   or recommending the dealer's cars in an inconsistent state.
3. **Given** a completed sync, **When** the dealer views the ingested inventory, **Then** they can see
   the list of cars now searchable by the assistant.

---

### User Story 3 - Shopper clicks a recommendation through to the car's detail page (Priority: P3)

After Otto returns recommended cars as clickable cards, the shopper clicks a card and is taken to that
car's full detail page on the dealer website (price, year, mileage, specs, images).

**Why this priority**: It converts a recommendation into a real next step on the dealer's site
(engagement/lead), closing the loop from intent to action. It depends on P1 producing recommendations.

**Independent Test**: From a set of Otto recommendations, click any car card and confirm it navigates
to the correct car's detail page on the dealer site showing that car's full information.

**Acceptance Scenarios**:

1. **Given** Otto has returned recommended car cards, **When** the shopper clicks a card, **Then** the
   dealer site opens that exact car's detail page with its price, year, mileage, specs, and images.
2. **Given** a recommended car card, **When** it is displayed, **Then** it shows enough summary
   information (e.g., make/model, price, key attributes, the one-line reason) for the shopper to
   decide whether to click through.

---

### User Story 4 - Dealer re-syncs to keep inventory current without duplicates (Priority: P4)

A dealer whose inventory has changed (sold cars, new arrivals, price updates) triggers Sync again.
The system updates existing cars and adds new ones rather than creating duplicates, keeping the
assistant's recommendations current.

**Why this priority**: Inventory changes constantly; without idempotent re-sync the knowledge base
drifts from reality and the assistant would recommend stale or duplicated cars. It builds on P2.

**Independent Test**: Sync a dealer's inventory, change the source (add, remove, and edit cars),
re-sync, and confirm the knowledge base reflects the new state with no duplicate entries for the same
car and an updated searchable-car count.

**Acceptance Scenarios**:

1. **Given** a dealer who has already synced, **When** they re-sync after price/spec changes, **Then**
   the existing cars are updated in place (no duplicate entries) and the changes are reflected in
   subsequent recommendations.
2. **Given** a re-sync where some cars are new and some no longer exist in the source, **When** the
   sync completes, **Then** new cars become searchable and the searchable-car count reflects the
   current source inventory.

---

### User Story 5 - Shopper gets fast, streaming, guided responses (Priority: P5)

When a shopper sends a message, Otto acknowledges it immediately and the reply appears progressively
(streaming) rather than after a long blank wait. Otto also offers suggested follow-up prompts the
shopper can tap to continue the conversation.

**Why this priority**: It makes the experience feel responsive and easy, improving completion and
engagement. It is a quality layer on top of the core recommendation flow (P1) rather than a
prerequisite for it.

**Independent Test**: Send a message in Otto and confirm the message and a typing/acknowledgement
indicator appear instantly, the reply renders progressively, and tappable suggested follow-up prompts
are offered after a reply.

**Acceptance Scenarios**:

1. **Given** Otto is open, **When** the shopper sends a message, **Then** their message and an
   immediate acknowledgement (e.g., typing indicator) appear without a perceptible delay.
2. **Given** Otto is composing a reply, **When** the response is being produced, **Then** it appears
   progressively rather than only after the full answer is ready.
3. **Given** Otto has replied, **When** the reply is shown, **Then** the shopper is offered relevant
   tappable follow-up suggestions that continue the car-finding conversation.

---

### Edge Cases

- **No matches**: A request matches no in-stock car → Otto says so honestly and suggests adjusting the
  request; it never invents a car.
- **Off-topic / abuse**: Non-car requests or attempts to make Otto act outside its purpose → Otto
  politely declines and redirects to car finding; user input never changes Otto's behavior or surfaces
  information the shopper shouldn't see.
- **Partial/ambiguous request**: "Something nice" with no other signal → Otto asks a brief clarifying
  question and/or offers suggestion chips rather than dumping the whole inventory.
- **Conflicting constraints**: "A 7-seat sports car under $10,000" with no match → Otto explains the
  conflict and offers the closest available alternatives or a way to relax a constraint.
- **Empty inventory / unsynced dealer**: Otto is opened for a dealer with no synced inventory → Otto
  responds gracefully (e.g., explains it can't find cars yet) instead of erroring or recommending
  another dealer's cars.
- **Sync interrupted**: A sync stops partway (timeout, source error) → the system can resume/retry and
  does not leave the knowledge base with duplicates or half-written cars.
- **Source temporarily unavailable**: The inventory source or knowledge base is temporarily
  unreachable → the dealer/shopper sees a clear, graceful state rather than a crash.
- **Recommendation that no longer exists**: A car was retrieved but is no longer in inventory at reply
  time → it is not shown; only currently-existing cars reach the shopper.
- **Cross-dealer isolation**: A shopper on dealer A's site must only ever see dealer A's cars, never
  another dealer's inventory.

## Requirements *(mandatory)*

### Functional Requirements

**Shopper conversation & recommendations**

- **FR-001**: The assistant MUST accept a visitor's request in natural language and interpret both
  hard constraints (e.g., budget, body type, mileage, year) and fuzzy intent (e.g., "comfortable",
  "fun", "good for a young family").
- **FR-002**: The assistant MUST return a short, friendly natural-language reply together with up to
  five recommended cars.
- **FR-003**: Each recommended car MUST include a one-line reason explaining why it fits the request.
- **FR-004**: The assistant MUST only recommend cars that actually exist in the requesting dealer's
  synced inventory at reply time; it MUST NOT invent, fabricate, or recommend cars absent from that
  inventory.
- **FR-005**: The assistant MUST scope all recommendations to the single dealer whose site the shopper
  is on, never returning another dealer's cars.
- **FR-006**: When no in-stock car matches, the assistant MUST say so honestly and suggest adjusting
  the request rather than returning unrelated or fabricated cars.
- **FR-007**: The assistant MUST stay on the topic of helping choose a car and MUST politely decline
  off-topic requests, redirecting to car finding.
- **FR-008**: The assistant MUST offer suggested follow-up prompts to guide the conversation.
- **FR-009**: Recommendations MUST be presented as clickable car cards (not raw text), each linking to
  that car's detail page on the dealer website.
- **FR-010**: The assistant MUST treat all visitor input as untrusted: visitor text MUST NOT be able
  to change the assistant's instructions or cause it to reveal information the shopper should not see.

**Dealer website**

- **FR-011**: The dealer website MUST let visitors browse inventory with a listing view and a per-car
  detail view showing price, year, mileage, specs, and images.
- **FR-012**: The dealer website MUST present the Otto assistant as a launchable widget that a visitor
  can open and converse with.
- **FR-013**: The Otto widget MUST coexist on the dealer site without interfering with the host site's
  appearance or behavior.
- **FR-014**: The dealer website MUST expose its inventory to the DriveMind platform through a
  protected interface that requires a valid access credential.
- **FR-015**: Clicking a recommended car card MUST navigate the shopper to that exact car's detail
  page on the dealer website.

**Admin dashboard & sync**

- **FR-016**: The Admin Dashboard MUST let a dealer provide the location and access credential of their
  inventory source.
- **FR-017**: The dealer MUST be able to trigger a Sync as a single action that ingests their full
  inventory.
- **FR-018**: During sync, the system MUST pull every available car from the source.
- **FR-019**: For each car, the system MUST generate and store a plain-language enrichment describing
  who/what the car is best for, used to support need-based matching.
- **FR-020**: Each ingested car MUST be stored tagged to the dealer it belongs to.
- **FR-021**: Re-syncing MUST update existing cars in place and add new ones without creating
  duplicates of the same car, and MUST reflect cars that no longer exist in the source.
- **FR-022**: The dashboard MUST show sync progress while a sync runs and a count of how many cars are
  searchable when it completes.
- **FR-023**: The dashboard MUST let the dealer view what has been ingested (the list of searchable
  cars).
- **FR-024**: A failed or interrupted sync MUST be reported clearly and MUST NOT leave the knowledge
  base with duplicates, partial cars, or an inconsistent dealer state.

**Responsiveness**

- **FR-025**: When a shopper sends a message, the system MUST immediately show the shopper's message
  and an acknowledgement (e.g., typing indicator) before the full reply is ready.
- **FR-026**: The assistant's reply MUST be delivered progressively (streaming) rather than only after
  the entire answer is complete.

### Key Entities *(include if feature involves data)*

- **Dealer**: A car dealership using DriveMind. Owns an inventory source (location + access
  credential) and is the tag/scope for all its cars in the knowledge base. Identified by a stable
  dealer identifier shared consistently across the three applications.
- **Car (inventory listing)**: A used vehicle offered by a dealer. Key shopper-facing attributes:
  make/model, year, price, mileage, body type, specifications, images, and a link/identity that
  resolves to its detail page on the dealer site. Has a stable per-car identity used to match,
  recommend, and de-duplicate across syncs.
- **Car enrichment**: A plain-language description of who/what a car is best for, derived once per car
  during sync and stored alongside the car to support need-based and fuzzy matching.
- **Sync job**: A dealer-initiated operation that ingests/refreshes a dealer's inventory; has a
  progress state and a resulting searchable-car count, and is safely repeatable (idempotent per car).
- **Conversation / message**: A shopper's exchange with Otto on a dealer's site — the visitor's
  request, Otto's reply, the recommended cars (by identity), and the suggested follow-up prompts.
- **Recommendation**: A car selected for a given request, paired with the one-line reason it fits;
  always references a car that exists in the dealer's current inventory.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: For a precise request ("SUV under $25,000"), at least 90% of returned cars satisfy the
  stated hard constraints (body type and price) and are in the dealer's current inventory.
- **SC-002**: For a fuzzy request ("a fun weekend car"), shoppers rate the relevance of returned cars
  as fitting the intent in at least 80% of test cases.
- **SC-003**: 100% of recommended cars exist in the requesting dealer's current inventory — zero
  fabricated or out-of-inventory cars across the recommendation test suite.
- **SC-004**: 100% of recommendations are scoped to the correct dealer — a shopper never receives
  another dealer's cars.
- **SC-005**: A dealer can go from entering their inventory source to a working, queryable assistant in
  a single Sync action, with the final searchable-car count matching the source inventory.
- **SC-006**: After re-sync, the knowledge base contains zero duplicate entries for the same car and
  reflects added, updated, and removed cars from the source.
- **SC-007**: At least 95% of off-topic requests are declined politely and redirected to car finding,
  with no off-topic content produced.
- **SC-008**: A shopper sees their message and an acknowledgement within 1 second of sending, and reply
  content begins appearing progressively rather than after a long blank wait.
- **SC-009**: Every recommendation links to the correct car's detail page (100% of clicked cards
  resolve to the intended car).
- **SC-010**: No recommendation ever exposes information a shopper should not see (only customer-facing
  car attributes appear).

## Assumptions

- **No authentication in scope**: End-user and dealer login/authentication are explicitly out of
  scope; the dealer's identity in the Admin Dashboard and the access credential for the inventory
  source are assumed handled outside this feature (e.g., a provided credential), and shoppers are
  anonymous visitors.
- **Multi-dealer design even in a demo**: The product is a demo, but cross-dealer isolation (FR-005,
  SC-004) is treated as a real requirement so the architecture mirrors production.
- **Inventory source is the dealer site's own data**: NextGear Motors' inventory is the source of
  truth; DriveMind never edits the dealer's inventory, only reads it through the protected interface.
- **Recommendation cap**: "Short list" means up to five cars per reply (per the product description).
- **Out of scope (deferred)**: payments, test-drive booking, multi-language support, and analytics are
  not included.
- **Images and detail pages already exist on the dealer site**: car cards link to existing detail
  pages rather than DriveMind hosting car media.
- **Enrichment happens at sync time, not per query**: the plain-language "best for" description is
  produced once during ingestion and reused for matching, so live queries do not re-derive it.
- **Reasonable conversational behavior**: when a request is too vague to match, Otto asks a brief
  clarifying question or offers suggestion chips rather than returning the full inventory.
