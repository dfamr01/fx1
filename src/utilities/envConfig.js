export let ENV_VARS = {
  VITE_FIREBASE_API_KEY: "",
  VITE_FIREBASE_AUTH_DOMAIN: "",
  VITE_FIREBASE_PROJECT_ID: "",
  VITE_FIREBASE_STORAGE_BUCKET: "",
  VITE_FIREBASE_MESSAGING_SENDER_ID: "",
  VITE_FIREBASE_APP_ID: "",
  VITE_FIREBASE_MEASUREMENT_ID: "",
  VITE_FIREBASE_REALTIME_DB: "",
};

function picker(obj, pickerObj) {
  const newObj = {};
  Object.keys(pickerObj).forEach((key) => {
    if (obj[key]) {
      newObj[key] = obj[key];
    }
  });
  return newObj;
}

export function pickEnv(obj = {}) {
  const res = picker(obj, ENV_VARS);
  return res;
}

function setEnv() {
  const res = pickEnv(import.meta.env);
  Object.assign(ENV_VARS, res);
}

setEnv();
