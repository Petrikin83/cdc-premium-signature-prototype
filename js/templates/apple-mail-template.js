function buildAppleMailSignature(data) {
  const {
    firstName, lastName, jobTitle, phone, email,
    officeAddress, disclaimerText,
    nameFontSize, titleFontSize,
    telHref, websiteDisplay, websiteHref,
  } = data;

  const fullName = `${firstName} ${lastName}`;

  const addressRow = officeAddress ? `
      <tr>
        <td colspan="3" bgcolor="#ffffff"
            style="background-color: #ffffff; padding: 4px 0 8px 0;">
          <span style="font-family: Arial, Helvetica, sans-serif; font-size: 10.5px;
                       font-weight: 600; color: #555555; line-height: 1.35;
                       background-color: #ffffff;">Office:</span><span
            style="font-family: Arial, Helvetica, sans-serif; font-size: 10.5px;
                   font-weight: 400; color: #666666; line-height: 1.35;
                   background-color: #ffffff;"> ${_esc(officeAddress)}</span>
        </td>
      </tr>` : '';

  return `<style>
  * { -webkit-text-size-adjust: 100% !important; }
  :root { color-scheme: light; supported-color-schemes: light; }
</style>
<table width="340" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff"
     style="border-collapse: collapse; table-layout: fixed;
            width: 340px; max-width: 340px; background-color: #ffffff;">

  <!-- Column widths: 92 + 12 + 236 = 340 px -->

  <!-- Logo + Identity row -->
  <tr>

    <!-- CDC badge logo — 92 px -->
    <td width="92" valign="middle" bgcolor="#ffffff"
        style="background-color: #ffffff; padding: 12px 0 12px 0; vertical-align: middle;">
      <img src="${CDC_CONFIG.assets.logo}"
           width="92"
           alt="CDC"
           style="display: block; border: 0; height: auto; width: 92px;">
    </td>

    <!-- Spacer — 12 px -->
    <td width="12" bgcolor="#ffffff" style="background-color: #ffffff;"></td>

    <!-- Identity: Name · Title · Company — 236 px -->
    <td width="236" valign="middle" bgcolor="#ffffff"
        style="background-color: #ffffff; padding: 12px 0 12px 0; vertical-align: middle;">
      <p style="font-family: Arial, Helvetica, sans-serif; font-size: ${nameFontSize}px;
                font-weight: 700; color: #1a1a2e; line-height: 1.15; margin: 0 0 4px 0;
                background-color: #ffffff;">
        ${_esc(fullName)}
      </p>
      <p style="font-family: Arial, Helvetica, sans-serif; font-size: ${titleFontSize}px;
                font-weight: 400; color: #555555; line-height: 1.3; margin: 0 0 3px 0;
                background-color: #ffffff;">
        ${_esc(jobTitle)}
      </p>
      <p style="font-family: Arial, Helvetica, sans-serif; font-size: 13px;
                font-weight: 600; color: #F16623; line-height: 1.3; margin: 0;
                background-color: #ffffff;">
        ${_esc(CDC_CONFIG.brand.companyDisplay)}
      </p>
    </td>

  </tr>

  <!-- Horizontal divider -->
  <tr>
    <td colspan="3" height="1" bgcolor="#e0e0e0"
        style="height: 1px; background-color: #e0e0e0; font-size: 1px; line-height: 1px;"></td>
  </tr>

  <!-- Award banner row — 260px, left-aligned within 340px card -->
  <tr>
    <td colspan="3" bgcolor="#ffffff"
        style="background-color: #ffffff; padding: 9px 0 9px 0;">
      <img src="${CDC_CONFIG.assets.award}"
           width="260"
           alt="Financial Times · 1000 Europe&#39;s Fastest Growing Companies 2025 · Ranked 3rd in Europe"
           style="display: block; border: 0; height: auto; width: 260px; max-width: 260px;">
    </td>
  </tr>

  <!-- Horizontal divider -->
  <tr>
    <td colspan="3" height="1" bgcolor="#e0e0e0"
        style="height: 1px; background-color: #e0e0e0; font-size: 1px; line-height: 1px;"></td>
  </tr>

  <!-- Phone -->
  <tr>
    <td colspan="3" bgcolor="#ffffff"
        style="background-color: #ffffff; padding: 9px 0 3px 0; vertical-align: middle;">
      <img src="${CDC_CONFIG.assets.phone}"
           width="22" height="22" alt="Phone"
           style="display: inline-block; vertical-align: middle; border: 0;"><a
        href="${_esc(telHref)}"
        style="font-family: Arial, Helvetica, sans-serif; font-size: 13px;
               font-weight: 400; color: #333333 !important; text-decoration: none;
               vertical-align: middle; margin-left: 6px; display: inline-block;
               white-space: nowrap;"
      >${_phoneDisplay(phone)}</a>
    </td>
  </tr>

  <!-- Email -->
  <tr>
    <td colspan="3" bgcolor="#ffffff"
        style="background-color: #ffffff; padding: 3px 0; vertical-align: middle;">
      <img src="${CDC_CONFIG.assets.email}"
           width="22" height="22" alt="Email"
           style="display: inline-block; vertical-align: middle; border: 0;"><a
        href="mailto:${_esc(email)}"
        style="font-family: Arial, Helvetica, sans-serif; font-size: 13px;
               font-weight: 400; color: #333333 !important; text-decoration: none;
               vertical-align: middle; margin-left: 6px; display: inline-block;
               white-space: nowrap;"
      >${_esc(email)}</a>
    </td>
  </tr>

  <!-- Website -->
  <tr>
    <td colspan="3" bgcolor="#ffffff"
        style="background-color: #ffffff; padding: 3px 0 9px 0; vertical-align: middle;">
      <img src="${CDC_CONFIG.assets.web}"
           width="22" height="22" alt="Website"
           style="display: inline-block; vertical-align: middle; border: 0;"><a
        href="${_esc(websiteHref)}"
        style="font-family: Arial, Helvetica, sans-serif; font-size: 13px;
               font-weight: 400; color: #333333 !important; text-decoration: none;
               vertical-align: middle; margin-left: 6px; display: inline-block;
               white-space: nowrap;"
      >${_esc(websiteDisplay)}</a>
    </td>
  </tr>
${addressRow}
  <!-- Horizontal divider -->
  <tr>
    <td colspan="3" height="1" bgcolor="#e0e0e0"
        style="height: 1px; background-color: #e0e0e0; font-size: 1px; line-height: 1px;"></td>
  </tr>

  <!-- Legal disclaimer -->
  <tr>
    <td colspan="3" bgcolor="#ffffff"
        style="background-color: #ffffff; padding: 8px 0 12px 0;">
      <span style="font-family: Arial, Helvetica, sans-serif; font-size: 9.5px;
                   font-weight: 400; color: #666666; line-height: 1.45; display: block;
                   white-space: normal; overflow-wrap: break-word; word-break: normal;
                   background-color: #ffffff;">
        ${_esc(disclaimerText)}
      </span>
    </td>
  </tr>

</table>`;
}
