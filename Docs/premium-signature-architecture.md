# CDC Premium Signature Generator — Technical Architecture

**Project:** CDC Premium Email Signature Generator (Prototype)
**Path:** `D:\GitHub_signature_generator\cdc-premium-signature-prototype`
**Document version:** 1.6
**Date:** 2026-05-15
**Status:** Architecture / Pre-implementation

---

## 1. Executive Summary

The CDC Premium Email Signature Generator is a single-page static HTML/JS tool that lets
any CDC employee enter their personal details and copy a ready-to-use, brand-compliant
corporate email signature. It produces two separate signature outputs:

1. **Gmail version** — table-based, 100% inline CSS, for Gmail Web and Gmail mobile app.
2. **Apple Mail / iPhone version** — same visual brand, adapted for iOS Mail quirks,
   with a `<style>` block and responsive stacking on small screens.

The generator requires no server, no build tools, and no framework. It is a single
`index.html` file deployable on any static host and embeddable in WordPress via iframe.

The signature visual direction follows the reference image (`premium-signature-reference.jpg`),
which is achievable at 90–95% fidelity in Gmail desktop and 80–85% in Gmail mobile /
Apple Mail iPhone. The primary technical constraints are:

- Gmail strips `<style>` blocks and base64 images — everything must be inline CSS +
  external HTTPS image URLs.
- iOS Mail enforces a minimum font size unless explicitly suppressed.
- The two-column layout (identity + award block) is achievable in email-safe table HTML
  and will survive Gmail and Apple Mail rendering.

This document records all confirmed decisions, defines the required asset set, and
specifies the layout plan for both signature versions before any code is written.

---

## 2. Confirmed Decisions

| # | Topic | Decision |
|---|---|---|
| 1 | FT / Statista logos | Use the existing `award-banner.png` which already contains both FT and Statista branding. Legal assumption: CDC has rights to this image. Verify before production rollout. |
| 2 | Award block | Mandatory for all CDC employees. On by default. May be toggled off in future. |
| 3 | Image hosting | Prototype: local asset paths (relative). Production: permanent HTTPS URLs on company-controlled infrastructure. |
| 4 | Brand orange | Approximate working value: `#F16623`. Must be confirmed from official brand materials before production. |
| 5 | Company name (display) | **Cableway Development Company** — shown in the identity block in brand orange. No "CDC" prefix: the badge logo already represents CDC visually; repeating it creates unnecessary duplication. Locked, not editable by employees. |
| 5a | Company name (legal) | **CDC Cableway Development Company and its affiliates** — used only in the legal disclaimer. Full legal entity name is appropriate there. |
| 6 | AirBridge UAE / KSA | Out of scope for this project. Do not design or build. |
| 7 | Central deployment | Future consideration (Phase 9). First version is always manual copy-paste. |
| 8 | Fonts (email) | Email-safe fallback fonts only. No web fonts in generated signature HTML. |
| 9 | Fonts (generator UI) | Corporate font may be used in the generator page UI if license permits web use. Files to be provided later. |
| 10 | Icons | Custom-designed SVG source → exported PNG for production. No third-party icon packs. |
| 11 | Icon SVG source files | `Assets/icon-phone.svg`, `Assets/icon-email.svg`, `Assets/icon-web.svg` — v1 outline style, approved. PNG export is a production step, not a prototype dependency. |
| 12 | CDC logo files | Two confirmed logo assets: (a) `logo-cdc-badge.png` — badge-only mark, used in the premium signature; (b) `logo-cdc-wordmark.png` — full wordmark with "Cableway Development Company" text, stored as backup brand asset only. The premium signature always uses the badge-only file. |

---

## 3. Reference Image Analysis

### 3.1 Visual Elements Identified

The reference image (`premium-signature-reference.jpg`) contains:

**Top section — two-column layout:**

| Left column | Right column |
|---|---|
| CDC badge logo (rounded-rect mark only) | Award block (`award-banner.png`) |
| Employee full name — large, bold, dark navy | — |
| Job title — regular weight, dark | — |
| "CDC Cableway Development Company" — orange brand color | — |

- A thin vertical rule (`1px`, light gray) separates the two columns.

**Middle section:**
- Full-width horizontal rule (`1px`, light gray).

**Contact row — three items:**

| Item | Content |
|---|---|
| Orange circle icon | Phone number |
| Orange circle icon | Email address |
| Orange circle icon | Website URL |

Items are separated by vertical pipe separators (`|`).

**Second horizontal rule.**

**Disclaimer block:**
- Long legal paragraph in small text (~10px), justified, dark gray.

### 3.2 What Can Be Reproduced Safely in Email (✅)

- Two-column table layout (identity + award) — fully achievable in table HTML.
- Employee name as real HTML `<td>` text — safe and accessible.
- Job title as real HTML text — safe.
- Company name in orange as real HTML text — safe (`color: #F16623`).
- Vertical rule — `border-left: 1px solid #e0e0e0` on a spacer `<td>`.
- Horizontal rules — `<tr>` with a `<td>` containing `border-top` on its style.
- Contact row — three-cell table with icons and text.
- Contact icons as PNG images with `<img>` tags — safe in all clients.
- Text links (email, phone `tel:`, website `https://`) — safe.
- Legal disclaimer as HTML text — safe.
- White background — safe (`bgcolor="#ffffff"` + `background-color: #ffffff`).

### 3.3 What Is Risky or Requires Adaptation (⚠️)

| Element | Risk | Mitigation |
|---|---|---|
| CDC badge logo | In reference, only the badge (left mark) is used, not the full wordmark. | ✅ Resolved: `logo-cdc-badge.png` is the confirmed badge-only asset. See Section 5. |
| `border-radius` on HTML elements | Ignored by Gmail. Cannot CSS-style a rounded logo shape. | Logo badge is a PNG image — the rounded corners are inside the PNG file itself. |
| Web fonts | Not loaded by Gmail or most email clients. | Use email-safe font stack. |
| Base64 images | Stripped by Gmail. | All images must be external HTTPS URLs in production. |
| `<style>` blocks | Stripped by Gmail — so no `@media` queries. Gmail version must be 100% inline CSS. | Two separate outputs: Gmail (pure inline) and Apple Mail (has `<style>` block). |
| 600px total width on mobile | Gmail mobile scales the signature down proportionally. At 375px screen, a 600px table renders at ~62% — text appears smaller, then bumped by iOS. | Acceptable for prototype. Mobile-optimized stacking is Phase 2 enhancement. |
| FT / Statista logos (inside award-banner.png) | Third-party trademarks. | Confirmed decision: company has rights. Verify before production. |
| Dark mode | Email clients may invert colors — white background could become dark, making orange text hard to read. | Force `bgcolor="#ffffff"` attribute AND `background-color: #ffffff` on all `<td>` cells. Also add `color-scheme: light` in Apple Mail `<style>` block. |

### 3.4 Visual Fidelity Expectations

| Platform | Expected Fidelity | Notes |
|---|---|---|
| Gmail Web desktop | **90–95%** | No web fonts, but layout, colors, images are accurate |
| Gmail mobile (iOS) | **70–75%** | Proportional scaling, smaller text — layout survives |
| Apple Mail Mac | **95–98%** | `<style>` block supported, full CSS |
| Apple Mail iPhone | **80–85%** | Responsive stacking with `@media` query; iOS font size controlled |

### 3.5 What Must Be Different for iPhone (Apple Mail version)

- Include a `<style>` block with `-webkit-text-size-adjust: 100%` to prevent iOS
  from auto-scaling fonts.
- Add a `@media (max-width: 480px)` block that collapses the two-column layout into
  a single stacked column:
  - Row 1: Badge logo
  - Row 2: Name + Title + Company
  - Row 3: Award block (can be hidden or shown below, preference TBD)
  - Row 4: Contact row (stacked vertically or kept horizontal if space allows)
  - Row 5: Disclaimer
