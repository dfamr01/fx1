import { styled } from "@mui/material/styles";
import { Typography, Paper, Box } from "@mui/material";
import { theme } from "../../styles/theme.js";
import { SIDE_MENU_TYPE } from "../../utilities/constants.js";

export const PageWrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 100%;
  justify-content: flex-start;
  align-items: center;
  height: 100%;
  overflow: auto;
`;

export const ContentWrapper = styled("div")`
  padding: 5px 10px;
  /* overflow: auto; */
  height: 100%;
  display: flex;
  flex-direction: column;
  max-height: 100%;
  width: calc(100% - 20px);
`;

export const Title = styled(Typography)`
  margin: 0 auto 5px;
  font-size: 25px;
  text-align: center;
  user-select: none;
  color: ${theme.color.teal};
  flex: none;
`;

export const SettingTitle = styled(Typography)`
  color: ${theme.color.grayDark};
  user-select: none;
`;

export const AddButtonWrap = styled(Box)`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 5px;
`;
