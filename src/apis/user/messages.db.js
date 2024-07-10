import { Firestore } from "../../utilities/firebase/firestore.js";
import { errorHandler } from "../../components/Toast/index.jsx";
import { TWILIO_FROM_NUMBER } from "../../utilities/constants.js";
import { getTransactionUrl } from "../../utilities/utils.js";

function getTransactionTextBodyAgentRecipient(
  symbolizedAmount,
  transactionId,
  displayName,
  transactionValue
) {
  let smsMsg = `\nהלקוח ${displayName} `;
  smsMsg += `\nביצע ${transactionValue}`;
  smsMsg += `\nעל סך ${symbolizedAmount}`;
  smsMsg += `\nעל מנת לעדכן את העסקה הכנס\n`;
  smsMsg += getTransactionUrl(transactionId, true);
  return smsMsg;
}

function getTransactionTextBodyClientRecipient(
  symbolizedAmount,
  transactionId,
  displayName,
  status
) {
  let smsMsg = `\nהסוכן ${displayName} `;
  smsMsg += `\nעדכן את העסקה`;
  smsMsg += `\nעל סך ${symbolizedAmount}`;
  smsMsg += `\nל${status}`;
  smsMsg += `\nעל מנת לצפות בעסקה הכנס\n`;
  smsMsg += getTransactionUrl(transactionId);
  return smsMsg;
}

class Messages {
  constructor(db) {
    this.db = db;
  }

  async create({ uid, suid = "", to, body }) {
    try {
      const res = await this.db.add({
        // from: "+9720545923493",
        from: TWILIO_FROM_NUMBER,
        to,
        body,
        uid,
        suid,
      });

      return res;
    } catch (e) {
      errorHandler(e);
    }
    return null;
  }

  // async sendText({ uid, suid = "", to, body }) {
  //   try {
  //     const res = await this.addDoc({
  //       // from: "+9720545923493",
  //       from: TWILIO_FROM_NUMBER,
  //       to,
  //       body,
  //       uid,
  //       suid,
  //     });

  //     return res;
  //   } catch (e) {
  //     errorHandler(e);
  //   }
  //   return null;
  // }

  async sendTransactionText({
    uid,
    suid = "",
    toUid = "",
    toSuid = "",
    to,
    symbolizedAmount,
    transactionId,
    transactionValue,
    displayName,
    agentRecipient = false,
    status = "",
  }) {
    try {
      let body;
      if (agentRecipient) {
        body = getTransactionTextBodyAgentRecipient(
          symbolizedAmount,
          transactionId,
          displayName,
          transactionValue
        );
      } else {
        body = getTransactionTextBodyClientRecipient(
          symbolizedAmount,
          transactionId,
          displayName,
          status
        );
      }
      const res = await this.db.add({
        from: TWILIO_FROM_NUMBER,
        to,
        body,
        uid,
        suid,
        toUid,
        toSuid,
      });

      return res;
    } catch (err) {
      errorHandler(err);
      console.error("error", err);
    }
    return null;
  }

  async get({ uid, suid }) {
    if (!uid && !suid) {
      throw Error("getMessagesFromDB no messages id provided");
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

const messagesDB = new Messages(new Firestore("messages"));
export { messagesDB };
