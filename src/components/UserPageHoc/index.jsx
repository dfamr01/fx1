import { Button, CircularProgress, Typography } from "@mui/material";
import { Navigate, useMatch } from "react-router-dom";

import WithSideBar from "../../layouts/WithSideBar/index.jsx";
import { connect } from "react-redux";
import { getAuthIsLoggedIn } from "../../redux/auth/selectors.js";
import { getUserProfile } from "../../redux/userProfile/selectors.js";

import { CircularProgressWrap } from "../../styles/common.js";
import React from "react";
function UserPageHoc({ isLoggedIn, userProfile, children }) {
  // let { agent, client } = useParams();
  const matchAgent = useMatch("/agent");
  const matchClient = useMatch("/client");

  if (userProfile?.uid) {
    // if agent tries to go to user page
    if (userProfile.isAgent && matchClient) {
      return <Navigate to="/agent" />;
    }
    // if user try to go to agent page
    if (!userProfile.isAgent && matchAgent) {
      return <Navigate to="/client" />;
    }
  }

  if (!userProfile?.uid) {
    return (
      <WithSideBar>
        <CircularProgressWrap>
          <CircularProgress />
        </CircularProgressWrap>
      </WithSideBar>
    );
  }

  return <WithSideBar>{children}</WithSideBar>;
}

function mapStateToProps(state) {
  return {
    isLoggedIn: getAuthIsLoggedIn(state),
    userProfile: getUserProfile(state),
  };
}

const UserPageHocComponent = connect(mapStateToProps)(React.memo(UserPageHoc));

export default UserPageHocComponent;

// setTimeout(() => transactionDB.create({
//   uid: "a9KjOBPwfdSI3TVgoGhIuDs5jRw1",
//   suid: "",
//   agentUid: "nEwyqisqKVZ4V0ETth3i1Uo5G9z1",
//   agentSuid: "dmx",
//   type: "DEPOSIT",
//   method: "CRYPTO",
//   amount: 100,
//   currencyKey: "USD",
// }), 1000)
