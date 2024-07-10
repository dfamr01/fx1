import { BANKS_DEPOSIT } from "../../utilities/constants.js";
export const SHOW_ID_DEPOSIT = [
  BANKS_DEPOSIT.POALIM.key,
  // BANKS_DEPOSIT.MIZRAHI.key
];
export const SHOW_DEPOSIT_BIRTHDAY = [
  BANKS_DEPOSIT.LEUMI.key,
  BANKS_DEPOSIT.POALIM.key,
];

export function validateCashDeposit({
  depositParams,
  bankSelected,
  setErrors,
  errors,
}) {
  const errorsVar = {};
  const showId = SHOW_ID_DEPOSIT.includes(bankSelected.key);
  const showBirthday = SHOW_DEPOSIT_BIRTHDAY.includes(bankSelected.key);
  if (!depositParams?.code) {
    errorsVar.code = "אנא הזן קוד בנקאי";
  } else {
    errorsVar.code = false;
  }

  if (showId && !depositParams?.id) {
    errorsVar.id = "אנא הזן תעודה זהות";
  } else {
    errorsVar.id = false;
  }

  if (showBirthday && (!depositParams?.birthday || errors?.birthdayError)) {
    errorsVar.birthday = "אנא הזן תאריך לידה";
  } else {
    errorsVar.birthday = false;
  }

  if (setErrors) {
    setErrors(errorsVar);
  }

  return errorsVar;
}

export async function storeLastAmount(amount) {
  return localStorage.setItem("lastAmount", amount);
}

export async function getLastAmount() {
  let amount = await localStorage.getItem("lastAmount");
  return +amount || 100;
}
