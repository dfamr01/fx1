import { Firestore } from "../../utilities/firebase/firestore.js";
import { errorHandler } from "../../components/Toast/index.jsx";
import EventEmitter from "events";
/**
 * Class for managing agent-user relationships in a database.
 */
class AgentUsers {
  /**
   * Creates an instance of AgentUsers.
   * @param {Firestore} db - The Firestore database instance.
   */
  constructor(db) {
    this.db = db;
  }

  /**
   * Create a new agent-user relationship in the database.
   * @param {Object} params - Parameters for creating a relationship.
   * @param {string} params.uid - The user's unique ID.
   * @param {string} [params.suid=""] - The secondary user's unique ID.
   * @param {string} params.agentSuid - The agent's secondary unique ID.
   * @param {string} [params.agentUid=""] - The agent's unique ID.
   * @returns {Promise<any>} A promise that resolves with the created relationship or null in case of an error.
   */
  async create({ uid, suid = "", agentSuid, agentUid = "" }) {
    try {
      const res = await this.db.create(uid, {
        uid,
        suid,
        agentSuid,
        agentUid,
      });

      return res;
    } catch (e) {
      errorHandler(e);
      return null;
    }
  }

  /**
   * Retrieve users that correspond to the agent based on agentUid or agentSuid.
   * @param {Object} params - Parameters for fetching users.
   * @param {string} [params.agentUid] - The agent's unique ID.
   * @param {string} [params.agentSuid] - The agent's secondary unique ID.
   * @returns {Promise<{data: any[], error: boolean}>} A promise that resolves with user data and an error flag.
   * @throws {Error} Throws an error if neither agentUid nor agentSuid is provided.
   */
  async get({ agentUid, agentSuid }) {
    if (!agentUid && !agentSuid) {
      throw new Error("getUserFromDB: No user ID provided");
    }

    const field = agentUid ? "agentUid" : "agentSuid";
    const queryValue = agentUid || agentSuid;

    const qRes = await this.db.getCollection({
      field,
      queryOperator: "==",
      value: queryValue,
    });

    return {
      data: qRes,
      error: false,
    };
  }

  /**
   * Retrieve the count of users that correspond to the agent with live updates.
   * @param {Object} params - Parameters for fetching user counts.
   * @param {string} [params.agentUid] - The agent's unique ID.
   * @param {string} [params.agentSuid] - The agent's secondary unique ID.
   * @returns {Promise<[Function, EventEmitter]>} A promise that resolves with the count of users.
   * @throws {Error} Throws an error if neither agentUid nor agentSuid is provided.
   */
  async getAgentUserCountSubscribe({ agentUid, agentSuid }) {
    if (!agentUid && !agentSuid) {
      throw new Error("getUserFromDB: No user ID provided");
    }

    const field = agentUid ? "agentUid" : "agentSuid";
    const queryValue = agentUid || agentSuid;

    // @ts-ignore
    return this.db.getQuerySubscribeCount(field, "==", queryValue);
  }

  /**
   * Retrieve the agent that belongs to the user based on user's uid or suid.
   * @param {Object} params - Parameters for fetching the user's agent.
   * @param {string} [params.uid] - The user's unique ID.
   * @param {string} [params.suid] - The user's secondary unique ID.
   * @returns {Promise<any>} A promise that resolves with the user's agent data.
   * @throws {Error} Throws an error if neither uid nor suid is provided.
   */
  async getUserAgent({ uid, suid }) {
    if (!uid && !suid) {
      throw new Error("getUserFromDB: No user ID provided");
    }

    const res = await this.db.get(uid || suid);

    return res;
  }
}

// Initialize an instance of AgentUsers with a Firestore database.
const agentUsersDB = new AgentUsers(new Firestore("agentUsers"));

export { agentUsersDB };
