import { Link } from "react-router-dom";

import WithSideBar from "../../layouts/WithSideBar/index.jsx";
import { styled } from "@mui/material/styles";
import { connect } from "react-redux";
import { getAuthIsLoggedIn } from "../../redux/auth/selectors.js";
import { getUserProfile } from "../../redux/userProfile/selectors.js";
import { ButtonGroup, Button } from "@mui/material/index.js";

import { Title } from "./shared.js";
import { ACCOUNT_MENU } from "./common.jsx";

const ButtonGroupWrap = styled(ButtonGroup)`
  width: 100%;
  .accountMenu {
    border-bottom: 2px solid #727272;
    :last-child {
      border-bottom: none;
    }
  }
`;

const ButtonWrap = styled(Button)`
  background-color: #3c3c3c;
  padding: 15px 5px;
  &:focus,
  &:active {
    background-color: #2a2a2a;
  }
  &:hover {
    background-color: #636363;
  }
`;

function Account({ isLoggedIn, userProfile }) {
  const { isAgent } = userProfile;

  return (
    <WithSideBar>
      <Title noWrap>הגדרות חשבון</Title>
      <ButtonGroupWrap
        orientation="vertical"
        aria-label="vertical outlined button group"
      >
        {ACCOUNT_MENU.map(({ caption, link, agentOnly }) => {
          if (!isAgent && agentOnly) {
            return null;
          }
          return (
            <ButtonWrap
              key={caption}
              className={"accountMenu"}
              component={Link}
              to={link.to}
              variant="contained"
              color="primary"
            >
              {caption}
            </ButtonWrap>
          );
        })}
      </ButtonGroupWrap>
    </WithSideBar>
  );
}

function mapStateToProps(state) {
  return {
    isLoggedIn: getAuthIsLoggedIn(state),
    userProfile: getUserProfile(state),
  };
}

const Component = connect(mapStateToProps)(Account);

export default Component;
