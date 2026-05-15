# CDC Premium Signature Generator — Implementation Plan

**Project:** CDC Premium Email Signature Generator (New)
**Path:** `D:\GitHub_signature_generator\cdc-premium-signature-prototype`
**Document version:** 1.0
**Date:** 2026-05-15
**Status:** Planning — not yet implemented

---

## 1. Project Scope

### 1.1 This Project

This is the **new** CDC premium email signature generator.

It is a separate project from the old production generator at
`D:\GitHub_signature_generator\cdc-signature-generator-2`.
The old generator must not be modified under any circumstances.

The new generator will allow any CDC employee to enter their personal details
and receive a ready-to-copy, brand-compliant corporate email signature.

**Phase 1 output:** Gmail Web / Gmail desktop signature only.

**Phase 2 output (planned, not implemented in Phase 1):** Apple Mail / iPhone signature.

### 1.2 Technical Approach

- Single-page static HTML/CSS/JS application.
- No server, no build tools, no framework required.
- Deployable on any static host or embedded in WordPress via iframe.
- The generated signature HTML is produced entirely in the browser.

### 1.3 What Is Out of Scope for Phase 1

- Apple Mail / iPhone signature generation (reserved for Phase 2)
- Centralized deployment via Google Workspace API (future Phase 9)
- AirBridge UAE / KSA variants (out of scope entirely)
- Any server-side logic

---

## 2. Approved Gmail Design Baseline

### 2.1 Source Files

| Role | File |
|---|---|
| **Approved Gmail template baseline** | `Prototypes/gmail-signature-tilda-assets.html` |
| Reference design baseline (GitHub Pages URLs) | `Prototypes/gmail-signature-github-pages-balanced-compact-logo-v3.html` |
| Long-name validation reference | `Prototypes/gmail-signature-long-name-stress-test.html` |

The generator's Gmail output template must reproduce the layout and visual system
from `Prototypes/gmail-signature-tilda-assets.html` exactly.
Do not introduce visual changes during generator implementation without explicit approval.

### 2.2 Approved Layout Specifications

| Element | Value |
|---|---|
| Total width | 580 px |
| Logo width | 104 px |
| Logo-to-identity spacer | 18 px |
| Identity column | 259 px |
| Vertical separator column | 1 px |
| Separator-to-award spacer | 14 px |
| Award banner width | 184 px |
| Column math | 104 + 18 + 259 + 1 + 14 + 184 = 580 px |
| Floating vertical divider | 64 px visible height / #eeeeee / vertically centered |
| Employee name | 21 px bold / #1a1a2e |
| Job title | 13 px regular / #555555 |
| Company display line | 13 px semibold / #F16623 |
| Contact icons | 24 × 24 px |
| Contact text | 13 px / #333333 |
| Contact row padding | 10 px top and bottom |
| Disclaimer | 10 px / line-height 1.45 / #666666 / left-aligned |
| Top row cell padding | 14 px top and bottom |

### 2.3 Fixed Content (Not Employee-Editable)

| Field | Fixed value |
|---|---|
| Visible company line | **Cableway Development Company** |
| Legal disclaimer company wording | **CDC Cableway Development Company and its affiliates** |
| Logo image | Fixed asset URL |
| Award banner image | Fixed asset URL |
| Brand orange | #F16623 (working value — confirm with brand team before production) |

---

## 3. Input Fields

### 3.1 Field List

**Use separate name fields. Do not use a single generic "Full name" field.**

#### Required fields

| Field | Type | Notes |
|---|---|---|
| First name | Text | Required |
| Last name | Text | Required |
| Job title | Text | Required |
| Phone | Text | Required — international format |
| Email | Text / email | Required — basic validation |
| Website | Text | Required — default `cdc.company` |

#### Optional fields

| Field | Type | Notes |
|---|---|---|
| Office address | Text | Optional — collapsed/hidden by default |
| Disclaimer text | Textarea | Advanced only — collapsed by default, see Section 8 |

#### Not required for Phase 1

- Middle name / additional name: may be considered in a later phase if requested,
  but is not required for Phase 1. The display name format is
  `First name + space + Last name`.

### 3.2 Generated Display Name

```
[First name] [Last name]
```

Example: `Anna Semenova`

---

## 4. Name Field UX and Validation

### 4.1 Field Behavior

- First name: required. Trim leading/trailing spaces. Prevent double internal spaces.
- Last name: required. Same trim rules.
- Do not allow email addresses or phone numbers inside name fields.
  (Detect `@` symbol or strings that look like phone numbers — reject with a validation message.)