- Do not rely on `border-radius` (though Apple Mail supports it, keep consistent with Gmail version's image-based approach).
- Award block: on iPhone the two-column side-by-side may be tight. Recommend placing
  award block below identity on small screens via `@media`.

---

## 4. Required Folder Structure

```
cdc-premium-signature-prototype/
│
├── Docs/
│   └── premium-signature-architecture.md    ← this document
│
├── Reference/
│   └── premium-signature-reference.jpg      ← visual target
│
├── Assets/
│   ├── logo-cdc-badge.png                   ← badge-only mark — MAIN LOGO for signature ✅
│   ├── logo-cdc-wordmark.png                ← full wordmark (backup/brand asset, not used in signature)
│   ├── award-banner.png                     ← award block image (ready) ✅
│   ├── icon-phone.svg                       ← contact icon SVG source, v1 outline style ✅
│   ├── icon-email.svg                       ← contact icon SVG source, v1 outline style ✅
│   ├── icon-web.svg                         ← contact icon SVG source, v1 outline style ✅
│   ├── icon-phone.png                       ← contact icon PNG for email (TO EXPORT — production step)
│   ├── icon-email.png                       ← contact icon PNG for email (TO EXPORT — production step)
│   └── icon-web.png                         ← contact icon PNG for email (TO EXPORT — production step)
│
├── Prototypes/
│   ├── gmail-signature.html                 ← static Gmail prototype (Phase 2)
│   └── applemail-signature.html             ← static Apple Mail prototype (Phase 3)
│
└── index.html                               ← generator UI (Phase 5)
```

**Notes:**
- `Assets/` contains all production-ready files and SVG source files. SVG files are source/master format; PNG files are for email use only.
- PNG icon files (`icon-phone.png`, `icon-email.png`, `icon-web.png`) do not yet exist. They are a production step — not required for prototype HTML testing (SVGs can be used in the prototype browser preview).
- `Prototypes/` contains static test pages — not the generator, just the raw signature HTML for browser + client testing.
- `index.html` is the generator. Created in Phase 5.

---

## 5. Required Asset Filenames

| Filename | Status | Purpose | Notes |
|---|---|---|---|
| `Assets/logo-cdc-badge.png` | ✅ Exists | **Main signature logo — badge-only mark** | The rounded-rectangle CDC mark without wordmark. Used in all premium signatures. |
| `Assets/logo-cdc-wordmark.png` | ✅ Exists | Backup / additional brand asset | Full wordmark with "Cableway Development Company" text. NOT used in the premium signature. Keep for other brand uses (presentations, letterheads, etc.). |
| `Assets/award-banner.png` | ✅ Exists | Award block image | Ready to use |
| `Assets/icon-phone.svg` | ✅ Exists | SVG source — approved v1 outline style | Orange outline circle + phone handset pictogram |
| `Assets/icon-email.svg` | ✅ Exists | SVG source — approved v1 outline style | Orange outline circle + envelope pictogram |
| `Assets/icon-web.svg` | ✅ Exists | SVG source — approved v1 outline style | Orange outline circle + globe pictogram |
| `Assets/icon-phone.png` | ⏳ Production step | Contact row phone icon for email | Export from SVG at 56×56px when moving to production |
| `Assets/icon-email.png` | ⏳ Production step | Contact row email icon for email | Export from SVG at 56×56px when moving to production |
| `Assets/icon-web.png` | ⏳ Production step | Contact row globe icon for email | Export from SVG at 56×56px when moving to production |

**Logo asset status: resolved.** Both files are confirmed present. No further action needed for logo assets.

---

## 6. Asset Dimensions and Formats

### 6.1 CDC Badge Logo

| Property | Value |
|---|---|
| File | `Assets/logo-cdc-badge.png` |
| Displayed size in signature | 80px wide × auto height |
| Recommended file resolution | 160px wide (2x for retina), transparent background |
| Format | PNG-24 with alpha transparency |
| Color | Orange on transparent |
| Notes | Do not embed wordmark. The company name appears as separate HTML text below the badge in the signature. |

### 6.2 Award Banner

| Property | Value |
|---|---|
| File | `Assets/award-banner.png` |
| Displayed size in signature | 220px wide × auto height |
| Recommended file resolution | 440px wide (2x for retina) |
| Format | PNG-24 with white or transparent background |
| Current state | The existing file appears production-quality. Verify pixel dimensions before use. |
| Notes | Displayed as a single `<img>` block in the award column. No additional HTML wrapping needed. |

### 6.3 Contact Icons

SVG source files are approved and available. PNG export is a production step only.

| Property | Value |
|---|---|
| SVG source files | `Assets/icon-phone.svg`, `Assets/icon-email.svg`, `Assets/icon-web.svg` |
| PNG files (production) | `Assets/icon-phone.png`, `Assets/icon-email.png`, `Assets/icon-web.png` (to export) |
| Displayed size in signature | 28px × 28px (square) |
| Recommended PNG resolution | 56px × 56px (2x for retina) |
| Format | PNG-24 with transparent background |
| Approved icon style | v1 outline: orange outline circle (r=21, stroke 2.2, `#F16623`) + matching orange pictogram on transparent background |
| Notes | Prototype HTML can use SVGs via `<img src>` for browser testing. Production email must use PNG. |

---

## 7. Contact Icon Design Plan

### 7.1 Specialist Review

**Brand / Corporate Identity Specialist:**
The icons must reflect CDC's visual identity: rounded geometry (consistent with the rounded-rectangle CDC badge), orange color matching the brand primary, and a clean uncluttered style that reads at 28px. Avoid icons that feel "startup-y" or generic. The set should look like they were commissioned as part of the brand kit.

**Premium Email Signature Designer:**
At 28px rendered (56px source for 2x), the pictograms inside the circle must be simple and instantly recognizable. A phone handset receiver, a closed envelope, and a globe with latitude/longitude lines are the correct conventional choices. Stroke weight inside the circle should be 2.5–3px at 56px canvas, not thinner. The circle must be solid filled (not outlined) — a solid orange disc with white pictogram reads better in email at small size than an outlined circle.

**HTML Email Compatibility Expert:**
Do not use SVG directly in Gmail signatures. Gmail strips inline `<svg>` elements. SVG in `<img src="">` tags is only partially supported (Gmail web may show it but Gmail mobile may not). The only universally safe format for icons in email is PNG. Design the icons as SVG (as source files for quality and future editing), then export as PNG at 2x resolution. Use the PNG files in the signature `<img>` tags.

**UX Designer:**
Three icons in a horizontal row separated by `|` pipe characters. Each icon has a `<img>` tag followed by a non-breaking space and the contact detail text. The visual grouping (icon + text) should be clear. Icon size relative to the adjacent text: icon at 28px, contact text at 14px — ratio is correct. Do not make icons smaller than 24px — at that size, the pictogram inside the circle becomes unreadable in most email clients.

### 7.2 Icon Style Specification

| Property | Specification |
|---|---|
| Shape | Outline circle (stroke only, transparent fill) |
| Color (circle stroke) | `#F16623` (CDC brand orange, to be confirmed) |
| Pictogram color | `#F16623` (same orange as circle) |
| Pictogram style | Minimal, geometric, single-weight stroke, 2.2px at 48px viewBox |
| ViewBox / canvas | 48 × 48 SVG viewBox; export PNG at 56 × 56px (displayed at 28 × 28px) |
| Background | Transparent |
| Visual weight | Lighter, restrained — appropriate for corporate email signature at small sizes |
| Rendering | Recognizable at 24–28px; semantic clarity prioritized over visual boldness |
| Approved baseline | v1 outline icon system (`Assets/icon-phone.svg`, `icon-email.svg`, `icon-web.svg`) |

### 7.3 Icon Pictogram Descriptions

**icon-phone:**
- Classic telephone handset receiver (not a smartphone outline).
- The receiver curves: earpiece at top-right, mouthpiece at bottom-left.
- Conventional at 45° rotation. Clean rounded terminals.

**icon-email:**
- Closed envelope, front face.
- Rectangle with a pointed V-shaped flap visible on top.
- No shadow, no additional elements.
- Proportions approximately 1.4:1 (width:height).

**icon-web:**
- Globe/sphere with two vertical curved longitude lines and one horizontal equator line.
- Outline style (not filled globe) — white strokes forming the grid on transparent interior,
  sitting on the orange filled circle.
- This creates a clean "globe wireframe" on orange background.

### 7.4 Source and Export Workflow

```
Step 1: SVG source files are done — Assets/icon-phone.svg, icon-email.svg, icon-web.svg ✅
Step 2: (Production step) Export SVGs to PNG at 56×56px → Assets/icon-phone.png, icon-email.png, icon-web.png
Step 3: Validate in a test email that icons render correctly in Gmail and Apple Mail
Step 4: Upload PNGs to the company's public HTTPS asset server
```

### 7.5 Why Not SVG Directly in Email

| Method | Gmail Web | Gmail Mobile | Apple Mail | Verdict |
|---|---|---|---|---|
| Inline `<svg>` in HTML | Stripped | Stripped | Works | ❌ Not safe |
| `<img src="file.svg">` | Often blocked | Often broken | Works | ❌ Not reliable |
| `<img src="file.png">` | ✅ Works | ✅ Works | ✅ Works | ✅ Use this |
| CSS `border-radius` circle | ✅ Works | ✅ Works | ✅ Works | Risky in Outlook. Use PNG instead. |

**Conclusion:** Always use PNG for icons in email signatures. SVG is the source/master format only.

### 7.6 How to Visually Test Icons

1. In prototype HTML, display the icon PNGs at `28px × 28px` alongside contact text.
2. Send a test email from the signature to:
   - A Gmail address — check in Gmail Web (Chrome) and Gmail iOS app.
   - An email address accessible via Apple Mail on iPhone.
3. Check: icon loads, circle is orange, pictogram is white, edges are clean.
4. Test with image loading disabled in Gmail settings — confirm alt text shows.
5. Test in dark mode — force `bgcolor` on surrounding cells so the orange circle remains visible.

---

## 8. Approximate Brand Color Proposal

### 8.1 Observed Orange Value

After analyzing `logo-cdc-badge.png`, `logo-cdc-wordmark.png`, and the reference image `premium-signature-reference.jpg`,
the CDC brand orange is a warm, medium-intensity orange with high saturation:

**Proposed working value: `#F16623`**

| Color | HEX | RGB | Notes |
|---|---|---|---|
| CDC Orange (proposed) | `#F16623` | `rgb(241, 102, 35)` | Warm orange, high saturation, mid-luminance |
| Slightly lighter variant | `#F47B32` | `rgb(244, 123, 50)` | If the above reads too dark |
| Slightly darker variant | `#E05A18` | `rgb(224, 90, 24)` | If the above reads too bright |

The reference image contact icons and company name text appear to match approximately
`#F16623` or `#E8561C` — both are reasonable candidates.

### 8.2 How to Confirm the Exact Value

**Option A — From digital brand materials:**
- If a brand guidelines PDF, PowerPoint template, or Figma file exists, the exact HEX or
  Pantone value will be documented there. Ask the marketing or design team.

**Option B — From the cdc.company website:**
- Open cdc.company in Chrome. Right-click the orange element (button, logo, text).
- Inspect → select the element → check `color` or `background-color` in computed styles.
- This gives the exact HEX value the website uses for production.

**Option C — Digital Color Meter (Mac):**
- Open the brand logo PNG in Preview.
- Use macOS Digital Color Meter app (Utilities) to sample the orange fill.
- Read the HEX value.

**Option D — Eyedropper in design tool:**
- Open `logo-cdc-badge.png` or `logo-cdc-wordmark.png` in Figma, Adobe Illustrator, or Photoshop.
- Use the color picker / eyedropper to sample the fill.
- Note: PNG color accuracy depends on the file being saved with correct color profile.

**Until confirmed:** Use `#F16623` as the prototype working value. All occurrences in the
generated HTML should reference this value from the config object at the top of `index.html`,
so the entire signature can be updated by changing one line.

---

## 9. Font Strategy

### 9.1 Where Corporate Fonts Can Be Used Safely

| Context | Corporate Font | Why |
|---|---|---|
| Generator UI (`index.html` page) | ✅ Yes, if license allows web use | The generator is a web page. Web fonts load normally here. |
| Preview panel inside generator | ✅ Yes | The preview is also a web page — fonts will load. |
| Static prototype pages | ✅ Yes | Same as generator — standard web page. |
| Generated Gmail signature HTML | ❌ No | See below. |
| Generated Apple Mail signature HTML | ❌ No | See below. |

### 9.2 Why Custom Fonts Must Not Be Used in Generated Email Signature HTML

When an employee copies the signature HTML and pastes it into Gmail or Apple Mail, the
email client renders the HTML in its own sandboxed environment:

1. **No internet access for fonts during compose:** Gmail does not fetch `@font-face`
   URLs at compose time. The font will fall back silently.
2. **Gmail strips `<style>` blocks:** Even if a `@font-face` declaration were included
   in the Gmail signature, Gmail strips all `<style>` tags from the signature HTML when
   the employee saves it in Gmail Settings.
3. **Apple Mail on iPhone does not fetch fonts at compose time:** Fonts must be installed
   on the device or fall back to system fonts.
4. **In received emails:** The recipient's email client does not load the sender's font.
   The email is rendered with the client's default font or whichever system font is specified
   in the fallback stack.
5. **Font embedding (base64 in CSS):** This would bloat the signature HTML to potentially
   hundreds of kilobytes, breaking Gmail's 10,000-character signature limit. Not viable.

**Conclusion:** Web fonts in email signatures are unreliable across all major clients.
Design the signature typography using the email-safe font stack. The visual difference
is acceptable because the fallback fonts (Arial, Helvetica) are clean professional
sans-serifs that maintain the premium look of the reference design.

### 9.3 Recommended Email-Safe Font Stack

```css
font-family: Arial, Helvetica, 'Helvetica Neue', sans-serif;
```

This stack:
- Renders cleanly on Windows (Arial), macOS/iOS (Helvetica Neue), and Linux (Helvetica or fallback sans).
- Maintains adequate visual weight for large bold employee names.
- Is consistent with the reference design's sans-serif aesthetic.

Alternative if a slightly more refined look is needed:
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, Helvetica, sans-serif;
```

This uses the system UI font on macOS/iOS (San Francisco), Segoe UI on Windows, and
falls back to Arial/Helvetica elsewhere. This produces the cleanest result on Apple
devices in particular, which is relevant for the Apple Mail version.

### 9.4 Corporate Font Files for Prototype

- Corporate font files are **not needed** for Phase 1 (static signature prototypes).
- They are needed in Phase 5 (generator UI build) if the brand license permits web use.
- At that point, obtain: WOFF2 file(s) + the license confirmation for web use.
- Do not unblock the prototype on this dependency.

---

## 10. Gmail Signature Layout Plan

### 10.1 Overall Structure

```
<table width="600" cellpadding="0" cellspacing="0" bgcolor="#ffffff">

  <!-- ROW 1: Identity block + Award block -->
  <tr>
    <td width="90" valign="middle">
      <!-- Logo badge: <img src="logo-cdc-badge.png" width="80"> -->
    </td>
    <td width="20"></td>   <!-- spacer -->
    <td width="240" valign="middle">
      <!-- Name (bold, large, dark navy) -->
      <!-- Job title (regular, dark) -->
      <!-- "CDC Cableway Development Company" (orange) -->
    </td>
    <td width="10" style="border-left: 1px solid #e0e0e0;"></td>  <!-- vertical rule -->
    <td width="20"></td>   <!-- spacer -->
    <td width="220" valign="middle">
      <!-- Award block: <img src="award-banner.png" width="220"> -->
    </td>
  </tr>

  <!-- ROW 2: Horizontal rule -->
  <tr>
    <td colspan="6" style="border-top: 1px solid #e0e0e0; padding: 10px 0 0 0;"></td>
  </tr>

  <!-- ROW 3: Contact row -->
  <tr>
    <td colspan="6">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td>
            <img src="icon-phone.png" width="28" height="28"> &nbsp; +971 XX XXX XX XX
          </td>
          <td width="1" style="border-left: 1px solid #e0e0e0;"></td>
          <td>
            <img src="icon-email.png" width="28" height="28"> &nbsp; name@cdc.company
          </td>
          <td width="1" style="border-left: 1px solid #e0e0e0;"></td>
          <td>
            <img src="icon-web.png" width="28" height="28"> &nbsp; cdc.company
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- ROW 4: Horizontal rule -->
  <tr>
    <td colspan="6" style="border-top: 1px solid #e0e0e0; padding: 10px 0 0 0;"></td>
  </tr>

  <!-- ROW 5: Disclaimer -->
  <tr>
    <td colspan="6">
      <!-- Legal disclaimer text at 10px, color #666666, text-align: justify -->
    </td>
  </tr>

</table>
```

### 10.2 Typography (Gmail Version, Inline CSS)

| Element | Font | Size | Weight | Color |
|---|---|---|---|---|
| Employee name | Arial, Helvetica, sans-serif | 25px | 700 (bold) | `#1a1a2e` (dark navy) |
| Job title | Arial, Helvetica, sans-serif | 15px | 400 | `#555555` |
| Company name (display) | Arial, Helvetica, sans-serif | 15px | 600 | `#F16623` (brand orange) — text: "Cableway Development Company" |
| Contact text | Arial, Helvetica, sans-serif | 14px | 400 | `#333333` |
| Disclaimer | Arial, Helvetica, sans-serif | 11px | 400 | `#888888` — line-height 1.5 — text uses full legal name |

### 10.3 Widths and Dimensions

| Element | Width |
|---|---|
| Total signature | 640px |
| Logo badge column | 96px |
| Spacer (logo → identity) | 24px |
| Identity text column | 258px |
| Vertical separator | 1px (bgcolor td) |
| Spacer (separator → award) | 21px |
| Award block column | 240px |
| Logo badge image | 96px wide, height auto |
| Award banner image | 240px wide, height auto |
| Contact icons | 30 × 30px |

### 10.4 Spacing

| Element | Padding / Margin |
|---|---|
| Vertical padding above identity row | 22px |
| Vertical padding below identity row | 18px |
| Gap between name and title | 7px |
| Gap between title and company | 5px |
| Contact row vertical padding | 14px top and bottom |
| Padding right of phone / left of website | 22px |
| Padding each side of email item | 22px |
| Gap between icon and contact text | 9px (margin-left on text element) |
| Disclaimer top padding | 12px |
| Disclaimer bottom padding | 20px |

### 10.5 Expected Visual Fidelity vs. Reference

The Gmail version will match the reference at approximately 90–95%:

- ✅ Two-column layout with identity and award block — exact match
- ✅ Vertical rule between columns — exact match
- ✅ Horizontal rules — exact match
- ✅ Orange contact icons — exact match (PNG images)
- ✅ Three-column contact row with pipes — exact match
- ✅ Legal disclaimer — exact match in content; minor difference in line breaks
- ⚠️ Font: Arial instead of brand font — visually close, not identical
- ⚠️ Name dark color: dark navy `#1a1a2e` approximated from reference image

---

## 11. Apple Mail / iPhone Layout Plan

### 11.1 Key Differences From Gmail Version

The Apple Mail version includes a `<style>` block in the `<head>` (or inline at top of body)
that provides:

1. `* { -webkit-text-size-adjust: 100% !important; }` — prevents iOS from auto-scaling
   text in narrow viewports.
2. `color-scheme: light` — prevents iOS Mail dark mode from inverting the white background
   and making content unreadable.
3. `@media (max-width: 480px)` responsive rules that collapse the two-column layout into
   a single stacked column.

### 11.2 Responsive Stacking on iPhone (max-width: 480px)

When the viewport is ≤480px (all iPhones), the layout stacks vertically:

```
[Logo badge]
[Name]
[Job title]
[CDC Cableway Development Company]
[Award banner — full width]
[─────────── horizontal rule ───────────]
[Phone icon] +971 XX XXX XX XX
[Email icon] name@cdc.company
[Web icon]   cdc.company
[─────────── horizontal rule ───────────]
[Legal disclaimer]
```

This is achieved by applying `display: block !important; width: 100% !important;` to each
major `<td>` via `@media` query. (Note: Apple Mail supports `@media`. Gmail does not, which
is why the Gmail version cannot do this.)

### 11.3 What Stays Premium in the iPhone Version

- Font sizes are identical or slightly larger (iOS text benefit from +1–2px).
- Award banner image is present and displayed at full available width on mobile.
- Orange brand color is identical.
- Contact icons are identical PNGs.
- All links (phone, email, web) remain tappable.

### 11.4 What Is Simplified or Omitted in the iPhone Version

- The two-column side-by-side layout is replaced by a stacked single-column layout on small screens.
- The vertical separator line between identity and award block is hidden on mobile (no need in stacked layout).
- On Mac (wider viewport), the iPhone version renders identically to the Gmail version.

### 11.5 Known iOS Mail Issues to Avoid

| Issue | Solution |
|---|---|
| iOS bumps text to 17px minimum | Add `-webkit-text-size-adjust: 100%` in `<style>` block |
| iOS Mail dark mode inverts white | Add `color-scheme: light` and `background-color: #ffffff` on all cells |
| iPhone signature install is confusing | Provide step-by-step instructions in generator UI |
| Paste into iPhone Mail Settings may strip HTML | Test: copy from Safari → paste into Mail. Provide fallback via `.html` file method. |
| Tappable links on phone | Wrap phone numbers in `<a href="tel:+971...">` — Apple Mail auto-detects phone numbers, but explicit `tel:` is cleaner |

---

## 12. Generator Fields

| Field | Required | Editable by | Default / Lock | Notes |
|---|---|---|---|---|
| First name | Required | Employee | — | Text input |
| Last name | Required | Employee | — | Text input |
| Job title | Required | Employee | — | Text input |
| Department | Optional | Employee | Hidden by default | Toggle to show in signature |
| Mobile (primary) | Required | Employee | — | Format hint: +971 XX XXX XX XX |
| Mobile 2 | Optional | Employee | Hidden | Toggle to add second number |
| Work email | Required | Employee | — | Validated: must contain @ |
| Work email 2 | Optional | Employee | Hidden | Toggle to add second email |
| Website | Optional | Employee | `cdc.company` | Pre-filled but editable by employee |
| Address | Optional | Employee | Hidden | Toggle; shows one-line address under contact |
| Company name | Locked | IT / Config | `CDC Cableway Development Company` | Not editable; shown in orange |
| Award block | Default ON | IT / Config | On | Can be toggled off per employee if needed |
| Legal disclaimer | Locked | IT / Config | Full text from config | Not editable by employee |

**Admin-only / config-only (not in UI):**
- Logo URL
- Award banner URL
- Brand color HEX
- Disclaimer text
- Company name

---

## 13. Copy Button Logic

### 13.1 Gmail Copy Button

**Label:** "Copy Gmail Signature"

**What it copies:** The Gmail-specific signature HTML — pure inline CSS, no `<style>`
block, no `<head>`, no `<html>` wrapper. Just the outer `<table>` and its contents.

**How it copies:** The signature must be copied as **rich formatted HTML**, not plain text.
If the copy sends plain text, Gmail's rich text signature editor will show raw HTML tags
instead of a rendered signature.

Implementation approach:
```js
function copyAsRichText(html) {
  const container = document.createElement('div');
  container.innerHTML = html;
  container.style.position = 'fixed';
  container.style.pointerEvents = 'none';
  container.style.opacity = '0';
  document.body.appendChild(container);
  const range = document.createRange();
  range.selectNodeContents(container);
  const sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);
  document.execCommand('copy');  // deprecated but universally supported in 2025
  sel.removeAllRanges();
  document.body.removeChild(container);
}
```

Modern alternative using Clipboard API (HTTPS required):
```js
async function copyAsRichTextModern(html) {
  const blob = new Blob([html], { type: 'text/html' });
  const item = new ClipboardItem({ 'text/html': blob });
  await navigator.clipboard.write([item]);
}
```

Use the modern method with a fallback to `execCommand`. Show "✓ Copied!" feedback for 2s.

### 13.2 Apple Mail / iPhone Copy Button

**Label:** "Copy Apple Mail Signature"

**What it copies:** The Apple Mail variant HTML — includes the `<style>` block.
Otherwise same logic as Gmail copy.

**iPhone-specific note:** The recommended install flow for iPhone is:
1. Click "Copy Apple Mail Signature" on the generator page opened in Safari on iPhone.
2. Open iPhone Settings → Mail → Signature.
3. Tap in the signature field, select all, delete existing.
4. Long-press → Paste.
This works because Safari passes rich HTML to the clipboard and iPhone Mail accepts it.

### 13.3 Fallback Copy Method

If `navigator.clipboard.write` is unavailable (non-HTTPS, older browser):
1. Fall back to `document.execCommand('copy')` with a visible-but-off-screen rendered div.
2. If that also fails: display the raw HTML in a `<textarea>` with a note:
   "Automatic copy failed. Select all text in the box below and copy manually (Ctrl+C / Cmd+C)."

### 13.4 User Feedback on Copy

- Button changes from "Copy Gmail Signature" → "✓ Copied!" for 2 seconds.
- Button reverts to original label.
- No modal, no alert, no page reload.

---

## 14. Award / Banner Implementation Plan

### 14.1 Approach

The `award-banner.png` file is used as a single `<img>` block in the right column of the
signature table:

```html
<img src="[URL]/award-banner.png"
     width="220"
     height="auto"
     alt="Financial Times | 1000 Europe's Fastest Growing Companies 2025 — Ranked 3rd in Europe"
     style="display: block; border: 0;">
```

### 14.2 Pros

- Exactly matches the reference visual without requiring complex HTML/CSS table nesting
  for the FT logo, Statista logo, dividers, and bordered box.
- Self-contained: no risk of internal element misalignment across email clients.
- Fast to implement and test.
- The `alt` text provides fallback when images are blocked.

### 14.3 Cons

- If text inside the award badge ever changes (new year, new ranking), the entire PNG
  must be regenerated and re-uploaded.
- On ultra-high-resolution displays (3x), a 2x PNG may appear slightly soft.
- Screen readers cannot read the image text content except via `alt`.
- If FT/Statista logo licensing is ever questioned, the entire image must be replaced.

### 14.4 Legal / Brand Approval Assumptions

The current implementation assumes:
- CDC was recognized in the FT/Statista 1000 Europe's Fastest Growing Companies 2025 list.
- CDC has received an award kit or digital assets from FT/Statista, which typically grants
  usage rights in marketing materials including email signatures.
- **Action required:** Confirm in writing (from the award certificate or the FT/Statista
  brand kit license) that logo use in employee email signatures is permitted.
- If permission cannot be confirmed, replace `award-banner.png` with a text-only version
  that does not contain the FT or Statista logos.

### 14.5 Future Removal / Toggle

- In the generator, the award block should be a toggleable field (`awardEnabled: true/false`).
- When disabled: the identity block expands to fill the full width (no two-column split).
- This ensures the generator remains functional if the award block is retired or updated.
- The toggle should be visible in the generator UI with a note: "Award block is shown for
  all CDC employees by default."

---

## 15. Production Image Hosting Requirements

### 15.1 Requirements

All images referenced in the generated signature HTML must be:

1. **Publicly accessible** via HTTPS without authentication.
2. **Hosted on a stable, company-controlled URL** — not Google Drive, Dropbox, or a
   shared link from any cloud storage service.
3. **Permanent** — the URL must not change when the file is replaced or updated. Use
   versioned filenames if updates are expected (e.g., `award-banner-v2.png`).
4. **Fast to load** — ideally on a CDN or at minimum a performant web server.
5. **Not blocked by corporate firewalls** — recipients inside the company and outside
   must both be able to load the images.

### 15.2 Recommended Hosting Structure

```
https://assets.cdc.company/signature/
  ├── logo-cdc-badge.png
  ├── award-banner.png
  ├── icon-phone.png
  ├── icon-email.png
  └── icon-web.png
```

Or on the corporate website server:
```
https://cdc.company/wp-content/signature-assets/
```

(WordPress uploads are acceptable if the URL structure is stable and not dependent on a
specific post or attachment ID.)

### 15.3 Why Not Base64

- **Gmail strips base64-encoded images** from signature HTML when the employee saves
  the signature in Gmail Settings. The images disappear completely.
- Base64 strings are very large (a 56×56px PNG encodes to ~3,000 characters). Three icons
  alone would add ~9,000 characters, exceeding Gmail's 10,000-character signature limit.
- Base64 cannot be updated without regenerating and re-pasting the signature.

### 15.4 Why Not Unstable Cloud-Sharing Links

- Google Drive "anyone with link" URLs change format, may require sign-in, and are
  blocked by email clients as tracking URLs.
- Dropbox "shared" URLs often redirect, which is not supported by `<img>` tags in email.
- OneDrive shared links have similar issues.

---

## 16. WordPress / Static Hosting Requirements

### 16.1 Recommended Publishing Method

**Option A — Dedicated static page (Recommended):**
- Host `index.html` (the generator) at a dedicated URL:
  `https://signature.cdc.company/` or `https://cdc.company/signature-generator/`
- This is the cleanest approach: no WordPress CSS interference, no plugin conflicts.
- Can be served from a simple web server, CDN (Netlify, Cloudflare Pages), or a subdirectory
  of the main web server.

**Option B — Embedded in WordPress via iframe:**
- Add a WordPress page with an iframe pointing to the static generator URL.
- WordPress page: `https://cdc.company/tools/signature-generator/`
- iframe: `<iframe src="https://signature.cdc.company/" width="100%" height="900" frameborder="0"></iframe>`
- The static generator handles all logic. WordPress is only a wrapper page.
- Advantage: generator is accessible via the main CMS without WordPress handling the logic.
- Disadvantage: iframe height must be set correctly; some mobile browsers handle iframes poorly.

### 16.2 How to Avoid WordPress CSS Breaking the Generator

- **If using iframe:** Generator page is fully isolated. WordPress CSS cannot reach inside
  the iframe due to the browser's same-origin policy (if different subdomain) or iframe
  sandboxing. This is the safest method.
- **If embedding the generator directly in a WordPress page** (not recommended):
  WordPress themes apply global CSS (`* { box-sizing: border-box }`, resets, font stacks)
  that will affect the generator form. Wrap all generator elements in a scoped container:
  ```css
  #cdc-signature-generator * { all: revert; }
  ```
  This is fragile and theme-dependent. Use iframe instead.

### 16.3 Caching Considerations

- The generator HTML file itself: set cache headers for 1 hour (`Cache-Control: max-age=3600`).
- Signature image assets: set long-term cache headers (1 year) since they are versioned
  by filename.
- When updating the generator (new fields, new disclaimer), increment a version query
  string on the asset URLs inside `index.html` to bust browser cache:
  `?v=1.1` → `?v=1.2`

### 16.4 Keeping the Employee URL Stable

- The employee-facing URL (`signature.cdc.company`) must not change after rollout.
- It will be referenced in company onboarding documents, Slack messages, and IT wikis.
- If the generator is moved to a new URL, set up a 301 redirect from the old URL.

---

## 17. Future Google Workspace Centralized Deployment

### 17.1 Is It Possible?

Yes. Google Workspace supports centralized email signature management via:

**Option A — Google Workspace Admin Console (Append Footer):**
- Available in Google Workspace Business Starter and higher tiers.
- Admin Console → Apps → Google Workspace → Gmail → Compliance → Append footer.
- Applies a signature to all outgoing emails at the server level.
- Limitation: This appends a plain-text or basic HTML footer — not suitable for a complex
  table-based premium signature.

**Option B — Google Workspace Admin SDK (Directory API + Gmail API):**
- Allows IT to set a custom HTML signature for each user programmatically via the Gmail API.
- `users.settings.sendAs.update` with `signature` field.
- This is the correct method for deploying per-employee premium HTML signatures at scale.
- Requires: Google Workspace Admin (or a service account with Domain-wide Delegation).
- Works with a script (Python/Node) that reads employee data from a source (CSV, Directory API)
  and sets the signature for each account.

**Option C — Third-party tools:**
- Exclaimer Cloud, Crossware Mail Signature, Letsignit — SaaS tools that connect to
  Google Workspace and centrally manage signatures.
- Simpler to configure than DIY API scripts.
- Costs a per-user license fee.
- Most mature option for a non-technical IT team.

**Option D — Google Apps Script (GAM):**
- GAM (Google Apps Manager) is a free open-source CLI tool.
- Can push signatures to all users via command-line.
- Requires a service account with Domain-wide Delegation.
- More complex to set up than a third-party SaaS tool, but no licensing cost.

### 17.2 Requirements

| Requirement | Detail |
|---|---|
| Google Workspace tier | Business Starter or higher (for API access) |
| Admin access | Super Admin or delegated admin with Gmail management rights |
| Service account | Required for Gmail API batch operations |
| Domain-wide Delegation | Required to set signatures for other users |
| Employee data source | Spreadsheet or HR system with employee name/title/phone/email |
| Per-employee HTML generation | Script must produce per-employee inline-CSS HTML |
| Rollout plan | Set signatures for IT first, then by department, then all users |

### 17.3 Risks

- If Google changes the Gmail API signature format in the future, centrally-pushed signatures
  may break without notice.
- Central push overwrites any signature the employee has manually set. Employees lose
  personal customizations.
- Signatures pushed via API must still comply with Gmail's 10,000-character limit.
- Requires ongoing maintenance: when an employee changes role, the signature must be
  re-pushed.

### 17.4 Recommendation

**Phase 1:** Manual copy-paste generator (this project). Always ships first.

**Phase 9 (future):** Evaluate centralized deployment. Recommended path:
- Start with Google Apps Script / GAM for pilot on 5–10 users.
- If successful, consider a third-party tool (Exclaimer) for company-wide rollout.
- The manual generator should remain available as a fallback even after central deployment,
  because not all employees may be on Google Workspace (e.g., Apple Mail users need
  a separate installation method anyway).

---

## 18. Testing Checklist

### Gmail Web Compose
- [ ] Paste signature into Gmail Settings → Signature. Verify no HTML tags appear.
- [ ] Open a new compose window. Signature appears at bottom.
- [ ] Logo badge image loads.
- [ ] Award banner image loads.
- [ ] Contact icons load.
- [ ] All three contact items appear side by side with pipe separators.
- [ ] Employee name is large and bold.
- [ ] Company name is orange.
- [ ] Disclaimer text is small and readable.
- [ ] All links are clickable (phone, email, website).

### Gmail Web Sent Email
- [ ] Send a test email to an external address. Open the sent item.
- [ ] Signature renders correctly in the sent email view.
- [ ] Images load.

### Gmail Received Email (External)
- [ ] Recipient receives email and signature renders correctly.
- [ ] Images load for the recipient.
- [ ] Links work for the recipient.

### Gmail Mobile App (iOS)
- [ ] Signature visible in compose (scroll down to bottom).
- [ ] Layout does not break or overflow.
- [ ] Icons are visible at mobile scale.
- [ ] Text is readable.
- [ ] Tapping phone number initiates call.
- [ ] Tapping email initiates compose.
- [ ] Tapping website opens browser.

### Apple Mail iPhone — Settings Install
- [ ] Open generator in Safari on iPhone.
- [ ] Tap "Copy Apple Mail Signature" button.
- [ ] Go to iPhone Settings → Mail → Signature.
- [ ] Tap signature field, select all, paste.
- [ ] Signature renders as formatted HTML (not raw tags).

### Apple Mail iPhone — Compose / Draft
- [ ] Open Mail on iPhone, compose new email.
- [ ] Signature appears at bottom.
- [ ] Layout is readable (single column on small screen).
- [ ] Images load.

### Apple Mail iPhone — Received Email
- [ ] Recipient on iPhone receives and can see the signature.
- [ ] Images load.
- [ ] Links work.

### Apple Mail Mac (if applicable)
- [ ] Install signature via Safari → select all → copy → Mail Preferences → Signatures → paste.
- [ ] Signature renders correctly.
- [ ] Two-column layout is preserved on Mac (wide viewport).

### Dark Mode Tests
- [ ] Gmail dark mode (Settings → Theme → Dark): white background is preserved (not inverted).
- [ ] Apple Mail dark mode on iPhone: white background preserved, orange text visible.
- [ ] Orange on forced-dark: orange should remain visible (orange has sufficient contrast on dark).

### Image Loading Disabled
- [ ] Open email with images blocked (Gmail: Settings → Images → "Ask before displaying").
- [ ] Alt text appears for logo, award banner, and icons.
- [ ] Signature still communicates employee identity via HTML text.

### Long Names and Titles
- [ ] Test with 25-character first+last name (e.g., "Anastasia Bogdanovich-Smith").
- [ ] Test with 40-character job title ("Senior Corporate Infrastructure Manager").
- [ ] Layout does not break or overflow the table cell.

### Optional Fields
- [ ] Generate signature with all optional fields hidden (no department, no address, single phone, single email).
- [ ] Generate signature with all optional fields shown.
- [ ] Toggle award block off — layout adjusts to single column.

### Links
- [ ] `tel:` link works on mobile (initiates call).
- [ ] `mailto:` link works (opens mail client or compose).
- [ ] `https://` website link opens in browser.
- [ ] Links do not have underline in signature (style: `text-decoration: none`).

---

## 19. Implementation Phases

### Phase 1 — Finalize Assets and Architecture (Current)
- [x] Create architecture document
- [x] Confirm CDC logo assets — `logo-cdc-badge.png` (main) and `logo-cdc-wordmark.png` (backup) both exist
- [ ] Confirm brand orange HEX value
- [x] Design contact icon SVG source files — v1 outline system approved (`Assets/icon-phone.svg`, `icon-email.svg`, `icon-web.svg`)
- [ ] Export contact icons to PNG (56×56px) — production step, not prototype dependency
- [ ] Confirm image hosting location for prototype (local) and production (HTTPS URL)
- [ ] Confirm FT/Statista usage rights in writing
- [ ] Confirm legal disclaimer text (final approved version)

### Phase 2 — Static Gmail Signature Prototype
- Create `Prototypes/gmail-signature.html` — a standalone HTML file showing the complete
  Gmail signature for a sample employee (e.g., "Anna Semenova, Admin & HR Director").
- No generator logic. Pure HTML with inline CSS.
- Use local asset paths for prototype (`../Assets/...`).
- Goal: confirm the visual output matches the reference before building the generator.

### Phase 3 — Static Apple Mail / iPhone Prototype
- Create `Prototypes/applemail-signature.html` — same employee, Apple Mail variant.
- Includes `<style>` block with responsive rules.
- Open in Safari on iPhone to test the copy-paste install flow.

### Phase 4 — Real Device Testing
- Test Phase 2 prototype by pasting into Gmail Settings.
- Test Phase 3 prototype by pasting into iPhone Mail Settings.
- Resolve all rendering issues before building the generator.

### Phase 5 — Build Generator UI
- Create `index.html` — the generator.
- Form with all required/optional fields.
- Live preview panel.
- Two output tabs: Gmail / Apple Mail.
- Copy buttons with rich text clipboard support.
- Instructions panels.

### Phase 6 — Copy-to-Clipboard Testing
- Test the copy flow on Chrome, Safari, Firefox.
- Test the pasted result in Gmail and Apple Mail.
- Resolve any formatting loss during copy-paste.

### Phase 7 — WordPress / Static Publishing
- Deploy generator to the production URL (`signature.cdc.company` or similar).
- Upload images to production HTTPS hosting.
- Update image URLs in the generator config.
- Test all copy flows from the production URL.

### Phase 8 — Employee Instructions and Rollout
- Write per-platform installation guides (with screenshots).
- Gmail: 5-step guide.
- iPhone: 7-step guide with screenshots.
- Mac: 4-step guide.
- Distribute to all employees.

### Phase 9 — Centralized Deployment Research (Future)
- Evaluate Google Workspace API / GAM approach.
- Pilot with 5 users.
- If successful, plan company-wide rollout.

---

## 20. Risks and Trade-offs

| Risk | Severity | What to Do |
|---|---|---|
| FT/Statista logos not properly licensed for email use | High | Obtain written permission before production. If denied, use text-only award block. |
| Gmail strips base64 images | Critical | Never use base64 in generated HTML. All images must be external HTTPS URLs. |
| Image hosting URL changes after rollout | High | Use a permanent stable subdomain. Never use WordPress attachment IDs or cloud links. |
| iPhone signature install is confusing | High | Invest heavily in the step-by-step guide. Consider creating a short video. |
| Award block becomes outdated (says "2025") | Medium | Place award year in the config so it can be updated without rebuilding. |
| Dark mode breaks white background | Medium | Force `bgcolor="ffffff"` HTML attribute AND `background-color: #ffffff` inline CSS on all table cells. |
| Long names or titles overflow table cells | Medium | Add `word-break: break-word` and `overflow-wrap: break-word` to identity cell. Test with extreme values. |
| Gmail mobile layout feels small | Medium/Low | Accept as known limitation. Two-column at 60% zoom is the cost of 600px design. An optional mobile-specific stacking output is a Phase 2+ enhancement. |
| WordPress CSS breaks generator form | Low | Use iframe embed. Do not embed generator HTML inline inside WordPress pages. |
| Gmail 10,000-character limit | Low | Monitor generated HTML character count. Reference design with disclaimer is approx 3,500–5,000 chars — within limit. |
| Custom fonts in email | Non-issue | Do not use. Email-safe stack resolves this entirely. |

### What Cannot Be Done 1:1

- Web fonts: email signature will use Arial/Helvetica, not the brand typeface.
- `border-radius` on CSS elements: only PNG-based rounded elements are safe for Gmail.
- `@media` queries in Gmail: Gmail strips `<style>`. Responsive stacking is only available
  in the Apple Mail version.
- Pixel-perfect rendering across all clients: color rendering, font metrics, and line heights
  vary between Gmail Web, Gmail mobile, and Apple Mail. 90% visual fidelity is the
  realistic target.

### Where Reliability Wins Over Design

- Contact icons: use PNG, not SVG inline or CSS shapes. Less elegant, but works everywhere.
- Background: always set `bgcolor` HTML attribute, not only CSS. Belt-and-suspenders.
- Layout: table-based, not `<div>`. Older but universally supported in email.
- Font: Arial, not brand font. Users will not notice if the rest of the design is premium.

---

## 21. Remaining Open Questions

| # | Question | Priority | Who answers |
|---|---|---|---|
| 1 | What is the exact CDC brand orange HEX value? | High | Marketing / brand team |
| 2 | ~~Is there a badge-only version of the CDC logo (without wordmark)?~~ | ~~High~~ | **Resolved** — `logo-cdc-badge.png` confirmed. |
| 3 | Has legal confirmed that FT/Statista logos can be used in every employee email signature? | High | Legal |
| 4 | What is the final approved legal disclaimer text? | High | Legal |
| 5 | Where will images be hosted in production? (subdomain, CDN, WordPress) | High | IT / web team |
| 6 | What Google Workspace tier is the company on? (relevant for Phase 9) | Medium | IT |
| 7 | Do employees use iPhone native Mail for work email, or Gmail app only? | Medium | IT / HR |
| 8 | Are there corporate font files available, and do they have a web-use license? | Medium | Marketing / brand team |
| 9 | Should the award block be toggleable by individual employees, or IT-only? | Medium | Management / IT |
| 10 | Is a Mac Apple Mail version needed, or is iPhone the only Apple priority? | Low | IT |
| 11 | What address format should appear in the optional address field? | Low | Management |
| 12 | Should Website 2 field be offered? (e.g., for employees with a LinkedIn profile) | Low | Management |

---

## 22. Icon System Decision

**Document version:** 1.3 — 2026-05-15

### Approved baseline

For the MVP/prototype phase, the **v1 outline icon system** is approved as the baseline:

| File | Status |
|---|---|
| `Assets/icon-phone.svg` | ✅ Approved |
| `Assets/icon-email.svg` | ✅ Approved |
| `Assets/icon-web.svg` | ✅ Approved |

**Style spec:** outline orange circle (r=21, stroke 2.2, #F16623) + matching orange pictogram.

### Rejected experiments

| File | Reason |
|---|---|
| `Assets/icon-phone-v2.svg` | Phone path reads as abstract ear/hook shape, not a handset |
| `Assets/icon-email-v2.svg` | Heavier stroke acceptable but rejected alongside phone |
| `Assets/icon-web-v2.svg` | Heavier stroke acceptable but rejected alongside phone |
| `Assets/icon-phone-v3.svg` | Solid orange circle too heavy; phone shape still unrecognizable |
| `Assets/icon-email-v3.svg` | Rejected alongside v3 system |
| `Assets/icon-web-v3.svg` | Rejected alongside v3 system |

These files have been deleted from the project. If a new icon system is needed in the future, it will be created from scratch.

### Design rationale

The priority for signature icons is **semantic clarity first**. At 24–32px (the target display size in an email signature contact row), a telephone handset must be instantly recognizable. The v2/v3 phone path was too abstract — it resembled an ear, hook, or chain link rather than a classic handset. The solid-circle v3 style also felt too visually dominant relative to the CDC badge logo and award banner.

The v1 system's lighter visual weight and conventional pictograms are the correct trade-off for a corporate email signature context.

---

## 23. Disclaimer Strategy

### 23.1 Default Disclaimer Text

The standard corporate disclaimer used in all CDC email signatures is:

> This email and any files transmitted with it may contain information that is proprietary and confidential to CDC Cableway Development Company and its affiliates and is intended solely for the use of the individual or entity to whom it is addressed. If you have received this email in error, please return it to the sender by replying to it, then permanently delete it from your system. Any disclosure, use, copying, or distribution of the information contained in this email by anyone other than the named addressee is strictly prohibited. Any views or opinions expressed in this email are solely those of the author and do not necessarily represent those of CDC Cableway Development Company and its affiliates. No employee, contractor, or agent is authorized to conclude any binding agreement on behalf of CDC Cableway Development Company and its affiliates by email.

This text is the current corporate standard and is used verbatim in `Prototypes/gmail-signature.html`.

**Production status:** The default disclaimer is not considered finally production-approved until Legal / Management provides written confirmation.

### 23.2 Generator UI — Disclaimer Field Behaviour

The disclaimer field in the future generator UI is **not a normal employee customization field**. It is an advanced / exception field.

| Behaviour | Specification |
|---|---|
| Default state | Disclaimer block is **collapsed** — not visible to the employee by default |
| Reveal control | A button labelled **"Disclaimer"** or **"Show / Edit disclaimer"** expands the disclaimer section |
| Field type | Textarea, pre-filled with the standard disclaimer text |
| Warning | A clearly visible note must appear next to the field: _"Disclaimer changes require Legal / Management approval. Do not modify for standard use."_ |
| Reset control | A **"Reset to default disclaimer"** button restores the standard text if the employee has modified it |
| Intended users | IT administrators or Management only — not regular employees |
| Default for employees | The default disclaimer remains unchanged for all standard employee signatures |

### 23.3 Rationale

The disclaimer contains legally significant language. Allowing employees to freely edit it by default would create compliance risk. Collapsing the field by default prevents accidental changes while keeping the option available for exceptional cases (e.g., a specific team or department requiring a different disclaimer approved by Legal).

---

## 24. Temporary GitHub Pages Image Hosting (Gmail Testing)

### 24.1 Purpose

Gmail cannot load local relative image paths. To test the signature in Gmail, all images
must be served from public HTTPS URLs. GitHub Pages is used as a temporary hosting solution
for this purpose only.

**This is not production hosting.** Production must use company-controlled HTTPS hosting
(e.g., `https://assets.cdc.company/signature/`).

### 24.2 GitHub Pages Setup

| Property | Value |
|---|---|
| Repository | `https://github.com/Petrikin83/cdc-premium-signature-prototype` |
| Pages base URL | `https://petrikin83.github.io/cdc-premium-signature-prototype/` |
| Asset base path | `public/signature-assets/` |
| Pages source | Branch: `main`, Folder: `/` (root) |
| Setup required | Enable in GitHub repo Settings → Pages if not already active |

### 24.3 Public Asset Files

| File | Source | Public URL |
|---|---|---|
| `logo-cdc-badge.png` | `Assets/logo-cdc-badge.png` (copy) | `…/public/signature-assets/logo-cdc-badge.png` |
| `award-banner.png` | `Assets/award-banner.png` (copy) | `…/public/signature-assets/award-banner.png` |
| `icon-phone.png` | Exported from `Assets/icon-phone.svg` at 56×56 px | `…/public/signature-assets/icon-phone.png` |
| `icon-email.png` | Exported from `Assets/icon-email.svg` at 56×56 px | `…/public/signature-assets/icon-email.png` |
| `icon-web.png` | Exported from `Assets/icon-web.svg` at 56×56 px | `…/public/signature-assets/icon-web.png` |

### 24.4 Prototype Files

| File | Purpose | Status |
|---|---|---|
| `Prototypes/gmail-signature-github-pages-balanced-compact-logo-v3.html` | **Current approved Gmail candidate** — 580 px · logo 104 px · award 184 px · floating divider · Anna Semenova | ✅ Approved |
| `Prototypes/gmail-signature-long-name-stress-test.html` | **Long-name validation** — 6 name/title combinations tested against v3 layout | ✅ Kept for QA |
| `public/index.html` | Asset verification page — confirms all public images load correctly | Unchanged |

**Note — obsolete variants removed 2026-05-15:**
The following visual prototype variants were removed from the working tree after approval of v3.
They remain available in git history if needed.

- `Prototypes/gmail-signature.html` (original browser baseline)
- `Prototypes/gmail-signature-github-pages-test.html` (640 px full-size test)
- `Prototypes/gmail-signature-github-pages-compact.html` (600 px compact)
- `Prototypes/gmail-signature-github-pages-optimized-compact.html` (560 px)
- `Prototypes/gmail-signature-github-pages-balanced-compact-logo.html` (v1, 580 px, logo 90 px)
- `Prototypes/gmail-signature-github-pages-balanced-compact-logo-v2.html` (v2, 580 px, logo 104 px, full-height separator)

### 24.5 Icon PNG Export Notes

- Source: v1 outline SVG icons (`Assets/icon-phone.svg`, `icon-email.svg`, `icon-web.svg`)
- Exported using `@resvg/resvg-js` at 56×56 px with transparent background
- Displayed in signature at 30×30 px (scaled by `<img width="30" height="30">`)
- SVG originals remain the master/source format in `Assets/`
- Do not modify the exported PNGs directly — re-export from SVG if changes are needed

### 24.6 Tilda Temporary Hosting (Next Testing Phase)

As an intermediate step between GitHub Pages and final company-controlled hosting,
image assets will be uploaded to Tilda's asset hosting for Gmail testing.

| Property | Value |
|---|---|
| Purpose | Real Gmail deliverability test before committing to permanent production hosting |
| Scope | Temporary only — same constraints as GitHub Pages (not company-controlled) |
| Files to upload | `logo-cdc-badge.png`, `award-banner.png`, `icon-phone.png`, `icon-email.png`, `icon-web.png` |
| Action required | Update `<img src>` URLs in v3 prototype to point to Tilda HTTPS URLs |
| Cleanup | Remove Tilda URLs and switch to production hosting when company server is ready |
| Production hosting | Must still be company-controlled HTTPS (e.g., `https://assets.cdc.company/signature/`) |

---

### 24.7 Production Hosting Checklist (Future)

When moving from GitHub Pages to production hosting:

- [ ] Upload all PNGs and the badge logo to `https://assets.cdc.company/signature/` (or equivalent)
- [ ] Update all `<img src>` URLs in the generator output to point to production HTTPS URLs
- [ ] Remove or archive `public/signature-assets/` from the repo (no longer needed)
- [ ] Test in Gmail after updating URLs
- [ ] Confirm FT/Statista legal approval before publishing award banner publicly

---

*End of document — Version 1.7 — 2026-05-15*
*v1.1 changes: Added confirmed CDC logo assets (logo-cdc-badge.png as main, logo-cdc-wordmark.png as backup); resolved open question #2; updated folder structure, asset table, Phase 1 checklist, and color analysis section references.*
*v1.2 changes: Added Section 22 — Icon System Decision; documented v1 approval and v2/v3 rejection rationale.*
*v1.3 changes: Cleaned up all stale icon references throughout the document (Sections 2, 4, 5, 6.3, 7.2, 7.4, 19); updated icon status to reflect v1 SVGs approved and PNG export as production-only step; removed reference to v2/v3 files (deleted); corrected icon style spec in Section 7.2 from solid-circle to v1 outline.*
*v1.4 changes: Recorded company name display decision (Section 2 rows 5/5a) — visible identity block uses "Cableway Development Company", legal disclaimer uses full "CDC Cableway Development Company and its affiliates"; updated Section 10.2 typography to Phase 2 prototype values (name 25px, title 15px, company 15px, contact 14px, disclaimer 11px/1.5lh); updated Section 10.3 widths to 640px layout; updated Section 10.4 spacing.*
*v1.5 changes: Added Section 23 — Disclaimer Strategy; documented default disclaimer text, generator UI disclaimer field behaviour (collapsed by default, advanced/exception field, reset control, legal warning), and production-approval status.*
*v1.6 changes: Added Section 24 — Temporary GitHub Pages Image Hosting; documented public asset structure, GitHub Pages setup, PNG export notes, prototype file roles, and production hosting checklist.*
*v1.7 changes: Updated Section 24.4 — approved Gmail candidate is now Prototypes/gmail-signature-github-pages-balanced-compact-logo-v3.html; long-name validation file kept as Prototypes/gmail-signature-long-name-stress-test.html; 6 obsolete prototype variants removed from working tree (preserved in git history); added Section 24.6 — Tilda temporary hosting plan as intermediate step before company-controlled production hosting.*
