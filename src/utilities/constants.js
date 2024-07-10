import dayjs from "dayjs";

import bitIcon from "../assets/static/withdrawIcons/bit.jpeg";
import payBoxIcon from "../assets/static/withdrawIcons/paybox.png";
import cashIcon from "../assets/static/withdrawIcons/cash.png";
import bankIcon from "../assets/static/withdrawIcons/bank.png";
import cryptoIcon from "../assets/static/withdrawIcons/crypto.png";

import dicont from "../assets/static/banksIcons/dicont.jpeg";
import leumi from "../assets/static/banksIcons/leumi.png";
// import marcantil from "../assets/static/banksIcons/marcantil.png";
import mizrahi from "../assets/static/banksIcons/mizrahi.png";
import poalim from "../assets/static/banksIcons/poalim.png";
import fibi from "../assets/static/banksIcons/fibi.jpg";

import { UNLIMITED } from "./currency.js";
import { getUUID } from "./utils";
import { getLocalTime } from "./date";

export const AGENT_TYPE = {
  id: "",
  avatar: "",
  firstName: "",
  lastName: "",
  nickName: "",
  phoneNumber: "",
  notificationSettings: {
    transactionsSms: true,
  },
  cryptoUSDTWallet: "",
  email: "",
  createAt: "",
};

export const DEPOSIT_OPTIONS_AVAILABLE = {
  CASH: {
    key: "CASH",
    isAvailable: true,
  },
  BANK_TRANSFER: {
    key: "BANK_TRANSFER",
    isAvailable: true,
  },
  BIT: {
    key: "BIT",
    isAvailable: true,
  },
  PAY_BOX: {
    key: "PAY_BOX",
    isAvailable: true,
  },
  CRYPTO: {
    key: "CRYPTO",
    isAvailable: true,
  },
};

// export const DEPOSIT_OPTIONS_AVAILABLE =[
//   "CASH",
//   "BANK_TRANSFER",
//   "BIT",
//   "PAY_BOX",
//   "CRYPTO",
// ]

export const DEPOSIT_OPTIONS_IMG = {
  CASH: {
    key: "CASH",
    iconImage: cashIcon,
  },
  BANK_TRANSFER: {
    key: "BANK_TRANSFER",
    iconImage: bankIcon,
  },
  BIT: {
    key: "BIT",
    iconImage: bitIcon,
  },
  PAY_BOX: {
    key: "PAY_BOX",
    iconImage: payBoxIcon,
  },
  CRYPTO: {
    key: "CRYPTO",
    iconImage: cryptoIcon,
  },
};

export const DEPOSIT_OPTIONS = {
  CASH: {
    key: "CASH",
    value: "קוד בנקאי",
    text: "היי, אני מעוניין לעשות הפקדה באמצעות קוד בנקאי על סך ",
  },
  BANK_TRANSFER: {
    key: "BANK_TRANSFER",
    value: "העברה בנקאית",
    text: "היי, אני מעוניין לעשות הפקדה דרך העברה בנקאית על סך ",
  },
  BIT: {
    key: "BIT",
    value: "ביט",
    text: "היי, אני מעוניין לעשות הפקדה דרך הביט על סך ",
  },
  PAY_BOX: {
    key: "PAY_BOX",
    value: "פייבוקס",
    text: "היי, אני מעוניין לעשות הפקדה דרך הפייבוקס על סך ",
  },
  CRYPTO: {
    key: "CRYPTO",
    value: "קריפטו",
    text: "היי, אני מעוניין לעשות הפקדה דרך קריפטו על סך ",
  },
};

export const DEPOSIT_OPTIONS_LIMIT = {
  currencyKey: "ILS", //USD|EUR
  CASH: {
    key: "CASH",
    min: 400,
    max: UNLIMITED,
  },
  BANK_TRANSFER: {
    key: "BANK_TRANSFER",
    min: 1000,
    max: UNLIMITED,
  },
  BIT: {
    key: "BIT",
    min: 400,
    max: UNLIMITED,
  },
  PAY_BOX: {
    key: "PAY_BOX",
    min: 400,
    max: UNLIMITED,
  },
  CRYPTO: {
    key: "CRYPTO",
    min: 400,
    max: UNLIMITED,
  },
};

export const WITHDRAW_TEXT = "היי, אני מעוניין לבצע משיכה על סך ";

