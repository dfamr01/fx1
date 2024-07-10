import { v4 } from "uuid";
import Compressor from "compressorjs";
import { isPossiblePhoneNumber, isValidPhoneNumber } from "libphonenumber-js";

export function OpenWhatsapp(phoneNumber, encodedText) {
  window.open(`https://wa.me/${phoneNumber}?text=${encodedText}`, "_blank");
}

export function hasError(errors = {}) {
  const flag = !!Object.values(errors).filter((el) => el).length;

  return flag;
}

let debouncer = null;

export function debounceFunction(fn = () => {}, wait = 500, debounceRef) {
  if (debounceRef) {
    if (debounceRef.debouncer) {
      clearTimeout(debounceRef.debouncer);
      debounceRef.debouncer = setTimeout(fn, wait);
    }
  } else {
    if (debouncer) {
      clearTimeout(debouncer);
    }
    debouncer = setTimeout(fn, wait);
  }
}

export function getUUID(maxCharsUUID) {
  if (maxCharsUUID) {
    return v4().substring(0, maxCharsUUID);
  }
  return v4();
}

export function prefixUUID(str, maxCharsUUID) {
  return `${getUUID(maxCharsUUID)}_${str}`;
}

export function prefixTimeStampAndUUID(str, maxCharsUUID) {
  return `${Date.now()}_${prefixUUID(str, maxCharsUUID)}`;
}

export async function getCompressImage({
  file,
  maxWidth,
  maxHeight,
  quality = 0.92,
}) {
  return new Promise((resolve, reject) => {
    new Compressor(file, {
      ...{
        maxWidth,
        maxHeight,
        quality,
      },
      checkOrientation: false,

      // The compression process is asynchronous,
      // which means you have to access the `result` in the `success` hook function.
      success(result) {
        resolve(result);
      },
      error(err) {
        reject(err);
      },
    });
  });
}

export const isDevelopmentEnv = !!import.meta.env.DEV;

export const validator = {
  isValidEmail: (email) => {
    if (!email) {
      return false;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailPattern.test(email);
  },
  isPhoneValid: (phoneInput) => {
    let phone = phoneInput;
    if (!phone) {
      return false;
    }

    if (phone[0] != "+") {
      phone = "+" + phone;
    }

    const isValid =
      phone && isPossiblePhoneNumber(phone) && isValidPhoneNumber(phone);
    return isValid;
  },
  isEnglish: (input) => {
    if (!input) {
      return true;
    }
    var regex = new RegExp("^[a-zA-Z0-9]+$");
    if (regex.test(input)) {
      return true;
    }
    return false;
  },
};

/**
 * Generates a shareable profile URL for a given SUID (Shareable User ID).
 *
 * @param {string} suid - The Shareable User ID.
 * @param {boolean} [fullPath=true] - Whether to include the full URL path (including origin) or not.
 * @returns {string} The shareable profile URL.
 */
export function getShareProfileUrl(suid, fullPath = true) {
  const prefix = fullPath ? window.location.origin : "";
  return `${prefix}/createAccount?agentId=${suid}`;
}

export function getTransactionUrl(id, agentRecipient, fullPath = true) {
  const prefix = fullPath ? window.location.origin : "";
  const prefixClientAgent = agentRecipient ? `agent` : `client`;
  return `${prefix}/${prefixClientAgent}?transactionId=${id}`;
}

// dont allow non numeric input
export function validateNumericInput(onChange) {
  const validate = (e) => {
    const {
      target: { name, value },
    } = e;
    if (value?.length) {
      const lastChar = +value[value.length - 1];

      if (isNaN(lastChar)) {
        return false;
      }
    }

    onChange(e);
    return true;
  };
  return validate;
}

export async function sleep(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

export function isArraysEqual(array1, array2) {
  if (array1.length === array2.length) {
    return array1.every((element) => {
      if (array2.includes(element)) {
        return true;
      }

      return false;
    });
  }

  return false;
}

export function appendSignal(signal, key, value) {
  signal.value = {
    ...signal.value,
    [key]: value,
  };
}
