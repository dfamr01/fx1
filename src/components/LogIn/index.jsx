import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import StyledTextField from "../StyledTextField/index.jsx";
import { validator } from "../../utilities/utils.js";
import { debounce } from "lodash";
import { errorHandler } from "../Toast/index.jsx";
import { theme } from "../../styles/theme.js";

import { firebaseAuthModule } from "../../utilities/firebase/firebaseAuth.js";
import CustomDialog from "../CustomDialog/index.jsx";
import { getAuthIsLoggedIn } from "../../redux/auth/selectors.js";
import LoadingButton from "../LoadingButton/index.jsx";

const Title = styled(Typography)`
  margin: 5px auto;
  text-align: center;
`;

const TextFieldWrapper = styled(StyledTextField)`
  margin: 10px 10px 20px 10px;
`;
const Error = styled(Typography)`
  color: ${theme.color.error};
`;

const ButtonWrap = styled(LoadingButton)`
  display: flex;
  width: 200px;
  margin: 10px auto;
  border-radius: 20px;
  margin-top: 10px;
  padding: 7px 16px;
`;

const DEFAULT_SIGN_IN_DETAILS = {
  email: null,
  password: "",
};

function LogIn({ isLoggedIn, open, setOpen }) {
  const [errorDetails, setErrorsDetails] = useState({
    general: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [signInDetails, setInDetails] = useState(DEFAULT_SIGN_IN_DETAILS);

  function updateError({ name, value, required, hasError, errorText }) {
    setErrorsDetails((prev) => {
      return {
        ...prev,
        [name]: !!hasError || errorText || (required && !value),
      };
    });
  }

  function setIsValidEmail(event) {
    const {
      target: { name, value, required },
    } = event;
    onChange(event);

    const isValid = validator.isValidEmail(value);

    if (!isValid) {
      updateError({ name: "email", value: value, errorText: "אימייל לא תקין" });
    } else {
      updateError({ name: "email", value: value, errorText: "" });
    }

    return isValid;
  }

  function onChange({ target: { name, value, required } }) {
    setInDetails((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });

    updateError({ name, value, required });
  }

  useEffect(() => {
    if (isLoggedIn && open) {
      setIsLoading(false);
      setOpen(false);
    }
  }, [isLoggedIn]);

  function onSubmit(e) {
    setErrorsDetails({});

    setIsLoading(true);
    e.preventDefault();
    firebaseAuthModule
      .signInWithEmailAndPassword(signInDetails.email, signInDetails.password)
      .then((result) => {
        // setOpen(false);
      })
      .catch((err) => {
        errorHandler(err);
        setErrorsDetails({ general: err?.message || err });
        setIsLoading(false);
      });
  }

  let disableSubmitConstraints = [
    signInDetails.password.length >= 6,
    validator.isValidEmail(signInDetails.email),
  ];

  const disableSubmit =
    isLoading || disableSubmitConstraints.filter((el) => !el).length;

  return (
    <CustomDialog
      open={open}
      setOpen={setOpen}
    >
      <form onSubmit={onSubmit}>
        <Title variant="h6">{"התחברות"}</Title>
        <TextFieldWrapper
          onChange={debounce(setIsValidEmail, 300)}
          name={"email"}
          required
          label="אימייל"
          hasError={errorDetails?.email}
          error={errorDetails?.email}
          onBlur={setIsValidEmail}
        />
        <TextFieldWrapper
          onChange={onChange}
          name={"password"}
          type="password"
          autoComplete="current-password"
          required
          label="סיסמה"
          hasError={errorDetails?.password}
          error={errorDetails?.password}
          onBlur={(e) => {
            const {
              target: { name, value, required },
            } = e;
            if (value.length < 6) {
              updateError({
                name,
                value,
                required,
                errorText: "מינימום 6 תווים",
              });
            }
          }}
        />

        <Error
          variant="body2"
          gutterBottom
        >
          {errorDetails.general}
        </Error>

        <ButtonWrap
          disabled={!!disableSubmit}
          variant="contained"
          type="submit"
          isLoading={isLoading}
          loadingCaption={"מתחבר"}
          caption={"התחבר"}
        />
      </form>
    </CustomDialog>
  );
}

function mapStateToProps(state) {
  return {
    isLoggedIn: getAuthIsLoggedIn(state),
  };
}

const Component = connect(mapStateToProps)(LogIn);
export default Component;
