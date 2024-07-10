import * as React from "react";
import { Link } from "react-router-dom";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { SIDE_MENU_TYPE } from "../../../utilities/constants";

const drawerWidth = 220;

const ListItemIconWrap = styled(ListItemIcon)`
  min-width: unset;
  padding-right: 5px;
`;

const ListItemTextWrap = styled(ListItemText)`
  text-align: end;
`;

function SideBar({ isAgent, showSideBar, sideBarMenu, children }) {
  return (
    <Box style={{ display: "flex", width: "100%" }}>
      {children}
      {showSideBar && !!sideBarMenu?.length && (
        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              position: "unset",
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
          variant="permanent"
          anchor="right"
        >
          <List>
            {sideBarMenu.map(
              ({ type, button, link, icon, caption, agentOnly }, index) => {
                if (!isAgent && agentOnly) {
                  return null;
                }
                if (type === SIDE_MENU_TYPE.LINK) {
                  return (
                    <ListItem
                      key={caption}
                      disablePadding
                    >
                      <ListItemButton
                        component={Link}
                        to={link.to}
                      >
                        <ListItemIconWrap>{icon && icon}</ListItemIconWrap>
                        <ListItemTextWrap primary={caption} />
                      </ListItemButton>
                    </ListItem>
                  );
                }

                return (
                  <ListItem
                    key={caption}
                    disablePadding
                  >
                    <ListItemButton onClick={button.onClick}>
                      <ListItemIconWrap>{icon && icon}</ListItemIconWrap>
                      <ListItemTextWrap primary={caption} />
                    </ListItemButton>
                  </ListItem>
                );
              },
            )}
          </List>
        </Drawer>
      )}
    </Box>
  );
}

const Component = React.memo(SideBar);
export default Component;
