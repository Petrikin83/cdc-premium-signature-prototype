function _esc(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function _phoneDisplay(phone) {
  // Escape first, then replace spaces with non-breaking spaces (prevents line breaks within number)
  return _esc(phone).replace(/ /g, '&nbsp;');
}

function buildGmailSignature(data) {
  const {
    firstName, lastName, jobTitle, phone, email,
    officeAddress, disclaimerText,
    nameFontSize, titleFontSize,
    telHref, websiteDisplay, websiteHref,
  } = data;

  const fullName = `${firstName} ${lastName}`;

  const addressRow = officeAddress ? `
      <tr>
        <td colspan="6" bgcolor="#ffffff"
            style="background-color: #ffffff; padding: 6px 0 10px 0;">
          <span style="font-family: Arial, Helvetica, sans-serif; font-size: 10.5px;
                       font-weight: 600; color: #555555; line-height: 1.35;">Office:</span><span style="font-family: Arial, Helvetica, sans-serif; font-size: 10.5px;
                       font-weight: 400; color: #666666; line-height: 1.35;"> ${_esc(officeAddress)}</span>
        </td>
      </tr>` : '';

  return `<table width="580" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff"
       style="border-collapse: collapse; table-layout: fixed; background-color: #ffffff;">

  <!-- Column widths: 104 + 18 + 259 + 1 + 14 + 184 = 580 px -->
  <tr>

    <!-- CDC badge logo — 104 px -->
    <td width="104" valign="middle" bgcolor="#ffffff"
        style="background-color: #ffffff; padding: 14px 0 14px 0; vertical-align: middle;">
      <img src="${CDC_CONFIG.assets.logo}"
           width="104"
           alt="CDC"
           style="display: block; border: 0; height: auto;">
    </td>

    <!-- Spacer — 18 px -->
    <td width="18" bgcolor="#ffffff" style="background-color: #ffffff;"></td>

    <!-- Identity: Name · Title · Company -->
    <td width="259" valign="middle" bgcolor="#ffffff"
        style="background-color: #ffffff; padding: 14px 0 14px 0; vertical-align: middle;">
      <p style="font-family: Arial, Helvetica, sans-serif; font-size: ${nameFontSize}px;
                font-weight: 700; color: #1a1a2e; line-height: 1.15; margin: 0 0 5px 0;">
        ${_esc(fullName)}
      </p>
      <p style="font-family: Arial, Helvetica, sans-serif; font-size: ${titleFontSize}px;
                font-weight: 400; color: #555555; line-height: 1.3; margin: 0 0 3px 0;">
        ${_esc(jobTitle)}
      </p>
      <p style="font-family: Arial, Helvetica, sans-serif; font-size: 13px;
                font-weight: 600; color: #F16623; line-height: 1.3; margin: 0;">
        ${_esc(CDC_CONFIG.brand.companyDisplay)}
      </p>
    </td>

    <!-- Vertical separator — floating 64 px line, vertically centered -->
    <td width="1" valign="middle" bgcolor="#ffffff"
        style="background-color: #ffffff; padding: 0; font-size: 0; line-height: 0; vertical-align: middle;">
      <table width="1" cellpadding="0" cellspacing="0" border="0"
             style="border-collapse: collapse;">
        <tr>
          <td width="1" height="64" bgcolor="#eeeeee"
              style="background-color: #eeeeee; font-size: 0; line-height: 0;
                     width: 1px; height: 64px;"></td>
        </tr>
      </table>
    </td>

    <!-- Spacer — 14 px -->
    <td width="14" bgcolor="#ffffff" style="background-color: #ffffff;"></td>

    <!-- Award banner — 184 px -->
    <td width="184" valign="middle" bgcolor="#ffffff"
        style="background-color: #ffffff; padding: 14px 0 14px 0; vertical-align: middle;">
      <img src="${CDC_CONFIG.assets.award}"
           width="184"
           alt="Financial Times · 1000 Europe&#39;s Fastest Growing Companies 2025 · Ranked 3rd in Europe"
           style="display: block; border: 0; height: auto; max-width: 184px;">
    </td>

  </tr>

  <!-- Horizontal divider -->
  <tr>
    <td colspan="6" height="1" bgcolor="#e0e0e0"
        style="height: 1px; background-color: #e0e0e0; font-size: 1px; line-height: 1px;"></td>
  </tr>

  <!-- Contact grid B2: 2×2, no divider -->
  <tr>
    <td colspan="6" bgcolor="#ffffff"
        style="background-color: #ffffff; padding: 10px 0;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0"
             style="border-collapse: collapse;">
        <!-- Row 1: phone | email -->
        <tr>
          <td valign="middle"
              style="padding: 0 32px 8px 0; vertical-align: middle; white-space: nowrap;">
            <img src="${CDC_CONFIG.assets.phone}"
                 width="24" height="24" alt="Phone"
                 style="display: inline-block; vertical-align: middle; border: 0;"><a
              href="${_esc(telHref)}"
              style="font-family: Arial, Helvetica, sans-serif; font-size: 13px;
                     font-weight: 400; color: #333333; text-decoration: none;
                     vertical-align: middle; margin-left: 6px; display: inline-block;
                     white-space: nowrap;"
            >${_phoneDisplay(phone)}</a>
          </td>
          <td valign="middle"
              style="padding: 0 0 8px 0; vertical-align: middle; white-space: nowrap;">
            <img src="${CDC_CONFIG.assets.email}"
                 width="24" height="24" alt="Email"
                 style="display: inline-block; vertical-align: middle; border: 0;"><a
              href="mailto:${_esc(email)}"
              style="font-family: Arial, Helvetica, sans-serif; font-size: 13px;
                     font-weight: 400; color: #333333; text-decoration: none;
                     vertical-align: middle; margin-left: 6px; display: inline-block;
                     white-space: nowrap;"
            >${_esc(email)}</a>
          </td>
        </tr>
        <!-- Row 2: corporate address | website -->
        <tr>
          <td valign="middle"
              style="padding: 0 32px 0 0; vertical-align: middle; white-space: nowrap;">
            <img src="${CDC_CONFIG.assets.location}"
                 width="24" height="24" alt="Location"
                 style="display: inline-block; vertical-align: middle; border: 0;"><span
              style="font-family: Arial, Helvetica, sans-serif; font-size: 13px;
                     font-weight: 400; color: #555555; vertical-align: middle;
                     margin-left: 6px; display: inline-block; white-space: nowrap;"
            >${_esc(CDC_CONFIG.brand.corporateAddress)}</span>
          </td>
          <td valign="middle"
              style="padding: 0; vertical-align: middle; white-space: nowrap;">
            <img src="${CDC_CONFIG.assets.web}"
                 width="24" height="24" alt="Website"
                 style="display: inline-block; vertical-align: middle; border: 0;"><a
              href="${_esc(websiteHref)}"
              style="font-family: Arial, Helvetica, sans-serif; font-size: 13px;
                     font-weight: 400; color: #333333; text-decoration: none;
                     vertical-align: middle; margin-left: 6px; display: inline-block;
                     white-space: nowrap;"
            >${_esc(websiteDisplay)}</a>
          </td>
        </tr>
      </table>
    </td>
  </tr>
${addressRow}
  <!-- Horizontal divider -->
  <tr>
    <td colspan="6" height="1" bgcolor="#e0e0e0"
        style="height: 1px; background-color: #e0e0e0; font-size: 1px; line-height: 1px;"></td>
  </tr>

  <!-- Legal disclaimer -->
  <tr>
    <td colspan="6" bgcolor="#ffffff"
        style="background-color: #ffffff; padding: 9px 0 14px 0;">
      <span style="font-family: Arial, Helvetica, sans-serif; font-size: 10px;
                   font-weight: 400; color: #666666; line-height: 1.45; display: block;">
        ${_esc(disclaimerText)}
      </span>
    </td>
  </tr>

</table>`;
}
