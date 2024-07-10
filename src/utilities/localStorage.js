import localforage from "localforage";

const localStorageHandler = {
  getItem: async (itemId) => {
    let res = await localforage.getItem(itemId);
    return res;
  },
  removeItem: async (itemId) => {
    let res = await localforage.removeItem(itemId);
    return res;
  },
  setItem: async (key, value) => {
    const res = await localforage.setItem(key, value);
    return res;
  },
};

export default localStorageHandler;