- Preserve user capitalization in Phase 1.
  Optional auto-capitalization (first letter uppercase, rest as-entered) may be considered
  in a later iteration, but is not required now.
- Show a live display name preview updating as the user types.
- Helper text: *"Enter your name as it should appear in the corporate signature."*

### 4.2 Long Name Font Size Logic

The identity column is 259 px. At 21 px bold Arial, approximately 22–24 characters
fit on one line. Names longer than this wrap to two lines — which is acceptable but
should be flagged.

| Name character count | Behaviour |
|---|---|
| ≤ 22 characters | Standard 21 px. Fits on one line. No adjustment. |
| 23–30 characters | Reduce to 20 px, or allow controlled wrap. Flag in generator preview. |
| > 30 characters | Reduce to 19 px. Show a warning: *"This name may wrap to two lines in some email clients."* |

Additional constraints:
- Very long names must not overflow into the vertical divider or award block.
  `table-layout: fixed` on the 580 px table prevents column expansion, so text wraps
  within the identity cell only.
- Do not force `white-space: nowrap` on name text — this would cause overflow instead of wrapping.
- After wrap, the row height increases gracefully. The floating divider re-centers automatically.
  The award banner re-aligns via `valign="middle"`. Layout holds.

Reference: `Prototypes/gmail-signature-long-name-stress-test.html` — examples A–F.

---

## 5. Job Title Handling

- Job title is required.
- Trim leading/trailing spaces. Prevent double internal spaces.
- Preserve user capitalization.
- Display at 13 px regular / #555555.
- The identity column is 259 px. At 13 px regular Arial, approximately 32–36 characters
  fit per line.

| Title character count | Behaviour |
|---|---|
| ≤ 32 characters | Fits one line. No adjustment. |
| 33–42 characters | Wraps to 2 lines. Acceptable — flag in preview. |
| > 42 characters | Reduce title to 12 px, or show warning. Flag as *"Very long title — consider abbreviating."* |

Long titles must not break the 580 px layout.
The identity cell is fixed-width — text wraps; the column does not expand.

---

## 6. Contact Fields

### 6.1 Phone

- Required.
- Preserve the international format as entered by the user.
  Do not auto-format or reformat the displayed phone number.
- Trim leading/trailing spaces.
- The `tel:` href link should contain digits and `+` only — strip spaces and non-digit
  characters (except leading `+`) when building the `tel:` link.
- Example display: `+971 50 421 35 70`
- Example `tel:` link: `tel:+971504213570`
- Use non-breaking spaces (`&nbsp;`) inside the displayed phone number to prevent awkward
  line-breaks within the contact row.

### 6.2 Email

- Required.
- Basic validation: must contain `@`, must have characters before and after `@`, and after
  the last `.`.
- Used as the `mailto:` link href and as the displayed email address text.
- Trim spaces.

### 6.3 Website

- Required for Phase 1.
- Default value: `cdc.company`.
- The display value in the signature (visible text) is the URL without protocol,
  e.g. `cdc.company`.
- The `href` should use `https://` — if the user enters a URL without protocol,
  prepend `https://` when building the link.
- Example: user enters `cdc.company` → link href becomes `https://cdc.company`.

**Open decision:** Whether the website field should be fixed to `cdc.company` for all
employees, or editable. Default recommendation: editable with `cdc.company` pre-filled,
since some roles or departments may have a different relevant URL.

---

## 7. Optional Office Address Field

### 7.1 Behavior

- The generator includes an optional **Office address** field.
- The field is **empty by default**.
- If empty: no address line is rendered in the signature.
- If filled: the address is rendered as a small secondary line in the signature,
  positioned below the main contact row (phone / email / website).

### 7.2 Placement Rules

- The address must **not** be placed in the main identity block
  (alongside name, title, and company line).
- The address must **not** be placed inside the legal disclaimer block.
- The address should **not** use an icon in Phase 1, to avoid overcrowding the contact row.

### 7.3 Visual Style

| Property | Value |
|---|---|
| Font size | 10.5–11 px |
| Color | #666666 or #777777 |
| Line-height | 1.35 |
| Alignment | Left |
| Weight | Regular |

