import {
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword as signInWithEmailAndPasswordFB,
  signOut,
  deleteUser,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { firebaseModule } from "./firebase.js";

export const firebaseAuthModule = {
  createUserWithEmailAndPassword: async (email, password) => {
    return createUserWithEmailAndPassword(firebaseModule.auth, email, password);
  },
  signInWithEmailAndPassword: async (email, password) => {
    return setPersistence(firebaseModule.auth, browserLocalPersistence).then(
      () => signInWithEmailAndPasswordFB(firebaseModule.auth, email, password),
    );
  },
  signInWithGoogle: async () => {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(firebaseModule.auth, provider);
  },
  deleteCurrentUser: async () => {
    return deleteUser(firebaseModule.auth.currentUser);
  },
  signOut: async () => {
    return signOut(firebaseModule.auth);
  },
};