export const NEW_BANK_ACCOUNT = {
  isActive: true,
  bankKey: "",
  branchId: "",
  accountNumber: "",
};

export const BANKS = {
  LEUMI: {
    key: "LEUMI",
    value: "לאומי",
    iconImage: leumi,
    bankId: "10",
  },
  POALIM: {
    key: "POALIM",
    value: "פועלים",
    iconImage: poalim,
    bankId: "12",
  },
  MIZRAHI: {
    key: "MIZRAHI",
    value: "מזרחי",
    iconImage: mizrahi,
    bankId: "20",
  },
  DISCONT: {
    key: "DISCONT",
    value: "דיסקונט",
    iconImage: dicont,
    bankId: "11",
  },
  // MARCANTIL: {
  //   key: "MARCANTIL",
  //   value: "מרכנתיל",
  //   iconImage: marcantil,
  //   bankId: "17",
  // },
  FIBI: {
    key: "FIBI",
    value: "הבינלאומי",
    iconImage: fibi,
    bankId: "31",
  },
};

export const BANKS_DEPOSIT = {
  LEUMI: BANKS.LEUMI,
  POALIM: BANKS.POALIM,
  DISCONT: BANKS.DISCONT,
  // MARCANTIL: BANKS.MARCANTIL,
};

export const ACCEPTED_IMAGES = "image/*";

export const ENV = {
  MODE: {
    development: "development",
    production: "production",
  },
};

export const USER_DB_STATUS = {
  started: "started",
  complete: "complete",
  verified: "verified",
  completeVerified: "completeVerified",
};

export const DAYS = {
  sunday: {
    key: "sunday",
    value: "ראשון",
  },
  monday: {
    key: "monday",
    value: "שני",
  },
  tuesday: {
    key: "tuesday",
    value: "שלישי",
  },
  wednesday: {
    key: "wednesday",
    value: "רביעי",
  },
  thursday: {
    key: "thursday",
    value: "חמישי",
  },
  friday: {
    key: "friday",
    value: "שישי",
  },
  saturday: {
    key: "saturday",
    value: "שבת",
  },
};

export const DO_NOT_DISTURB = {
  get value() {
    return {
      uuid: getUUID(),
      isActive: true,
      days: [
        "sunday",
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
      ],
      hours: {
        start: getLocalTime().hour(22).minute(0).second(0).toISOString(),
        end: getLocalTime().hour(7).minute(0).second(0).toISOString(),
      },
    };
  },
};

export const SIDE_MENU_TYPE = {
  BUTTON: "button",
  LINK: "link",
};

export const TRANSACTION_TYPE = {
  DEPOSIT: { key: "DEPOSIT", value: "הפקדה" },
  WITHDRAW: { key: "WITHDRAW", value: "משיכה" },
};

export const TRANSACTION_STATUS = {
  PENDING: { key: "PENDING", value: "ממתין לאישור" },
  COMPLETE: { key: "COMPLETE", value: "מאושר" },
  CANCELED: { key: "CANCELED", value: "בוטל" },
};

export const TRANSACTION_STATUS_AGENT_ACTIONS = {
  [TRANSACTION_STATUS.PENDING.key]: { key: "PENDING", value: "המתנה" },
  [TRANSACTION_STATUS.COMPLETE.key]: { key: "COMPLETE", value: "אשר" },
  [TRANSACTION_STATUS.CANCELED.key]: { key: "CANCELED", value: "בטל" },
};

export const TRANSACTION_STATUS_COLOR = {
  [TRANSACTION_STATUS.PENDING.key]: "#A15D5D",
  [TRANSACTION_STATUS.COMPLETE.key]: "#9CA15D",
  [TRANSACTION_STATUS.CANCELED.key]: "#737373",
};

export const SORT_ORDER = {
  DESC: "desc",
  ASC: "asc",
};

export const SELECTED_DATE = {
  TODAY: { key: "TODAY", value: "היום" },
  THIS_WEEK: { key: "THIS_WEEK", value: "השבוע" },
  THIS_MONTH: { key: "THIS_MONTH", value: "החודש" },
  ALL: { key: "all", value: "הכל" },
};

export const TWILIO_FROM_NUMBER = "+18304838380";
export const TWILIO_FROM_SID = "FX1";
