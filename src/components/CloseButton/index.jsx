import { styled } from "@mui/material/styles";

import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import CancelIcon from "@mui/icons-material/Cancel";
import { connect } from "react-redux";

const CancelWrap = styled(CancelIcon)`
  color: #b3b3b3;
`;

const CloseIconWrap = styled(CloseIcon)`
  color: #b3b3b3;
  border-radius: 50%;
  background-color: gainsboro;
  width: 20px;
  height: 20px;
  padding: 3px;
`;

function CloseButton({ onClick, ...props }) {
  return (
    <IconButton
      {...props}
      // style={{ position: "absolute", top: "0", right: "0" }}
      onClick={onClick}
    >
      <CloseIconWrap />
    </IconButton>
  );
}
export default CloseButton;
