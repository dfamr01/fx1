import * as React from "react";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { useCheckMobileScreen } from "../../utilities/hooks";
import { useSignal } from "@preact/signals-react";
import { ClickAwayListener } from "@mui/material";

export default function HelpTooltip({ caption, ...props }) {
  const isMobile = useCheckMobileScreen();
  const open = useSignal(false);

  const handleTooltipClose = () => {
    open.value = false;
  };

  const handleTooltipOpen = () => {
    open.value = true;
  };

  return (
    <Box
      style={{ padding: "0 5px" }}
      {...props}
    >
      <ClickAwayListener onClickAway={handleTooltipClose}>
        <Tooltip
          title={caption}
          disableTouchListener={isMobile}
          open={open.value}
          onClose={handleTooltipClose}
        >
          <IconButton onClick={handleTooltipOpen}>
            <HelpOutlineIcon />
          </IconButton>
        </Tooltip>
      </ClickAwayListener>
    </Box>
  );
}
