import "firebase/database";
import { firebaseModule } from "./firebase";
import { ref, get, set, push, update, child, onValue } from "firebase/database";

export class FirebaseRealtimeDB {
  constructor(collectionName) {
    this.collectionName = collectionName;

    this.database = firebaseModule?.databaseRealTime;
    this.unsubscribeSnapShot = undefined;
    this.onValueSubscribes = new Map();
  }

  destructor() {
    if (this.unsubscribeSnapShot) {
      this.unsubscribeSnapShot();
    }
    // This function is called when the object is destroyed

    this.onValueSubscribes.forEach((value, key) => {
      value();
    });
  }

  // Read value without update
  async read(value = "") {
    const path = `${this.collectionName}${value ? `/${value}` : ""}`;
    const snapshot = await get(child(this.database, path));

    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      console.log("No data available");
      return undefined;
    }
  }

  // Read value and get updates
  async onRead(value, callback) {
    const path = `${this.collectionName}${value ? `/${value}` : ""}`;
    const ref = this.database.ref(path);

    const unsubscribe = this.onValueSubscribes.get(path);
    if (unsubscribe) {
      unsubscribe();
    }

    this.onValueSubscribes.set(path, () => ref.off(path));

    return onValue(
      ref,
      (snapshot) => {
        const val = snapshot.val();
        callback(val);
      },
      {
        // onlyOnce: true
      }
    );
  }

  //    // Read operation
  //     async read() {
  //         const snapshot = await this.database.ref(this.collectionName).once('value');
  //         return snapshot.val();
  //     }

  // Create operation
  create(data) {
    // const newRef = this.database.ref(this.collectionName).push();
    // return newRef.set(data);
    return set(ref(this.database, this.collectionName), data);
  }

  // Update operation
  update(id, data) {
    return this.database.ref(`${this.collectionName}/${id}`).update(data);
  }

  // Delete operation
  delete(id) {
    return this.database.ref(`${this.collectionName}/${id}`).remove();
  }

  // Listen for changes
  onSnapshot(callback) {
    if (this.unsubscribeSnapShot) {
      this.unsubscribeSnapShot();
    }
    const ref = this.database.ref(this.collectionName);
    ref.on(this.collectionName, (snapshot) => {
      const data = snapshot.val();
      callback(data);
    });

    this.unsubscribeSnapShot = () => ref.off(this.collectionName);
    // Return an unsubscribe function
    return this.unsubscribeSnapShot;
  }

  unsubscribeSnapShots() {
    if (this.unsubscribeSnapShot) {
      this.unsubscribeSnapShot();
    }
  }

  // remove listener on change event
  unsubscribe(value) {
    const path = `${this.collectionName}${value ? `/${value}` : ""}`;

    const unsubscribe = this.onValueSubscribes.get(path);
    if (unsubscribe) {
      unsubscribe();
      this.onValueSubscribes.delete(path);
    }
  }
}
