import { CircularProgress } from "@mui/material";
import { Navigate } from "react-router-dom";
import WithSideBar from "../../layouts/WithSideBar/index.jsx";
import { connect } from "react-redux";
import { getAuthIsLoggedIn } from "../../redux/auth/selectors.js";
import { getUserProfile } from "../../redux/userProfile/selectors.js";

import { CircularProgressWrap } from "../../styles/common.js";
import React from "react";
// import SignUpDialog from "../../components/SignUpDialog/index.jsx";
function HomePage({ isLoggedIn, userProfile, children }) {
  const { isAgent } = userProfile;

  if (!userProfile?.uid) {
    return (
      <WithSideBar>
        <CircularProgressWrap>
          <CircularProgress />
        </CircularProgressWrap>
      </WithSideBar>
    );
  }

  if (userProfile?.uid) {
    if (userProfile.isAgent) {
      return <Navigate to="/agent" />;
    } else {
      return <Navigate to="/client" />;
    }
  }

  return <></>;
}

function mapStateToProps(state) {
  return {
    isLoggedIn: getAuthIsLoggedIn(state),
    userProfile: getUserProfile(state),
  };
}

const HomePageComponent = connect(mapStateToProps)(React.memo(HomePage));

export default HomePageComponent;
