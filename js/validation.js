const CDC_VALIDATION = {
  trimField(val) {
    return String(val).trim().replace(/\s{2,}/g, ' ');
  },

  validateName(val, label) {
    const v = this.trimField(val);
    if (!v) return { valid: false, error: `${label} is required.` };
    if (v.includes('@')) return { valid: false, error: `${label} must not contain an email address.` };
    if (/\d{7,}/.test(v.replace(/[\s\-\(\)\.]/g, ''))) {
      return { valid: false, error: `${label} must not contain a phone number.` };
    }
    return { valid: true, value: v };
  },

  validateJobTitle(val) {
    const v = this.trimField(val);
    if (!v) return { valid: false, error: 'Job title is required.' };
    return { valid: true, value: v };
  },

  validatePhone(val) {
    const v = String(val).trim();
    if (!v) return { valid: false, error: 'Phone is required.' };
    const hasPlus = v.startsWith('+');
    const digits = v.replace(/\D/g, '');
    if (!digits) return { valid: false, error: 'Phone must contain digits.' };
    const telHref = hasPlus ? `tel:+${digits}` : `tel:${digits}`;
    return { valid: true, value: v, telHref };
  },

  validateEmail(val) {
    const v = String(val).trim();
    if (!v) return { valid: false, error: 'Email is required.' };
    const parts = v.split('@');
    if (parts.length !== 2 || !parts[0] || !parts[1] || !parts[1].includes('.')) {
      return { valid: false, error: 'Please enter a valid email address.' };
    }
    return { valid: true, value: v };
  },

  validateWebsite(val) {
    const raw = String(val).trim() || CDC_CONFIG.brand.websiteDefault;
    const display = raw.replace(/^https?:\/\//i, '');
    if (!display) return { valid: false, error: 'Website is required.' };
    const href = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
    return { valid: true, value: raw, display, href };
  },

  validateAddress(val) {
    const v = this.trimField(String(val));
    if (!v) return { valid: true, value: '' };
    if (v.length > 80) {
      return { valid: true, value: v, warning: 'Address is long — consider keeping it under 80 characters.' };
    }
    return { valid: true, value: v };
  },

  // Font-size logic per implementation plan Section 4.2
  nameFontSize(fullName) {
    const len = fullName.length;
    if (len <= 22) return { size: 21, warning: null };
    if (len <= 30) return { size: 20, warning: 'Long name — may wrap in some email clients.' };
    return { size: 19, warning: 'This name may wrap to two lines in some email clients.' };
  },

  // Font-size logic per implementation plan Section 5
  titleFontSize(title) {
    const len = title.length;
    if (len <= 32) return { size: 13, warning: null };
    if (len <= 42) return { size: 13, warning: 'Long title — may wrap in the signature.' };
    return { size: 12, warning: 'Very long title — consider abbreviating.' };
  },
};
