import * as React from "react";
import { Link } from "react-router-dom";
// import {styled, alpha} from '@mui/material/styles';
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
// import InputBase from '@mui/material/InputBase';
// import Badge from '@mui/material/Badge';
// import MenuIcon from '@mui/icons-material/Menu';
// import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from "@mui/icons-material/AccountCircle";
// import MailIcon from '@mui/icons-material/Mail';
// import NotificationsIcon from '@mui/icons-material/Notifications';
import { styled } from "@mui/material/styles";
import { Button } from "@mui/material";
import { useRef, useState } from "react";
import MenuSelection from "./MenuSelection/index.jsx";
import LogIn from "../../../components/LogIn/index.jsx";

const SignInButtonWrap = styled(Button)`
  color: inherit;
  border-radius: 20px;
  border: 1px solid #f3f3f3;
  background-color: #5f5d5d;
  padding: 5px 35px;
`;

const FXCaption = styled(Typography)`
  user-select: none;
`;

//
// const Search = styled('div')(({theme}) => ({
//     position: 'relative',
//     borderRadius: theme.shape.borderRadius,
//     backgroundColor: alpha(theme.palette.common.white, 0.15),
//     '&:hover': {
//         backgroundColor: alpha(theme.palette.common.white, 0.25),
//     },
//     marginRight: theme.spacing(2),
//     marginLeft: 0,
//     width: '100%',
//     [theme.breakpoints.up('sm')]: {
//         marginLeft: theme.spacing(3),
//         width: 'auto',
//     },
// }));
//
// const SearchIconWrapper = styled('div')(({theme}) => ({
//     padding: theme.spacing(0, 2),
//     height: '100%',
//     position: 'absolute',
//     pointerEvents: 'none',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
// }));
//
// const StyledInputBase = styled(InputBase)(({theme}) => ({
//     color: 'inherit',
//     '& .MuiInputBase-input': {
//         padding: theme.spacing(1, 1, 1, 0),
//         // vertical padding + font size from searchIcon
//         paddingLeft: `calc(1em + ${theme.spacing(4)})`,
//         transition: theme.transitions.create('width'),
//         width: '100%',
//         [theme.breakpoints.up('md')]: {
//             width: '20ch',
//         },
//     },
// }));

function PrimarySearchAppBar({ isLoggedIn }) {
  const [openSignIn, setOpenSignIn] = useState(false);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [userMenuButtonRef, setUserMenuButtonRef] = useState();

  const handleProfileMenuOpen = () => {
    setMenuOpen(true);
  };

  const handleMenuClose = () => {
    setMenuOpen(false);
  };
  return (
    <>
      {openSignIn && (
        <LogIn
          open={openSignIn}
          setOpen={setOpenSignIn}
        />
      )}

      <Box sx={{ flexGrow: 1 }}>
        <AppBar
          position="static"
          sx={{ backgroundColor: "#051e34" }}
        >
          <Toolbar>
            <Link
              style={{ color: "inherit", textDecoration: "none" }}
              to="/"
            >
              <FXCaption
                variant="h6"
                noWrap
              >
                FX1
              </FXCaption>
            </Link>

            {/*<Search>*/}
            {/*    <SearchIconWrapper>*/}
            {/*        <SearchIcon/>*/}
            {/*    </SearchIconWrapper>*/}
            {/*    <StyledInputBase*/}
            {/*        placeholder="Search…"*/}
            {/*        inputProps={{'aria-label': 'search'}}*/}
            {/*    />*/}
            {/*</Search>*/}
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ display: "flex" }}>
              {/*<IconButton size="large" aria-label="show 4 new mails" color="inherit">*/}
              {/*    <Badge badgeContent={4} color="error">*/}
              {/*        <MailIcon/>*/}
              {/*    </Badge>*/}
              {/*</IconButton>*/}
              {/*<IconButton*/}
              {/*    size="large"*/}
              {/*    aria-label="show 17 new notifications"*/}
              {/*    color="inherit"*/}
              {/*>*/}
              {/*    <Badge badgeContent={17} color="error">*/}
              {/*        <NotificationsIcon/>*/}
              {/*    </Badge>*/}
              {/*</IconButton>*/}
              {isLoggedIn && (
                <IconButton
                  ref={setUserMenuButtonRef}
                  size="large"
                  edge="end"
                  aria-label="account of current user"
                  aria-controls={"account-menu"}
                  aria-haspopup="true"
                  onClick={handleProfileMenuOpen}
                  color="inherit"
                >
                  <AccountCircle />
                </IconButton>
              )}

              {!isLoggedIn && (
                <SignInButtonWrap onClick={() => setOpenSignIn(true)}>
                  התחבר
                </SignInButtonWrap>
              )}
            </Box>
          </Toolbar>
        </AppBar>
        <MenuSelection
          isLoggedIn={isLoggedIn}
          handleMenuClose={handleMenuClose}
          isMenuOpen={isMenuOpen}
          userMenuButtonRef={userMenuButtonRef}
        />
      </Box>
    </>
  );
}

const component = React.memo(PrimarySearchAppBar);
export default component;
