import React, { useEffect, useState } from "react";

import SignUpUI from "../SignUpUI/index.jsx";
import SignUpDialog from "../SignUpDialog/index.jsx";
import { createNewUser } from "../../apis/user/helpers/user.js";

function SignUp({ show, setOpen, isAgent }) {
  const [errors, setErrors] = useState({});

  async function onSubmit({
    email,
    password,
    firstName,
    lastName,
    nickName,
    phoneNumber,
    avatarFile,
    agentSuid,
    agentUid,
  }) {
    setErrors({
      isLoading: true,
    });

    const displayName = isAgent ? nickName : `${firstName} ${lastName}`;
    const suid = nickName || "";
    createNewUser({
      suid,
      isAgent,
      email,
      password,
      firstName,
      lastName,
      displayName,
      phoneNumber,
      avatarFile,
      agentSuid,
      agentUid,
      notificationSettings: {
        transactionsSms: true,
      },
    })
      .then(() => {
        setOpen(false);
      })
      .catch((err) => {
        setErrors({
          general: err?.message || err,
        });
      });
  }

  // function signInWithGoogle() {
  //   setOpen(false);
  //   firebaseAuthModule.signInWithGoogle().then(async (result) => {
  //     const {
  //       uid,
  //       email,
  //       displayName,
  //       phoneNumber,
  //       dateOfBirth
  //     } = result.user;
  //     const createUserRes = await userDB.createUserInDB({})
  //     // This gives you a Google Access Token. You can use it to access the Google API.
  //     // const token = credential.accessToken;
  //     // The signed-in user info.
  //     const user = result.user;
  //     // IdP data available using getAdditionalUserInfo(result)
  //     // ...
  //   }).catch((err) => {
  //     // Handle Errors here.
  //     errorHandler(err);
  //     setErrors({
  //       general: err?.message || err
  //     });

  //   });
  // }

  return (
    <SignUpDialog
      isOpen={show}
      setOpen={setOpen}
    >
      <SignUpUI
        title={isAgent ? "יצירת חשבון סוכן" : "יצירת חשבון לקוח"}
        isAgent={isAgent}
        onSubmit={onSubmit}
        // signInWithGoogle={signInWithGoogle}
        errors={errors}
        setErrors={setErrors}
      />
    </SignUpDialog>
  );

  // return (
  //     <PageWrapper>
  //         <PaperWrapper style={{height: "auto"}}>
  //             <SignUpUI
  //                 onSubmit={onSubmit}
  //                 signInWithGoogle={signInWithGoogle}
  //             />
  //         </PaperWrapper>
  //     </PageWrapper>
  // )
}

export default SignUp;
