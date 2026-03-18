export const toDigitsOnly = (value: string) => value.replace(/\D/g, "");

export const formatPhoneNumber = (value: string) => {
  const digits = toDigitsOnly(value).slice(0, 11);

  if (digits.length < 4) {
    return digits;
  }

  if (digits.length < 8) {
    return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  }

  if (digits.length === 10) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
  }

  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
};

export const isValidBirthSix = (value: string) => /^\d{6}$/.test(value);

export const isValidRrnDigit = (value: string) => /^[1-8]$/.test(value);

export const toBirthDate = (birthSix: string) => {
  if (!isValidBirthSix(birthSix)) {
    return "";
  }

  return `${birthSix.slice(0, 2)}-${birthSix.slice(2, 4)}-${birthSix.slice(4, 6)}`;
};

export const deriveGenderFromRrnDigit = (value: string) => {
  if (value === "1" || value === "3" || value === "5" || value === "7") {
    return "M";
  }

  if (value === "2" || value === "4" || value === "6" || value === "8") {
    return "F";
  }

  return "";
};
