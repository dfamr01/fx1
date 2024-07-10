import {
  getFunctions,
  httpsCallable,
  connectFunctionsEmulator,
} from "firebase/functions";
import { firebaseModule } from "./firebase.js";
import { isDevelopmentEnv } from "../utils.js";

// const firestore = {}
// export default firestore;

export class FunctionsFB {
  constructor() {
    this.functions = getFunctions(firebaseModule.app);
    if (isDevelopmentEnv) {
      connectFunctionsEmulator(this.functions, "localhost", 9001);
    }
  }

  getCallableFunction(name) {
    return httpsCallable(this.functions, name);
  }
}
