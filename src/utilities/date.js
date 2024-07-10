import dayjs from "dayjs";
import { Timestamp } from "firebase/firestore";
import he from "dayjs/locale/he"; // load on demand
import { SELECTED_DATE } from "./constants";
import { appendSignal } from "./utils";

export function getLocalTime(time) {
  const date = dayjs.tz(time, dayjs.tz.guess());

  return date;
}

export const daysToISOday = {
  sunday: 7,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
};

export function isBetweenDoNotDisturbTZ({
  time,
  start,
  end,
  isoDay,
  timeZone,
}) {
  const tz = timeZone || dayjs.tz.guess();

  const userCurrent = dayjs.tz(dayjs.utc(time), tz);
  const startDate = dayjs.utc(start);
  const endDate = dayjs.utc(end);

  // convert timezones
  let startDateLocal = dayjs.tz(startDate, tz);
  let endDateLocal = dayjs.tz(endDate, tz);

  // set the weekday
  const checkDay = isoDay >= 0 ? userCurrent.isoWeekday(isoDay) : userCurrent;

  // set the current date to the startDateLocal,endDateLocal
  startDateLocal = dayjs
    .tz(checkDay, tz)
    .hour(startDateLocal.hour())
    .minute(startDateLocal.minute())
    .second(startDateLocal.second());
  endDateLocal = dayjs
    .tz(checkDay, tz)
    .hour(endDateLocal.hour())
    .minute(endDateLocal.minute())
    .second(endDateLocal.second());
  // if the start is after the end midnight
  if (endDateLocal.diff(startDateLocal, "hour", true) < 0) {
    endDateLocal = endDateLocal.add(1, "day");
  }

  const isBetween = userCurrent.isBetween(
    startDateLocal,
    endDateLocal,
    "second",
    "[]"
  );
  const diffEndSec = endDateLocal.diff(userCurrent, "second", true);
  const diffStartSec = startDateLocal.diff(userCurrent, "second", true);
  // const diffH = endDateLocal.diff(userCurrent, 'hour', true);
  // const diffM = endDateLocal.diff(userCurrent, 'minute', true);
  return {
    isBetween,
    diffStartSec,
    diffEndSec,
    start: startDateLocal.toISOString(),
    endDate: endDateLocal.toISOString(),
  };
}

function inDnDBetweenDaysTime(days = [], start, end) {
  const results = [];
  const tz = dayjs.tz.guess();
  const userTime = dayjs.tz(dayjs(), tz).toISOString();

  days.forEach((el) => {
    const res = isBetweenDoNotDisturbTZ({
      time: userTime,
      start: start,
      end: end,
      timeZone: tz,
      isoDay: daysToISOday[el],
    });
    results.push(res);
  });
  return results;
}

export function getAvailableTimeFromDoNotDisturb(doNotDisturbs = []) {
  const res = [];

  doNotDisturbs.forEach(({ isActive, days, hours }) => {
    if (isActive) {
      const isBetweenRes = inDnDBetweenDaysTime(days, hours.start, hours.end);
      res.push(isBetweenRes);
    }
  });

  return res;
}

// return the first start diff from the early alert, and the diff from the last active one when end
export function getMinMaxDnD(doNotDisturbs) {
  let minDiffToStart = null;
  let maxDiffToLastOn = null;
  let isDnDOn = false;

  const activeDoNotDisturb = doNotDisturbs.filter(({ isActive }) => isActive);
  const dnds = getAvailableTimeFromDoNotDisturb(activeDoNotDisturb);
  let min = Infinity;
  let max = -1;
  dnds.forEach((dnd) => {
    dnd.forEach((el) => {
      if (el.isBetween) {
        isDnDOn = true;
        max = Math.max(max, el.diffEndSec);
      } else {
        if (el.diffStartSec >= 0) {
          min = Math.min(min, el.diffStartSec);
        }
      }
    });
  });

  if (min !== Infinity) {
    minDiffToStart = min;
  }
  if (max !== -1) {
    maxDiffToLastOn = max;
  }

  return {
    isDnDOn,
    minDiffToStart,
    maxDiffToLastOn,
  };
}

export function getServerTime(date) {
  return Timestamp.fromDate(date);
}

export function getLocalize(date, locale = "he") {
  switch (locale) {
    case "he":
      return dayjs(date).locale(he);
    // break;
  }
}

export function getDateFromDateKey(dateKey) {
  const currentDate = getLocalTime();

  // currentDate.isoWeek(daysToISOday[]);
  let qDate;
  switch (dateKey) {
    case SELECTED_DATE.TODAY.key:
      qDate = currentDate.startOf("day");
      break;
    case SELECTED_DATE.THIS_WEEK.key:
      qDate = currentDate.startOf("week");
      break;
    case SELECTED_DATE.THIS_MONTH.key:
      qDate = currentDate.startOf("month");
      break;
    case SELECTED_DATE.ALL.key:
      qDate = null;
      break;
    default:
      qDate = null;
      break;
  }

  return new Date(qDate);
}
