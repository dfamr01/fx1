import { Firestore } from "../../utilities/firebase/firestore.js";
import { errorHandler } from "../../components/Toast/index.jsx";
import {
  DEPOSIT_OPTIONS_AVAILABLE,
  DEPOSIT_OPTIONS_LIMIT,
} from "../../utilities/constants.js";
import { CURRENCIES } from "../../utilities/currency.js";

/**
 * Represents a user account with methods to interact with the Firestore database.
 */
class UserAccount {
  /**
   * Constructs a UserAccount instance with a Firestore database reference.
   * @param {Firestore} db - The Firestore database reference.
   */
  constructor(db) {
    this.db = db;
  }

  /**
   * Creates a new user account in the database.
   * @param {Object} user - User object.
   * @param {string} user.uid - The user's unique ID.
   * @param {string|null} user.suid - Secondary unique ID (optional).
   * @returns {Promise<Object|null>} The result of the create operation or null in case of error.
   */
  async create({ uid, suid = null }) {
    const bankAccounts = [];
    const doNotDisturbs = [];

    const currencies = Object.values(CURRENCIES);
    const depositOptionsLimits = {};
    currencies.forEach(({ key }) => {
      depositOptionsLimits[key] = {
        ...DEPOSIT_OPTIONS_LIMIT,
        currencyKey: key,
      };
    });

    const depositOptions = DEPOSIT_OPTIONS_AVAILABLE;

    try {
      const res = await this.db.create(uid, {
        uid,
        suid,
        bankAccounts,
        depositOptionsLimits,
        doNotDisturbs,
        depositOptions,
      });

      return res;
    } catch (e) {
      errorHandler(e);
    }
    return null;
  }

  /**
   * Updates a user account in the database.
   * @param {Object} user - User object.
   * @param {string} user.uid - The user's unique ID.
   * @param {Object} user.data - Data to be updated.
   * @returns {Promise<Object>} The result of the update operation.
   */
  async update({ uid, data }) {
    if (!uid) {
      throw Error("update no user id provided");
    }
    const res = await this.db.update(uid, data);

    return res;
  }

  /**
   * Retrieves user account data from the database.
   * @param {Object} user - User object.
   * @param {string} user.uid - The user's unique ID.
   * @param {string|null} user.suid - Secondary unique ID (optional).
   * @returns {Promise<Object|null>} The user's account data or null if not found.
   */
  async get({ uid, suid = null }) {
    if (!uid && !suid) {
      throw Error("getUserFromDB no user id provided");
    }

    if (suid) {
      const qRes = await this.db.getCollection({
        field: "suid",
        queryOperator: "==",
        value: suid,
      });

      return {
        data: qRes[0],
        error: false,
      };
    }

    const res = await this.db.get(uid);
    return res;
  }
}

const userAccountDB = new UserAccount(new Firestore("usersAccount"));
export { userAccountDB };
// setTimeout(() => userAccountDB.create({ uid: "nEwyqisqKVZ4V0ETth3i1Uo5G9z1" }), 1000)
