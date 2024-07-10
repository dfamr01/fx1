import React from "react";
import { styled } from "@mui/material/styles";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "@reduxjs/toolkit";
import { getAuthIsLoggedIn } from "../../redux/auth/selectors.js";
import Top from "./Top/index.jsx";
import SideBar from "./SideBar/index.jsx";
import { getUserProfile } from "../../redux/userProfile/selectors.js";

const WithSideBarWrapper = styled("div")`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

const Body = styled("div")`
  //flex-grow: 1;
  display: flex;
  flex-direction: row;
  overflow-y: auto;
  height: 100%;
`;

const PageContent = styled("div")`
  /* flex-grow: 1; */
  width: 100%;
  max-width: 100%;
  /* min-width: 100%; */
  overflow: auto;
  scroll-behavior: smooth;
  padding: 10px;
  box-sizing: border-box;
  display: inline-block;
`;

function WithSideBar({
  isLoggedIn,
  userProfile,
  isMobile,
  showSideBar,
  sideBarMenu,
  children,
}) {
  return (
    <WithSideBarWrapper>
      <Top isLoggedIn={isLoggedIn} />
      <Body>
        <SideBar
          isAgent={userProfile.isAgent}
          showSideBar={showSideBar}
          sideBarMenu={sideBarMenu}
        >
          <PageContent>{children}</PageContent>
        </SideBar>
      </Body>
    </WithSideBarWrapper>
  );
}

function mapStateToProps(state) {
  return {
    isLoggedIn: getAuthIsLoggedIn(state),
    userProfile: getUserProfile(state),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({}, dispatch);
}

WithSideBar.propTypes = {
  children: PropTypes.any,
  isMobile: PropTypes.bool,
  isLoggedIn: PropTypes.bool,
};

const Component = React.memo(
  connect(mapStateToProps, mapDispatchToProps)(WithSideBar),
);
export default Component;
