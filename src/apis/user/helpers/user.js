import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import { setAuth } from "../../../redux/auth/reducers.js";
import { setUser } from "../../../redux/user/reducers.js";
import { signOut } from "../../../redux/auth/actions.js";
import { dispatch } from "../../../utilities/store/store.js";
import { userDB } from "../user.db.js";
import { errorHandler } from "../../../components/Toast/index.jsx";
import { userProfileDB } from "../userProfile.db.js";
import { setUserProfile } from "../../../redux/userProfile/reducers.js";
import { firebaseAuthModule } from "../../../utilities/firebase/firebaseAuth.js";
import { agentUsersDB } from "../agentUsers.db.js";
import storageFB from "../../../utilities/firebase/storage.js";
import { USER_DB_STATUS } from "../../../utilities/constants.js";
import { userAccountDB } from "../userAccount.db.js";

let isFetching = false;

/**
 * Custom hook to initialize user session.
 */
export function useInitUser() {
  useEffect(() => {
    const init = async () => {
      const auth = getAuth();
      onAuthStateChanged(auth, (user) => {
        if (user) {
          getDataFromDB(user.uid);
        } else {
          handleSignOut();
        }
      });
    };

    init();
  }, []);

  async function getDataFromDB(uid) {
    if (isFetching) return;
    isFetching = true;

    try {
      const [userProfileRes] = await Promise.all([
        userProfileDB.get({ uid }),
        // Additional data fetches can be added here
      ]);

      dispatch(setUserProfile(userProfileRes));
      dispatch(setAuth({ isLoggedIn: true }));
      localStorage.setItem("isLoggedIn", "1");
    } catch (err) {
      errorHandler(err);
    } finally {
      isFetching = false;
    }
  }

  function handleSignOut() {
    localStorage.setItem("isLoggedIn", "");
    dispatch(signOut());
  }
}

/**
 * Function to create a new user.
 * @param {Object} userData - User data for creation.
 */
export async function createNewUser(userData) {
  try {
    const { avatarFile, ...rest } = userData;
    let uploadImageFileRes = {};

    if (avatarFile) {
      uploadImageFileRes = await uploadAvatar(avatarFile);
    }

    const user = await registerUser(userData.email, userData.password);
    await createUserData(user.uid, { ...rest, uploadImageFileRes });
  } catch (err) {
    firebaseAuthModule.deleteCurrentUser();
    errorHandler(err);
    throw new Error(err?.message || err);
  }
}

async function uploadAvatar(avatarFile) {
  return await storageFB.uploadImageFile({
    path: "avatars",
    name: `${avatarFile.name}`,
    file: avatarFile,
    maxHeight: 100,
    maxWidth: 100,
  });
}

async function registerUser(email, password) {
  const result = await firebaseAuthModule.createUserWithEmailAndPassword(
    email,
    password
  );
  return result.user;
}

async function createUserData(
  uid,
  { suid, isAgent, uploadImageFileRes, agentSuid, agentUid, ...rest }
) {
  const promises = [
    userDB.create({ uid, suid }),
    userProfileDB.create({
      uid,
      suid,
      avatar: {
        photoName: uploadImageFileRes.metadata?.name || null,
        photoRef: uploadImageFileRes.metadata?.fullPath || null,
        photoBucket: uploadImageFileRes.metadata?.bucket || null,
        photoURL: uploadImageFileRes.downloadURL || null,
      },
      ...rest,
      isAgent,
      status: USER_DB_STATUS.complete,
    }),
    userAccountDB.create({ uid, suid }),
    // Other related user data creation logic
  ];

  if (!isAgent) {
    promises.push(
      agentUsersDB.create({
        uid,
        suid,
        agentSuid,
        agentUid,
      })
    );
  }
  // Conditionally push promises based on business logic
  const [createUserRes, createUserProfileRes] = await Promise.all(promises);
}
