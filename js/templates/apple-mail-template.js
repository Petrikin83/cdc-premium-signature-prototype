function buildAppleMailSignature(data) {
  const {
    firstName, lastName, jobTitle, phone, email,
    resolvedAddress, disclaimerText,
    nameFontSize, titleFontSize,
    telHref, websiteDisplay, websiteHref,
  } = data;

  const fullName = `${firstName} ${lastName}`;

  return `<style>
  * { -webkit-text-size-adjust: 100% !important; }
  :root { color-scheme: light; supported-color-schemes: light; }
</style>
<table width="580" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff"
     style="border-collapse: collapse; table-layout: fixed; background-color: #ffffff;">

  <!-- Column widths: 104 + 18 + 259 + 1 + 14 + 184 = 580 px -->
  <tr>

    <!-- CDC badge logo — 104 px -->
    <td width="104" valign="middle" bgcolor="#ffffff"
        style="background-color: #ffffff; padding: 14px 0 14px 0; vertical-align: middle;">
      <img src="${CDC_CONFIG.assets.logo}"
           width="104"
           alt="CDC"
           style="display: block; border: 0; height: auto; width: 104px;">
    </td>

    <!-- Spacer — 18 px -->
    <td width="18" bgcolor="#ffffff" style="background-color: #ffffff;"></td>

    <!-- Identity: Name · Title · Company -->
    <td width="259" valign="middle" bgcolor="#ffffff"
        style="background-color: #ffffff; padding: 14px 0 14px 0; vertical-align: middle;">
      <p style="font-family: Arial, Helvetica, sans-serif; font-size: ${nameFontSize + 1}px;
                font-weight: 700; color: #1a1a2e; line-height: 1.15; margin: 0 0 5px 0;
                background-color: #ffffff;">
        ${_esc(fullName)}
      </p>
      <p style="font-family: Arial, Helvetica, sans-serif; font-size: ${titleFontSize + 1}px;
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

    <!-- Vertical separator — floating 64 px line, vertically centered -->
    <td width="1" valign="middle" bgcolor="#ffffff"
        style="background-color: #ffffff; padding: 0; font-size: 0; line-height: 0; vertical-align: middle;">
      <table width="1" cellpadding="0" cellspacing="0" border="0"
             style="border-collapse: collapse;">
        <tr>
          <td width="1" height="64" bgcolor="#ffffff"
              style="background-color: #ffffff; font-size: 0; line-height: 0;
                     width: 1px; height: 64px;"></td>
        </tr>
      </table>
    </td>

    <!-- Spacer — 14 px -->
    <td width="14" bgcolor="#ffffff" style="background-color: #ffffff;"></td>

    <!-- Award banner — 184 px -->
    <td width="184" valign="middle" bgcolor="#ffffff"
        style="background-color: #ffffff; padding: 14px 0 14px 0; vertical-align: middle;"></td>

  </tr>

  <!-- Horizontal divider -->
  <tr>
    <td colspan="6" height="1" bgcolor="#e0e0e0"
        style="height: 1px; background-color: #e0e0e0; font-size: 1px; line-height: 1px;"></td>
  </tr>

  <!-- Contact grid B2: 2×2, self-anchored 580 px -->
  <tr>
    <td colspan="6" bgcolor="#ffffff"
        style="background-color: #ffffff; padding: 10px 0;">
      <table width="580" cellpadding="0" cellspacing="0" border="0"
             style="border-collapse: collapse; table-layout: fixed;">
        <!-- Column anchors: 290 + 290 = 580 -->
        <tr>
          <td width="290" bgcolor="#ffffff" style="background-color: #ffffff; padding: 0; font-size: 0; line-height: 0;"></td>
          <td width="290" bgcolor="#ffffff" style="background-color: #ffffff; padding: 0; font-size: 0; line-height: 0;"></td>
        </tr>
        <!-- Row 1: phone | email -->
        <tr>
          <td width="290" valign="middle" bgcolor="#ffffff"
              style="background-color: #ffffff; padding: 0 32px 8px 0; vertical-align: middle; white-space: nowrap;">
            <nobr><img src="${CDC_CONFIG.assets.phone}"
                 width="24" height="24" alt="Phone"
                 style="display: inline-block; vertical-align: middle; border: 0;"><a
              href="${_esc(telHref)}"
              style="font-family: Arial, Helvetica, sans-serif; font-size: 13px;
                     font-weight: 400; color: #333333 !important; text-decoration: none;
                     vertical-align: middle; margin-left: 6px; display: inline-block;
                     white-space: nowrap; background-color: #ffffff;"
            >${_phoneDisplay(phone)}</a></nobr>
          </td>
          <td width="290" valign="middle" bgcolor="#ffffff"
              style="background-color: #ffffff; padding: 0 0 8px 0; vertical-align: middle; white-space: nowrap;">
            <nobr><img src="${CDC_CONFIG.assets.email}"
                 width="24" height="24" alt="Email"
                 style="display: inline-block; vertical-align: middle; border: 0;"><a
              href="mailto:${_esc(email)}"
              style="font-family: Arial, Helvetica, sans-serif; font-size: 13px;
                     font-weight: 400; color: #333333 !important; text-decoration: none;
                     vertical-align: middle; margin-left: 6px; display: inline-block;
                     white-space: nowrap; background-color: #ffffff;"
            >${_esc(email)}</a></nobr>
          </td>
        </tr>
        <!-- Row 2: corporate address | website -->
        <tr>
          <td width="290" valign="middle" bgcolor="#ffffff"
              style="background-color: #ffffff; padding: 0 32px 0 0; vertical-align: middle; white-space: nowrap;">
            <nobr><img src="${CDC_CONFIG.assets.location}"
                 width="24" height="24" alt="Location"
                 style="display: inline-block; vertical-align: middle; border: 0;"><span
              style="font-family: Arial, Helvetica, sans-serif; font-size: 13px;
                     font-weight: 400; color: #555555; vertical-align: middle;
                     margin-left: 6px; display: inline-block; white-space: nowrap;
                     background-color: #ffffff;"
            >${_esc(resolvedAddress).replace(/ /g, '&nbsp;')}</span></nobr>
          </td>
          <td width="290" valign="middle" bgcolor="#ffffff"
              style="background-color: #ffffff; padding: 0; vertical-align: middle; white-space: nowrap;">
            <nobr><img src="${CDC_CONFIG.assets.web}"
                 width="24" height="24" alt="Website"
                 style="display: inline-block; vertical-align: middle; border: 0;"><a
              href="${_esc(websiteHref)}"
              style="font-family: Arial, Helvetica, sans-serif; font-size: 13px;
                     font-weight: 400; color: #333333 !important; text-decoration: none;
                     vertical-align: middle; margin-left: 6px; display: inline-block;
                     white-space: nowrap; background-color: #ffffff;"
            >${_esc(websiteDisplay)}</a></nobr>
          </td>
        </tr>
      </table>
    </td>
  </tr>

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
                   font-weight: 400; color: #666666; line-height: 1.45; display: block;
                   white-space: normal; overflow-wrap: break-word; word-break: normal;
                   background-color: #ffffff;">
        ${_esc(disclaimerText)}
      </span>
    </td>
  </tr>

</table>`;
}
