import { styled } from "@mui/material/styles";

import CustomDialog from "../CustomDialog/index.jsx";

const CustomDialogWrap = styled(CustomDialog)`
  padding: 20px;
`;

function SignUpDialog({ setOpen, isOpen = false, children }) {
  return (
    <CustomDialogWrap
      open={isOpen}
      setOpen={setOpen}
    >
      {children}
    </CustomDialogWrap>
  );
}

export default SignUpDialog;
