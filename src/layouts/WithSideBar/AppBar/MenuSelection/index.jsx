import React from "react";
import { Divider, Menu, MenuItem, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { styled } from "@mui/material/styles";
import { errorHandler } from "../../../../components/Toast/index";
import { getUser } from "../../../../redux/user/selectors";
import { getUserProfile } from "../../../../redux/userProfile/selectors";
import { firebaseAuthModule } from "../../../../utilities/firebase/firebaseAuth";
import { getShareProfileUrl } from "../../../../utilities/utils";

const UserCaption = styled(Typography)`
  text-align: center;
`;

const MenuItemWrap = styled(MenuItem)`
  justify-content: center;
  .MuiMenu-root {
    background-color: blue;
  }
`;

const MenuWrap = styled(Menu)`
  .MuiMenu-root {
    background-color: blue;
  }
`;

export function MenuSelection({
  isLoggedIn,
  handleMenuClose,
  isMenuOpen,
  userMenuButtonRef,
  user,
  userProfile = {},
}) {
  const { isAgent, suid, firstName, lastName, displayName } = userProfile;

  const userCaption = displayName;

  function handleLogout() {
    firebaseAuthModule.signOut();
    handleMenuClose();
  }

  async function onClickShareProfile() {
    const shareData = {
      title: "FX1",
      text: `${displayName} הצטרף אל`,
      url: getShareProfileUrl(suid),
    };

    handleMenuClose();
    try {
      await navigator.share(shareData);
    } catch (err) {
      if (err.toString().includes("AbortError")) {
        return;
      }
      errorHandler(err);
    }
  }

  return (
    <Menu
      sx={{ "& .MuiMenu-paper": { maxHeight: "100%" } }}
      anchorEl={userMenuButtonRef}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={"account-menu"}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <div>
        {!!userCaption && (
          <>
            <UserCaption
              variant="h6"
              noWrap
            >
              {userCaption}
            </UserCaption>
          </>
        )}
        {isAgent && (
          <>
            <Divider style={{ margin: 8 }} />
            <MenuItemWrap onClick={onClickShareProfile}>
              שתף פרופיל
            </MenuItemWrap>
            <Divider />
          </>
        )}
        <MenuItemWrap
          component={Link}
          to="/account/profile"
        >
          הגדרות פרופיל
        </MenuItemWrap>
        {isAgent && (
          <MenuItemWrap
            component={Link}
            to="/account"
          >
            הגדרות חשבון
          </MenuItemWrap>
        )}

        <MenuItemWrap
          component={Link}
          to="/account/notificationSettings"
        >
          הגדרת התראות
        </MenuItemWrap>

        {isLoggedIn && (
          <>
            <Divider />
            <MenuItemWrap onClick={handleLogout}>התנתק</MenuItemWrap>
          </>
        )}
      </div>
    </Menu>
  );
}

function mapStateToProps(state) {
  return {
    user: getUser(state),
    userProfile: getUserProfile(state),
  };
}

const AppComponent = connect(mapStateToProps)(React.memo(MenuSelection));

export default AppComponent;
