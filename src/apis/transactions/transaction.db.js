import {
  serverTimestamp,
  Timestamp,
  where,
  orderBy as orderByFB,
} from "firebase/firestore";

import { Firestore } from "../../utilities/firebase/firestore.js";
import { errorHandler } from "../../components/Toast/index.jsx";
import { getUUID } from "../../utilities/utils.js";
import { TRANSACTION_STATUS } from "../../utilities/constants.js";

//dateExample: Timestamp.fromDate(new Date("December 10, 1815")),

class Transaction {
  constructor(db) {
    this.db = db;
  }

  async create({
    uid,
    suid = null,
    agentUid = "",
    agentSuid = "",
    method = "",
    type = "",
    amount,
    currencyKey,
    status = TRANSACTION_STATUS.PENDING.key,
  }) {
    const id = getUUID();
    const createdAt = serverTimestamp();

    const params = {
      id,
      uid,
      suid,
      agentUid,
      agentSuid,
      amount,
      currencyKey,
      type,
      method,
      createdAt,
      status,
    };

    const res = await this.db.create(id, params);
    return params;
  }
  async get({ id }) {
    if (!id) {
      throw Error("getUserFromDB no user id provided");
    }

    const res = await this.db.get(id);
    return res;
  }

  // retrieve all the transitions that is under the agent
  getAllAgentTransactions({
    uid,
    agentUid,
    agentSuid,
    fromDate,
    toDate,
    status,
    type,
    orderBy = { key: "createdAt", order: "desc" },
  }) {
    const q = [];

    if (uid) {
      q.push(where("uid", "==", uid));
    }

    if (agentUid) {
      q.push(where("agentUid", "==", agentUid));
    }

    if (fromDate) {
      q.push(where("createdAt", ">=", fromDate));
    }

    if (toDate) {
      q.push(where("createdAt", "<=", toDate));
    }

    if (status) {
      q.push(where("status", "==", status));
    }

    if (type) {
      q.push(where("type", "==", type));
    }

    q.push(orderByFB(orderBy.key, orderBy.order));

    return this.db.getSubscribe(...q);
  }

  async update({ id, data }) {
    if (!id) {
      throw Error("update no user id provided");
    }
    const res = await this.db.update(id, data);
    return res;
  }
}

const transactionDB = new Transaction(new Firestore("transactions"));
export { transactionDB };