The address line is visually secondary — quieter than the contact row text (13 px / #333333).

### 7.4 Layout Impact

Adding an address line increases the signature height slightly.
This is acceptable only when a business need exists.
The default signature without address remains the standard compact version.

### 7.5 Validation and UX

- Helper text: *"Use only an approved public office address. Do not enter personal
  residential addresses."*
- Trim leading/trailing spaces.
- Allow common address characters: letters, digits, commas, hyphens, periods, slashes,
  parentheses.
- Warn if the address is very long (suggest keeping it under ~80 characters).
- Do not render the address line if the field is empty or whitespace-only.

---

## 8. Disclaimer Behavior

### 8.1 UI Approach

The disclaimer is an **advanced / exception field**, not a regular employee customization.

- **Collapsed by default** — not visible to the employee unless expanded.
- Reveal control: a button labelled **"Disclaimer"** or **"Show / Edit disclaimer"**
  expands the disclaimer section.
- Field type: `<textarea>`, pre-filled with the standard disclaimer text.
- A prominent warning must appear adjacent to the field:
  *"Disclaimer changes require Legal / Management approval. Do not modify for standard use."*
- A **"Reset to default disclaimer"** button restores the standard text if modified.
- For normal employees: the standard disclaimer should remain unchanged.

### 8.2 Production Approval Status

The default disclaimer text is not considered finally production-approved until
Legal / Management provides written confirmation.

### 8.3 Default Disclaimer Text

```
This email and any files transmitted with it may contain information that is proprietary
and confidential to CDC Cableway Development Company and its affiliates and is intended
solely for the use of the individual or entity to whom it is addressed. If you have
received this email in error, please return it to the sender by replying to it, then
permanently delete it from your system. Any disclosure, use, copying, or distribution
of the information contained in this email by anyone other than the named addressee is
strictly prohibited. Any views or opinions expressed in this email are solely those of
the author and do not necessarily represent those of CDC Cableway Development Company
and its affiliates. No employee, contractor, or agent is authorized to conclude any
binding agreement on behalf of CDC Cableway Development Company and its affiliates
by email.
```

---

## 9. Asset URL Strategy

### 9.1 Current Temporary Hosting

**Tilda CDN** — used in `Prototypes/gmail-signature-tilda-assets.html`:

| Asset | Tilda CDN URL |
|---|---|
| Logo | `https://static.tildacdn.com/tild6633-3962-4537-b532-383239613561/logo-cdc-badge.png` |
| Award banner | `https://static.tildacdn.com/tild3065-3964-4339-b466-326436663935/award-banner.png` |
| Phone icon | `https://static.tildacdn.com/tild3830-6235-4634-b839-666338353131/icon-phone.png` |
| Email icon | `https://static.tildacdn.com/tild6464-6630-4135-a161-363032613664/icon-email.png` |
| Web icon | `https://static.tildacdn.com/tild3433-6265-4665-b766-326237343934/icon-web.png` |

Tilda is a **temporary / transition** hosting step only.

### 9.2 Generator Asset Config Rules

- Asset base URLs must be **configurable** — stored in a single config object at the
  top of `js/config.js`, not scattered throughout template code.
- Switching from Tilda to production hosting must require changing only the config,
  not hunting through template strings.
- Do not hard-code GitHub Pages as the only asset source.

### 9.3 Production Hosting Requirements

- All images in generated signatures must be served from **public HTTPS URLs**.
- No local `file://` paths in production signatures.
- No base64-encoded images (Gmail strips them; they also bloat the signature past the
  10,000-character limit).
- Production hosting should be **company-controlled** — preferably a stable subdomain
  such as `https://assets.cdc.company/signature/` or the corporate WordPress media library.
- URLs must be permanent — if assets are updated, use versioned filenames
  (e.g., `award-banner-2026.png`) rather than overwriting in place.

### 9.4 Icon Format

- PNG icons are required for Gmail compatibility.
- SVG source files (`Assets/icon-*.svg`) remain the master format.
- The generator outputs PNG `<img>` tags, never inline `<svg>`.

---

## 10. Output Strategy

### 10.1 Phase 1 Output — Gmail Web / Gmail Desktop

The generator produces Gmail-compatible signature HTML with the following constraints:

| Requirement | Detail |
|---|---|
| Layout | Table-based HTML only |
| CSS | Inline on every element — no `<style>` blocks in the signature |
| Fonts | `Arial, Helvetica, sans-serif` only — no web fonts |
| Images | External HTTPS URLs only — no local paths, no base64 |
| Width | Fixed 580 px via `table-layout: fixed` and explicit column widths |
| bgcolor | HTML `bgcolor` attribute on all cells in addition to inline CSS |

### 10.2 What the Output Must NOT Contain

- External CSS linked from the signature
- Web fonts (`@font-face`, Google Fonts, etc.)
- `<script>` tags or JavaScript inside the signature
- `<style>` blocks inside the signature (Gmail strips them)
- Local image paths
- Base64 image data
- `<svg>` inline elements (Gmail strips or inconsistently renders them)

### 10.3 Copy Mechanism

The copy button must copy the signature as **rich formatted HTML**, not plain text.
If the clipboard receives plain text, Gmail will display raw HTML tags instead of a
rendered signature.

**Recommended primary method** (requires HTTPS):
```js
async function copyAsRichText(html) {
  const blob = new Blob([html], { type: 'text/html' });
  const item = new ClipboardItem({ 'text/html': blob });
  await navigator.clipboard.write([item]);
}
```

**Fallback method** (works without HTTPS, but deprecated):
```js
function copyAsRichTextFallback(html) {
  const container = document.createElement('div');
  container.innerHTML = html;
  container.style.cssText = 'position:fixed;pointer-events:none;opacity:0;';
  document.body.appendChild(container);
  const range = document.createRange();
  range.selectNodeContents(container);
  const sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);
  document.execCommand('copy');
  sel.removeAllRanges();
  document.body.removeChild(container);
}
```

Use the modern method with a fallback to `execCommand`. If both fail, display the
raw HTML in a visible `<textarea>` with the instruction:
*"Automatic copy failed. Select all text below and copy manually (Ctrl+C / Cmd+C)."*

### 10.4 Copy Button UX

- Button label: **"Copy Gmail Signature"**
- On success: label changes to **"✓ Copied!"** for 2 seconds, then reverts.
- No modal, no alert, no page reload.
- The copy action must capture only the inner signature `<table>`, not the preview
  wrapper div or any surrounding chrome.

---

## 11. Apple Mail / iPhone Support

### 11.1 Architecture Decision

The generator must be **architecturally designed** to support multiple output formats
from the start, even though only the Gmail version is implemented in Phase 1.

**Planned output formats:**

| Format | Phase | Status |
|---|---|---|
| Gmail Web / Gmail desktop | Phase 1 | Implement now |
| Apple Mail / iPhone | Phase 2 | Reserved — do not implement yet |

### 11.2 Why Apple Mail Needs Its Own Template

Apple Mail / iPhone has fundamentally different rendering characteristics:

- Supports `<style>` blocks (Gmail strips them)
- Requires `-webkit-text-size-adjust: 100%` to prevent iOS font auto-scaling
- Supports `@media` queries for responsive layout (Gmail does not)
- The copy-paste install flow on iPhone is different from Gmail (iPhone Settings → Mail)
- Dark mode behavior on iOS Mail differs from Gmail Web

The Apple Mail version is **not a minor variation of Gmail HTML** — it requires its
own adapted template. Do not reuse Gmail template code for Apple Mail output without
deliberate adaptation.

### 11.3 Phase 1 UI Reservation

- The generator UI should reserve space for a future Apple Mail / iPhone output option.
- Recommended approach in Phase 1: show the Apple Mail button or tab as **visually
  disabled** with a label such as *"Apple Mail / iPhone — coming soon"*.
- Do not make the Gmail output HTML depend on Apple Mail constraints.

---

## 12. Generator UI Plan

### 12.1 Layout

```
┌─────────────────────────────────────────────────────────────────────┐
│  [Form — left panel]          [Live preview — right panel]          │
│                                                                     │
│  First name _____________     ┌─────────────────────────────────┐  │
│  Last name  _____________     │  [Signature preview — updates   │  │
│                               │   live as user types]           │  │
│  Job title  _____________     │                                 │  │
│                               └─────────────────────────────────┘  │
│  Phone      _____________                                           │
│  Email      _____________     [ Copy Gmail Signature         ]      │
│  Website    _____________     [ Apple Mail / iPhone (planned) ]     │
│                               [ Reset form                   ]      │
│  + Office address (optional)                                        │
│  ▼ Disclaimer (advanced)                                            │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 12.2 Action Buttons

| Button | Phase | Behavior |
|---|---|---|
| Copy Gmail Signature | Phase 1 | Copies signature HTML as rich text |
| Apple Mail / iPhone | Phase 2 | Disabled / "coming soon" in Phase 1 |
| Reset form | Phase 1 | Clears all fields, restores defaults |
| Disclaimer / Show Edit Disclaimer | Phase 1 | Expands disclaimer textarea |
| Reset disclaimer to default | Phase 1 | Restores standard disclaimer text |

### 12.3 Preview Panel

- The preview panel renders a live visual representation of the signature, updating
  as the user types.
- The preview should show only the signature, not any surrounding chrome or form elements.
- The copy action copies only the inner signature `<table>` — not the preview wrapper.

---

## 13. Recommended File Structure

**Do not create these files yet.** This is the target structure for Phase 1 implementation.

```
cdc-premium-signature-prototype/
│
├── index.html                          ← generator UI (Phase 1 build — not yet)
│
├── css/
│   └── generator-ui.css               ← generator page styles only (not signature styles)
│
├── js/
│   ├── config.js                       ← asset URLs, fixed content, brand config
│   ├── generator.js                    ← main orchestration: reads fields, renders preview, triggers copy
│   ├── validation.js                   ← field validation: name length, email format, phone, title length
│   └── templates/
│       ├── gmail-template.js           ← Gmail HTML template function (Phase 1)
│       └── apple-mail-template.js      ← Apple Mail template (Phase 2 — reserved, not built yet)
│
├── Docs/
│   ├── premium-signature-architecture.md
│   └── generator-implementation-plan.md  ← this document
│
├── Prototypes/
│   ├── gmail-signature-tilda-assets.html              ← approved Gmail template baseline
│   ├── gmail-signature-github-pages-balanced-compact-logo-v3.html  ← reference v3
│   └── gmail-signature-long-name-stress-test.html     ← long-name validation
│
├── Assets/
│   └── [SVG source files, PNGs — do not modify]
│
└── public/
    └── signature-assets/
        └── [PNG files for GitHub Pages hosting — do not modify]
```

### 13.1 config.js Responsibilities

The config file holds all values that may change without touching template logic:

```js
const CDC_CONFIG = {
  assetBaseUrl: 'https://static.tildacdn.com', // update when moving to production hosting
  assets: {
    logo:   '…/logo-cdc-badge.png',
    award:  '…/award-banner.png',
    phone:  '…/icon-phone.png',
    email:  '…/icon-email.png',
    web:    '…/icon-web.png',
  },
  brand: {
    companyDisplay:  'Cableway Development Company',
    companyLegal:    'CDC Cableway Development Company and its affiliates',
    orange:          '#F16623',
    websiteDefault:  'cdc.company',
  },
  disclaimer: {
    default: '…full disclaimer text…',
  },
  layout: {
    totalWidth:   580,
    logoWidth:    104,
    awardWidth:   184,
    // …other dimensions
  },
};
```

---

## 14. Risks and Open Decisions

| Item | Risk / Decision | Status |
|---|---|---|
| Tilda CDN dependency | Tilda is temporary hosting — Tilda account must remain active during test period. Replace with company hosting before production. | Open |
| Production asset hosting | Final production URL (e.g., `assets.cdc.company/signature/`) not yet confirmed. | Open |
| Legal disclaimer approval | Default disclaimer text has not been formally approved by Legal / Management. Do not treat as production-approved until confirmed. | Open |
| Brand orange confirmation | Working value `#F16623` is unconfirmed. Must be verified against official brand materials before production. | Open |
| Long name visual validation | Long-name handling rules (font size reduction thresholds) are based on browser estimates. Final thresholds should be validated in the built generator with real data. | Open |
| Website field | Decision needed: fixed `cdc.company` for all employees, or editable with default? Recommendation: editable with `cdc.company` pre-filled. | Open |
| Apple Mail / iPhone behavior | Requires separate testing on real devices — not covered by Phase 1. | Phase 2 |
| Address field placement | Must be placed below the contact row, not in identity or disclaimer blocks. Final exact HTML position to be confirmed during build. | Phase 1 build |
| FT / Statista legal rights | Company must confirm in writing that email signature use of award imagery is permitted under their award kit license. | Open |

---

## 15. Next Steps

1. **Review and approve this implementation plan.**
   Confirm field list, UX decisions, and asset URL strategy before any code is written.

2. **Build Gmail generator MVP only.**
   Implement `index.html`, `js/config.js`, `js/templates/gmail-template.js`,
   `js/generator.js`, `js/validation.js`, and `css/generator-ui.css`.
   Use `Prototypes/gmail-signature-tilda-assets.html` as the visual/template baseline.

3. **Test generated Gmail signature in Gmail Web.**
   Paste generated signature into Gmail Settings → Signature.
   Verify: images load, layout renders correctly, all links work, disclaimer appears.

4. **Test sent/received email rendering.**
   Send test emails to Gmail, Outlook, and Apple Mail accounts.
   Verify images load for recipients.

5. **Only after Gmail stable: design Apple Mail / iPhone version.**
   Adapt the Gmail template for Apple Mail — add `<style>` block,
   `-webkit-text-size-adjust`, and `@media` responsive rules.
   Test copy-paste install flow on iPhone.

6. **Replace Tilda URLs with company-controlled production hosting.**
   Update `config.js` asset URLs. Re-test in Gmail after URL change.

7. **Legal / Management sign-off.**
   Confirm disclaimer text, brand orange value, and FT/Statista usage rights
   before company-wide rollout.

---

*End of document — Version 1.0 — 2026-05-15*
