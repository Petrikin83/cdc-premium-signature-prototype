(function () {
  'use strict';

  const $ = id => document.getElementById(id);

  // ── DOM references ──────────────────────────────────────────────────────────
  const fields = {
    firstName:  $('first-name'),
    lastName:   $('last-name'),
    jobTitle:   $('job-title'),
    phone:      $('phone'),
    email:      $('email'),
    website:    $('website'),
    officeAddr: $('office-address'),
    disclaimer: $('disclaimer-text'),
  };

  const errorEls = {
    firstName: $('first-name-error'),
    lastName:  $('last-name-error'),
    jobTitle:  $('job-title-error'),
    phone:     $('phone-error'),
    email:     $('email-error'),
    website:   $('website-error'),
  };

  const previewFrame     = $('preview-frame');
  const previewWarnings  = $('preview-warnings');
  const copyBtn          = $('copy-btn');
  const appleBtn         = $('apple-btn');
  const resetBtn         = $('reset-btn');
  const disclaimerToggle  = $('disclaimer-toggle');
  const disclaimerSection = $('disclaimer-section');
  const disclaimerReset   = $('disclaimer-reset');
  const addressToggle    = $('address-toggle');
  const addressSection   = $('address-section');
  const addressWarning   = $('address-warning');
  const copyFallback     = $('copy-fallback');
  const fallbackHtml     = $('fallback-html');

  let currentSignatureHtml = '';
  let currentAppleHtml     = '';
  const touched = new Set(); // required fields the user has blurred
  let validateAll = false;   // true after copy is clicked

  // ── Init ───────────────────────────────────────────────────────────────────
  function init() {
    fields.website.value    = CDC_CONFIG.brand.websiteDefault;
    fields.disclaimer.value = CDC_CONFIG.disclaimer.default;

    Object.values(fields).forEach(el => {
      if (el) el.addEventListener('input', render);
    });

    copyBtn.addEventListener('click', copySignature);
    appleBtn.addEventListener('click', copyAppleMail);
    resetBtn.addEventListener('click', resetForm);
    disclaimerToggle.addEventListener('click', toggleDisclaimer);
    disclaimerReset.addEventListener('click', resetDisclaimer);
    addressToggle.addEventListener('click', toggleAddress);

    // Blur listeners — mark field touched so its error becomes visible
    Object.keys(errorEls).forEach(key => {
      if (fields[key]) {
        fields[key].addEventListener('blur', () => { touched.add(key); render(); });
      }
    });

    render();
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  function render() {
    const warnings = {};
    const errs     = {};

    // Names
    const fnRes = CDC_VALIDATION.validateName(fields.firstName.value, 'First name');
    const lnRes = CDC_VALIDATION.validateName(fields.lastName.value, 'Last name');
    if (!fnRes.valid) errs.firstName = fnRes.error;
    if (!lnRes.valid) errs.lastName  = lnRes.error;

    const firstName = fnRes.valid ? fnRes.value : (CDC_VALIDATION.trimField(fields.firstName.value) || 'First');
    const lastName  = lnRes.valid ? lnRes.value  : (CDC_VALIDATION.trimField(fields.lastName.value)  || 'Name');
    const fullName  = `${firstName} ${lastName}`;

    const nameSizing = CDC_VALIDATION.nameFontSize(fullName);
    if (nameSizing.warning) warnings.name = nameSizing.warning;

    // Job title
    const titleRes  = CDC_VALIDATION.validateJobTitle(fields.jobTitle.value);
    const titleText = titleRes.valid ? titleRes.value : (CDC_VALIDATION.trimField(fields.jobTitle.value) || 'Job Title');
    if (!titleRes.valid) errs.jobTitle = titleRes.error;

    const titleSizing = CDC_VALIDATION.titleFontSize(titleText);
    if (titleSizing.warning) warnings.title = titleSizing.warning;

    // Phone
    const phoneRes = CDC_VALIDATION.validatePhone(fields.phone.value);
    if (!phoneRes.valid) errs.phone = phoneRes.error;

    // Email
    const emailRes = CDC_VALIDATION.validateEmail(fields.email.value);
    if (!emailRes.valid) errs.email = emailRes.error;

    // Website
    const webRes = CDC_VALIDATION.validateWebsite(fields.website.value);
    if (!webRes.valid) errs.website = webRes.error;

    // Address
    const addrRes = CDC_VALIDATION.validateAddress(fields.officeAddr.value);
    if (addressWarning) addressWarning.textContent = addrRes.warning || '';

    // Update field errors — only for touched fields or after copy is attempted
    Object.keys(errorEls).forEach(key => {
      if (!errorEls[key]) return;
      errorEls[key].textContent = (validateAll || touched.has(key)) ? (errs[key] || '') : '';
    });

    // Build template data — use safe fallbacks so preview always renders
    const data = {
      firstName,
      lastName,
      jobTitle:       titleText,
      phone:          phoneRes.valid ? phoneRes.value : (fields.phone.value.trim() || '+971 50 000 00 00'),
      email:          emailRes.valid ? emailRes.value : (fields.email.value.trim() || 'name@cdc.company'),
      resolvedAddress: addrRes.value || CDC_CONFIG.brand.corporateAddress,
      disclaimerText: fields.disclaimer.value.trim() || CDC_CONFIG.disclaimer.default,
      nameFontSize:   nameSizing.size,
      titleFontSize:  titleSizing.size,
      telHref:        phoneRes.valid ? phoneRes.telHref : 'tel:+971500000000',
      websiteDisplay: webRes.valid ? webRes.display : CDC_CONFIG.brand.websiteDefault,
      websiteHref:    webRes.valid ? webRes.href    : `https://${CDC_CONFIG.brand.websiteDefault}`,
    };

    currentSignatureHtml = buildGmailSignature(data);
    currentAppleHtml     = buildAppleMailSignature(data);
    updatePreview(currentSignatureHtml);
    updateWarnings(Object.values(warnings));
  }

  function updatePreview(html) {
    const doc =
      '<!DOCTYPE html><html><head><meta charset="UTF-8">' +
      '<style>body{margin:0;padding:20px;background:#efefef;}</style>' +
      '</head><body>' + html + '</body></html>';
    try {
      const iDoc = previewFrame.contentWindow.document;
      iDoc.open();
      iDoc.write(doc);
      iDoc.close();
    } catch (e) {
      previewFrame.srcdoc = doc;
    }
    setTimeout(resizeFrame, 120);
    setTimeout(resizeFrame, 700);
  }

  function resizeFrame() {
    try {
      const body = previewFrame.contentWindow.document.body;
      if (body && body.scrollHeight > 0) {
        previewFrame.style.height = (body.scrollHeight + 40) + 'px';
      }
    } catch (e) {}
  }

  function updateWarnings(list) {
    previewWarnings.innerHTML = '';
    list.forEach(w => {
      const el = document.createElement('div');
      el.className = 'preview-warning-msg';
      el.textContent = w;
      previewWarnings.appendChild(el);
    });
  }

  // ── Copy ───────────────────────────────────────────────────────────────────
  async function copySignature() {
    validateAll = true;
    render(); // surface all field errors before copying
    if (!currentSignatureHtml) return;
    try {
      await copyModern(currentSignatureHtml);
    } catch (e) {
      try {
        copyLegacy(currentSignatureHtml);
      } catch (e2) {
        showFallback(currentSignatureHtml);
        return;
      }
    }
    showCopied();
  }

  async function copyModern(html) {
    const blob = new Blob([html], { type: 'text/html' });
    await navigator.clipboard.write([new ClipboardItem({ 'text/html': blob })]);
  }

  function copyLegacy(html) {
    const container = document.createElement('div');
    container.innerHTML = html;
    container.style.cssText = 'position:fixed;pointer-events:none;opacity:0;left:0;top:0;';
    document.body.appendChild(container);
    const range = document.createRange();
    range.selectNodeContents(container);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
    const ok = document.execCommand('copy');
    sel.removeAllRanges();
    document.body.removeChild(container);
    if (!ok) throw new Error('execCommand failed');
  }

  function showFallback(html) {
    copyFallback.hidden = false;
    fallbackHtml.value = html;
    fallbackHtml.focus();
    fallbackHtml.select();
  }

  function showCopied() {
    copyFallback.hidden = true;
    const orig = copyBtn.textContent;
    copyBtn.textContent = '✓ Copied!';
    copyBtn.classList.add('btn--copied');
    setTimeout(() => {
      copyBtn.textContent = orig;
      copyBtn.classList.remove('btn--copied');
    }, 2000);
  }

  // ── Apple Mail copy ────────────────────────────────────────────────────────
  async function copyAppleMail() {
    validateAll = true;
    render();
    if (!currentAppleHtml) return;
    try {
      await copyModern(currentAppleHtml);
    } catch (e) {
      try {
        copyLegacy(currentAppleHtml);
      } catch (e2) {
        showFallback(currentAppleHtml);
        return;
      }
    }
    showAppleCopied();
  }

  function showAppleCopied() {
    copyFallback.hidden = true;
    const orig = appleBtn.textContent;
    appleBtn.textContent = '✓ Copied for Apple Mail!';
    appleBtn.style.background = '#2a7a2a';
    appleBtn.style.color = '#fff';
    setTimeout(() => {
      appleBtn.textContent = orig;
      appleBtn.style.background = '';
      appleBtn.style.color = '';
    }, 2000);
  }

  // ── Reset ──────────────────────────────────────────────────────────────────
  function resetForm() {
    fields.firstName.value  = '';
    fields.lastName.value   = '';
    fields.jobTitle.value   = '';
    fields.phone.value      = '';
    fields.email.value      = '';
    fields.website.value    = CDC_CONFIG.brand.websiteDefault;
    fields.officeAddr.value = '';
    fields.disclaimer.value = CDC_CONFIG.disclaimer.default;

    collapseSection(addressSection, addressToggle);
    collapseSection(disclaimerSection, disclaimerToggle);

    touched.clear();
    validateAll = false;

    Object.values(errorEls).forEach(el => { if (el) el.textContent = ''; });
    if (addressWarning) addressWarning.textContent = '';
    copyFallback.hidden = true;

    render();
  }

  // ── Disclaimer ─────────────────────────────────────────────────────────────
  function toggleDisclaimer() {
    if (disclaimerSection.hidden) {
      expandSection(disclaimerSection, disclaimerToggle);
    } else {
      collapseSection(disclaimerSection, disclaimerToggle);
    }
  }

  function resetDisclaimer() {
    fields.disclaimer.value = CDC_CONFIG.disclaimer.default;
    render();
  }

  // ── Address ────────────────────────────────────────────────────────────────
  function toggleAddress() {
    if (addressSection.hidden) {
      expandSection(addressSection, addressToggle);
    } else {
      collapseSection(addressSection, addressToggle);
    }
  }

  // ── Section helpers ────────────────────────────────────────────────────────
  function expandSection(section, btn) {
    section.hidden = false;
    btn.setAttribute('aria-expanded', 'true');
  }

  function collapseSection(section, btn) {
    section.hidden = true;
    btn.setAttribute('aria-expanded', 'false');
  }

  // ── Start ──────────────────────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', init);
}());
