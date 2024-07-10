import { styled } from "@mui/system";
import StyledTextField from "../StyledTextField/index";
import { validateNumericInput } from "../../utilities/utils";

const TextFieldWrapper = styled(StyledTextField)`
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    /* display: none; <- Crashes Chrome on hover */
    -webkit-appearance: none;
    margin: 0; /* <-- Apparently some margin are still there even though it's hidden */
  }
  -moz-appearance: textfield;
`;

function NumericInput({
  onChange,
  blockSigns = true,
  blockExp = true,
  onKeyDown,
  ...props
}) {
  function onKeyDownClick(e) {
    const blockArray = [];
    if (blockSigns) {
      blockArray.push("+", "-");
    }
    if (blockExp) {
      blockArray.push("e", "E");
    }

    if (blockSigns || blockExp) {
      const res = blockArray.includes(e.key) && e.preventDefault();
      if (res) {
        e.preventDefault();
        return;
      }
    }
    onKeyDown && onKeyDown(e);
  }
  return (
    <TextFieldWrapper
      variant={"standard"}
      {...props}
      onKeyDown={onKeyDownClick}
      onChange={validateNumericInput(onChange)}
    />
  );
}

export default NumericInput;
