import React from "react";
import { css, styled } from "@mui/material/styles";
import PhoneInput from "react-phone-input-2";

import "react-phone-input-2/lib/style.css";
import { theme } from "../../styles/theme.js";
import { isString } from "lodash";
import Typography from "@mui/material/Typography";
//
const Wrap = styled("div")`
  display: flex;
  flex-direction: column;
  position: relative;
  max-width: 100%;
  margin: 10px;
  height: 56px;
  .react-tel-input {
    height: 100%;
  }

  .form-control {
    width: 100%;
  }

  .flag-dropdown,
  .form-control {
    height: 100%;
    ${({ error }) =>
      error &&
      css`
        border: 1px solid ${theme.color.error};
      `}
  }
`;

const Wrapper = styled("div")`
  display: flex;
  flex-direction: column;
  position: relative;
`;

const TypographyWrapper = styled(Typography)`
  bottom: -25px;
  padding: 0 5px;
  position: absolute;
`;

function PhoneNumberInput({ error, name, required, ...props }) {
  return (
    <Wrap error={error}>
      <PhoneInput
        {...props}
        inputProps={{
          required,
          name,
          type: "tel",
        }}
      />
      <TypographyWrapper
        dir={"auto"}
        variant="caption"
        display="block"
        gutterBottom
        style={{
          visibility: error ? "visible" : "hidden",
          color: theme.color.error,
        }}
      >
        {isString(error) ? error : ""}
      </TypographyWrapper>
    </Wrap>
  );
}

PhoneNumberInput.propTypes = {};

export default PhoneNumberInput;
