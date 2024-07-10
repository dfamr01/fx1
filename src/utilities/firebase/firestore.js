import EventEmitter from "events";
import {
  getFirestore,
  addDoc as addDocFB,
  setDoc as setDocFB,
  getDocs as getDocsFB,
  getDoc as getDocFB,
  updateDoc as updateDocFB,
  where,
  query,
  collection,
  doc,
  serverTimestamp,
  getCountFromServer,
  onSnapshot,
} from "firebase/firestore";
import { firebaseModule } from "./firebase.js";
import { DBInterface } from "../../interfaces/db.interface.js";
import { isObject } from "lodash";

const db = { dbRef: getFirestore(firebaseModule?.app) };

/**
 * Firestore class extends DBInterface to interact with Firestore database.
 * It provides methods to perform CRUD operations and to subscribe to data changes.
 */
export class Firestore extends DBInterface {
  /**
   * Constructor for Firestore class.
   * @param {string} collectionName - Name of the collection to be used.
   */
  constructor(collectionName) {
    super();
    this.collectionName = collectionName;
    this.onValueSubscribes = new Map();
  }

  /**
   * Unsubscribe from all subscriptions.
   */
  destructor() {
    this.unsubscribeAll();
  }

  /**
   * Create or overwrite a document in the collection.
   * @param {string} docId - Document ID.
   * @param {Object} data - Data to be stored in the document.
   * @returns {Promise} Firestore write result.
   */
  async create(docId, data) {
    return setDocFB(doc(db.dbRef, this.collectionName, docId), {
      ...data,
      updatedAt: serverTimestamp(),
    });
  }

  /**
   * Retrieve a document from the collection.
   * @param {string} docId - Document ID.
   * @returns {Promise<Object|null>} Document data or null if not exists.
   */
  async get(docId) {
    const docRef = doc(db.dbRef, this.collectionName, docId);
    const docSnap = await getDocFB(docRef);
    return docSnap.exists() ? docSnap.data() : null;
  }

  /**
   * Update a document in the collection.
   * @param {string} docId - Document ID.
   * @param {Object} data - Data to update.
   * @returns {Promise} Firestore write result.
   */
  async update(docId, data) {
    const docRef = doc(db.dbRef, this.collectionName, docId);
    return updateDocFB(docRef, data);
  }

  /**
   * Add a new document to the collection with an auto-generated ID.
   * @param {Object} data - Data to be added.
   * @returns {Promise} Firestore write result.
   */
  async add(data) {
    return addDocFB(collection(db.dbRef, this.collectionName), {
      ...data,
      updatedAt: serverTimestamp(),
    });
  }

  /**
   * @typedef oReq
   * @type {Object}
   * @property {string} field
   * @property {string} queryOperator
   * @property {string} value
   */

  /**
   * Get a collection of documents based on a query.
   * @param { oReq | Array} _query - Firestore query object or array.
   * @returns {Promise<Array>} Array of document data.
   */
  async getCollection(_query) {
    let q = isObject(_query)
      ? query(
          collection(db.dbRef, this.collectionName),
          where(_query.field, _query.queryOperator, _query.value)
        )
      : query(collection(db.dbRef, this.collectionName), where(..._query));

    const querySnapshot = await getDocsFB(q);
    return querySnapshot.docs.map((doc) => doc.data());
  }

  /**
   * Subscribe to changes in the collection.
   * @param {...Array} queryQ - Query parameters.
   * @returns {[Function, EventEmitter]} Unsubscribe function and event emitter.
   */
  getSubscribe(...queryQ) {
    const eventEmitter = new EventEmitter();
    const q = query(collection(db.dbRef, this.collectionName), ...queryQ);
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const res = [];
        querySnapshot.forEach((doc) => {
          res.push(doc.data());
        });
        eventEmitter.emit("data", res);
      },
      (error) => {
        eventEmitter.emit("error", error);
      }
    );

    const unsubscribeCB = () => {
      unsubscribe();
      this.onValueSubscribes.delete(unsubscribeCB);
    };
    this.onValueSubscribes.set(unsubscribeCB, unsubscribeCB);
    return [unsubscribeCB, eventEmitter];
  }

  /**
   * Get the count of documents in a query.
   * @param {string} field - Field name.
   * @param {string} queryOperator - Query operator.
   * @param {*} value - Value to query against.
   * @returns {Promise<number>} Count of documents.
   */
  async getQueryCount(field, queryOperator, value) {
    const q = query(
      collection(db.dbRef, this.collectionName),
      where(field, queryOperator, value)
    );
    const snapshot = await getCountFromServer(q);
    return snapshot.data().count;
  }

  /**
   * Get the count of documents in a collection.
   * @param {...Array} queryQ - Query parameters.
   * @returns {Promise<number>} Count of documents.
   */
  async getCount(queryQ) {
    const q = query(collection(db.dbRef, this.collectionName), ...queryQ);
    const snapshot = await getCountFromServer(q);
    return snapshot.data().count;
  }

  /**
   * Subscribe to the count of documents in a query.
   * @param {string} field - Field name.
   * @param {string} queryOperator - Query operator.
   * @param {*} value - Value to query against.
   * @returns {[function, EventEmitter]} Unsubscribe function and event emitter.
   */
  getQuerySubscribeCount(field, queryOperator, value) {
    let count = 0;
    const eventEmitter = new EventEmitter();
    const q = query(
      collection(db.dbRef, this.collectionName),
      where(field, queryOperator, value)
    );
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        querySnapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            eventEmitter.emit("data", ++count);
          } else if (change.type === "removed") {
            eventEmitter.emit("data", --count);
          }
        });
      },
      (error) => {
        eventEmitter.emit("error", error);
      }
    );

    const unsubscribeCB = () => {
      unsubscribe();
      this.onValueSubscribes.delete(unsubscribeCB);
    };
    this.onValueSubscribes.set(unsubscribeCB, unsubscribeCB);
    return [unsubscribeCB, eventEmitter];
  }

  /**
   * Subscribe to the count of documents in the collection.
   * @param {...Array} queryQ - Query parameters.
   * @returns {[Function, EventEmitter]} Unsubscribe function and event emitter.
   */
  getSubscribeCount(...queryQ) {
    let count = 0;
    const eventEmitter = new EventEmitter();
    const q = query(collection(db.dbRef, this.collectionName), ...queryQ);
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        querySnapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            eventEmitter.emit("data", ++count);
          } else if (change.type === "removed") {
            eventEmitter.emit("data", --count);
          }
        });
      },
      (error) => {
        eventEmitter.emit("error", error);
      }
    );

    const unsubscribeCB = () => {
      unsubscribe();
      this.onValueSubscribes.delete(unsubscribeCB);
    };
    this.onValueSubscribes.set(unsubscribeCB, unsubscribeCB);
    return [unsubscribeCB, eventEmitter];
  }

  /**
   * Unsubscribe from all active subscriptions.
   */
  async unsubscribeAll() {
    this.onValueSubscribes.forEach((value, key) => {
      value();
    });
    this.onValueSubscribes.clear();
  }
}
