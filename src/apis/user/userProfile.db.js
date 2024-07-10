import { Firestore } from "../../utilities/firebase/firestore.js";
import { errorHandler } from "../../components/Toast/index.jsx";

/**
 * Class representing a user's profile with methods to interact with Firestore.
 */
class UserProfile {
  /**
   * Create a UserProfile instance.
   * @param {Firestore} db - Database instance for Firestore operations.
   */
  constructor(db) {
    this.db = db;
  }

  /**
   * Creates a user profile in the database.
   * @param {Object} params - The user profile parameters.
   * @param {string} params.uid - User's unique identifier.
   * @param {string|null} params.suid - Secondary unique identifier, if any.
   * @param {boolean} params.isAgent - Flag indicating if the user is an agent.
   * @param {string} params.email - User's email address.
   * @param {string} params.displayName - User's display name.
   * @param {string} params.phoneNumber - User's phone number.
   * @param {Object} params.avatar - User's avatar details.
   * @param {Object} params.notificationSettings - User's notificationSettings.
   * @param {string} params.firstName - User's first name.
   * @param {string} params.lastName - User's last name.
   * @param {string} params.dateOfBirth - User's date of birth.
   * @param {string} params.status - User's status.
   * @returns {Promise<Object|null>} The result of the create operation or null in case of error.
   */
  async create({
    uid,
    suid = null,
    isAgent = false,
    email = "",
    displayName = "",
    phoneNumber = "",
    avatar = {
      photoName: "",
      photoRef: "",
      photoBucket: "",
      photoURL: "",
    },
    notificationSettings = {
      transactionsSms: true,
    },
    firstName = "",
    lastName = "",
    dateOfBirth = "",
    status = "",
  }) {
    try {
      return await this.db.create(uid, {
        uid,
        suid,
        isAgent,
        email,
        displayName,
        phoneNumber,
        avatar,
        notificationSettings,
        firstName,
        lastName,
        dateOfBirth,
        status,
      });
    } catch (e) {
      errorHandler(e);
      return null;
    }
  }

  /**
   * Updates a user profile in the database.
   * @param {Object} updateParams - The update parameters.
   * @param {string} updateParams.uid - User's unique identifier.
   * @param {Object} updateParams.data - Data to update in the user profile.
   * @returns {Promise<Object>} The result of the update operation.
   */
  async update({ uid, data }) {
    if (!uid) {
      throw new Error("update no user id provided");
    }
    return await this.db.update(uid, data);
  }

  /**
   * Retrieves a user profile from the database.
   * @param {Object} getParams - Parameters to get the user profile.
   * @param {string} getParams.uid - User's unique identifier.
   * @param {string} getParams.suid - User's secondary unique identifier.
   * @returns {Promise<Object|null>} The user profile data or null if not found.
   */
  async get({ uid, suid }) {
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

    return await this.db.get(uid);
  }
}

const userProfileDB = new UserProfile(new Firestore("usersProfile"));
export { userProfileDB };
