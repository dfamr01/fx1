import { Firestore } from "../../utilities/firebase/firestore.js";
import { errorHandler } from "../../components/Toast/index.jsx";

/**
 * Represents a User entity with methods to interact with the Firestore database.
 */
class User {
  /**
   * Constructs a User instance with a Firestore database reference.
   * @param {Firestore} db - The Firestore database reference.
   */
  constructor(db) {
    this.db = db;
  }

  /**
   * Creates a new user in the database.
   * @param {Object} user - User object.
   * @param {string} user.uid - The user's unique ID.
   * @param {string|null} user.suid - Secondary unique ID (optional).
   * @returns {Promise<Object|null>} The result of the create operation or null in case of error.
   */
  async create({ uid, suid = null }) {
    try {
      return await this.db.create(uid, { uid, suid });
    } catch (e) {
      errorHandler(e);
      return null;
    }
  }

  /**
   * Checks if a user exists in the database.
   * @param {Object} user - User object.
   * @param {string} user.uid - The user's unique ID.
   * @param {string} user.suid - Secondary unique ID.
   * @returns {Promise<Object>} An object with 'data' indicating the existence and 'error' status.
   */
  async isUserExist({ uid, suid }) {
    try {
      if (suid) {
        const qRes = await this.db.getCollection({
          field: "suid",
          queryOperator: "==",
          value: suid,
        });

        return { data: !!qRes[0], error: false };
      }

      const res = await this.db.get(uid);
      return { error: false, data: !!res };
    } catch (e) {
      errorHandler(e);
      return { error: true, data: false };
    }
  }

  /**
   * Retrieves user data from the database.
   * @param {Object} user - User object.
   * @param {string} user.uid - The user's unique ID.
   * @param {string} user.suid - Secondary unique ID.
   * @returns {Promise<Object|null>} The user's data or null if not found or in case of error.
   */
  async get({ uid, suid }) {
    try {
      if (!uid && !suid) {
        throw new Error("getUserFromDB no user id provided");
      }

      if (suid) {
        const qRes = await this.db.getCollection({
          field: "suid",
          queryOperator: "==",
          value: suid,
        });

        return { data: qRes[0], error: false };
      }

      const res = await this.db.get(uid);
      return res ? { data: res, error: false } : null;
    } catch (e) {
      errorHandler(e);
      return null;
    }
  }
}

const userDB = new User(new Firestore("users"));
export { userDB };
