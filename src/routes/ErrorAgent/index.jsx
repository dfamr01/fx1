import WithSideBar from "../../layouts/WithSideBar/index.jsx";
import { styled } from "@mui/material/styles";

const Text = styled("p")`
  text-align: center;
  font-size: 30px;
`;

export default function ErrorAgent() {
  return (
    <WithSideBar>
      <Text>סוכן לא נמצא</Text>
    </WithSideBar>
  );
}
