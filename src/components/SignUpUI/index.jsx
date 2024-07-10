import { useSearchParams } from "react-router-dom";
import { useSignal } from "@preact/signals-react";

import { ElementsWrapper } from "../../styles/common.js";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import StyledTextField from "../StyledTextField/index.jsx";
import { Button } from "@mui/material";
import { theme } from "../../styles/theme.js";
import { debounce, isString } from "lodash";
// import GoogleSignInButtonImg from '../../assets/static/general/google-sign-in.png';
import ImageInput from "../ImageInput/index.jsx";
import { userDB } from "../../apis/user/user.db.js";
import PhoneNumberInput from "../PhoneNumberInput/index.jsx";
import { hasError, validator } from "../../utilities/utils.js";
import { errorHandler } from "../Toast/index.jsx";
import LoadingButton from "../LoadingButton/index.jsx";

const Title = styled(Typography)`
  margin: 5px auto;
`;

const AvatarText = styled(Typography)`
  margin: 3px auto;
  font-size: 15px;
  color: gray;
`;

const RowWrapper = styled("div")`
  display: flex;
`;

const RowPhoneAgentWrapper = styled("div")`
  display: flex;
  @media only screen and (max-width: 600px) {
    flex-direction: column;
  }
`;

const TextFieldWrapper = styled(StyledTextField)`
  margin: 10px;
`;

const StyledAvatarWrap = styled(ImageInput)`
  margin: 0 auto;
  cursor: pointer;
  --dim: 60px;
  height: var(--dim);
  width: var(--dim);
`;

const ButtonWrap = styled(LoadingButton)`
  display: flex;
  width: 200px;
  margin: 10px auto;
  border-radius: 20px;
  padding: 8px 16px;
`;

const DEFAULT_SIGN_UP_DETAILS = {
  avatarFile: null,
  email: "",
  firstName: "",
  lastName: "",
  nickName: "",
  password: "",
  passwordValidation: "",
  phoneNumber: "",
  agentSuid: "",
  agentUid: "",
};
//
//
// const GoogleButton = styled("input")`
//   display: flex;
//   height: 50px;
//   border-radius: 5px;
//   margin: 0 auto;
//   border: 2px solid lightgray;
//
//   &:hover {
//     border: 2px solid gray;
//   }
//
//   cursor: ${({isLoading}) => isLoading ? 'not-allowed' : 'pointer'};
//   opacity: ${({isLoading}) => isLoading ? 0.8 : 1};
//
// `;

const Error = styled(Typography)``;

function SignUpUI({
  title,
  isAgent = false,
  signInWithGoogle,
  onSubmit,
  errors,
  setErrors,
}) {
  let [searchParams, setSearchParams] = useSearchParams();
  const signupDetails = useSignal({
    ...DEFAULT_SIGN_UP_DETAILS,
    agentSuid: searchParams.get("agentId") || "",
  });

  const [errorDetails, setErrorsDetails] = useState({});

  function onAvatarChanged(file) {
    signupDetails.value.avatarFile = file;
  }

  async function handleSignup(e) {
    e.preventDefault();

    if (!isAgent) {
      const e = {
        target: {
          name: "agentSuid",
          value: signupDetails.value.agentSuid,
          required: true,
        },
      };
      setErrors((prev) => {
        return {
          ...prev,
          isLoading: true,
        };
      });
      const res = await onAgentCode(e);
      if (!res) {
        errorHandler("סוכן לא נמצא\nצור קשר עם סוכן לקבלת קוד סוכן תקין");
        setErrors((prev) => {
          return {
            ...prev,
            isLoading: false,
          };
        });
        return;
      }
    }

    onSubmit(signupDetails.value);
  }

  function updateError({ name, value, required, hasError, errorText }) {
    setErrorsDetails((prev) => {
      return {
        ...prev,
        [name]: !!hasError || errorText || (required && !value),
      };
    });
  }

  function onChange({ target: { name, value, required } }) {
    signupDetails.value[name] = value;

    updateError({ name, value, required });
  }

  function onBlur({ target: { name, value, required } }) {
    updateError({
      name,
      value,
      required,
    });
  }

  function onPasswordValidation(event) {
    onChange(event);
    const {
      target: { name, value, required },
    } = event;

    if (signupDetails.value.password !== value) {
      updateError({
        name,
        value,
        required,
        errorText: "הסיסמה לא זהה",
      });
    }
  }

  async function checkAgentNickNameExist(suid) {
    try {
      const { data, error } = await userDB.get({ suid: suid });
      return {
        data,
        error,
      };
    } catch (err) {
      return {
        error: err,
      };
    }
  }

  async function onAgentNickName(event) {
    onChange(event);
    const {
      target: { name, value, required },
    } = event;

    if (!value) {
      updateError(event);
      return;
    }

    if (!validateEnglishInput(event)) {
      return;
    }

    const { data, error } = await checkAgentNickNameExist(value);

    if (data) {
      updateError({
        name,
        value,
        required,
        errorText: "כינוי בשימוש אנא הזן חדש",
      });
      return;
    }
    if (error) {
      errorHandler(error);
      updateError({
        name,
        value,
        required,
        errorText: error?.message || error,
      });
    }
  }

  async function onAgentCode(event) {
    onChange(event);
    const {
      target: { name, value, required },
    } = event;

    if (!value) {
      return false;
    }

    if (!validateEnglishInput(event)) {
      return false;
    }

    const { data, error } = await checkAgentNickNameExist(value);

    if (!data) {
      updateError({
        name,
        value,
        required,
        errorText: "סוכן לא נמצא",
      });
      return false;
    }

    if (error) {
      updateError({
        name,
        value,
        required,
        errorText: error,
      });
      return false;
    }
    signupDetails.value.agentUid = data.uid;

    return true;
  }

  function setIsPhoneValid(input, required) {
    let phone = input;

    const isValid = (!phone && required) || validator.isPhoneValid(phone);

    if (!isValid) {
      updateError({
        name: "phoneNumber",
        value: input,
        errorText: "מספר לא תקין",
      });
    } else {
      updateError({
        name: "phoneNumber",
        value: input,
        errorText: "",
        required,
      });
    }

    return isValid;
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

  function validateEnglishInput(event) {
    const {
      target: { name, value, required },
    } = event;

    const isValid = validator.isEnglish(value);
    if (!isValid) {
      updateError({ name, value: value, errorText: "כינוי באנגלית בלבד" });
    } else {
      updateError({ name, value: value, errorText: "", required });
    }

    return isValid;
  }

  let disableSubmitConstraintsClient = [
    signupDetails.value.lastName,
    signupDetails.value.firstName,
    signupDetails.value.agentSuid,
    validator.isPhoneValid(signupDetails.value.phoneNumber),
    validator.isEnglish(signupDetails.value.agentSuid),
    signupDetails.value.password &&
      signupDetails.value.password === signupDetails.value.passwordValidation,
    validator.isValidEmail(signupDetails.value.email),
  ];

  let disableSubmitConstraintsAgent = [
    signupDetails.value.lastName,
    signupDetails.value.firstName,
    signupDetails.value.nickName,
    validator.isEnglish(signupDetails.value.nickName),
    signupDetails.value.password &&
      signupDetails.value.password === signupDetails.value.passwordValidation,
    validator.isPhoneValid(signupDetails.value.phoneNumber),
    validator.isValidEmail(signupDetails.value.email),
  ];

  const disableConstraints = isAgent
    ? disableSubmitConstraintsAgent
    : disableSubmitConstraintsClient;

  const disableSubmit =
    disableConstraints.filter((el) => !el).length || hasError(errorDetails);

  return (
    <form onSubmit={handleSignup}>
      <ElementsWrapper>
        <Title variant="h6">{title}</Title>

        <StyledAvatarWrap onChange={onAvatarChanged} />
        <AvatarText>העלאת תמונה\לוגו</AvatarText>

        <RowWrapper style={{ flexDirection: "row-reverse" }}>
          <TextFieldWrapper
            onChange={onChange}
            name={"firstName"}
            required
            label="שם"
            hasError={errorDetails?.firstName}
            error={errorDetails?.firstName}
            onBlur={onBlur}
          />

          <TextFieldWrapper
            onChange={onChange}
            name={"lastName"}
            required
            label="שם משפחה"
            hasError={errorDetails?.lastName}
            error={errorDetails?.lastName}
            onBlur={onBlur}
          />
        </RowWrapper>

        <RowWrapper style={{ flexDirection: "row-reverse" }}>
          <TextFieldWrapper
            onChange={onChange}
            type="password"
            autoComplete="new-password"
            name={"password"}
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
              if (signupDetails.value.passwordValidation) {
                onPasswordValidation({
                  target: {
                    value: signupDetails.value.passwordValidation,
                    name: "passwordValidation",
                  },
                });
              }
            }}
          />

          <TextFieldWrapper
            onChange={debounce(onPasswordValidation, 500)}
            type="password"
            autoComplete="new-password"
            // autoComplete="off"
            name={"passwordValidation"}
            required
            label="הזן סיסמה בשנית"
            hasError={errorDetails?.passwordValidation}
            error={errorDetails?.passwordValidation}
            onBlur={onPasswordValidation}
          />
        </RowWrapper>

        <TextFieldWrapper
          onChange={debounce(setIsValidEmail, 300)}
          name={"email"}
          required
          label="אימייל"
          hasError={errorDetails?.email}
          error={errorDetails?.email}
          onBlur={onBlur}
        />

        <RowPhoneAgentWrapper>
          <PhoneNumberInput
            error={errorDetails.phoneNumber}
            required={!!isAgent}
            country={"il"}
            name={"phoneNumber"}
            placeholder="מספר טלפון"
            // value={mobilePhoneNumber}
            onChange={(value) => {
              if (value?.length > 0 && value[0] !== "+") {
                value = "+" + value;
              }
              const e = {
                target: { name: "phoneNumber", value: value ? value : "" },
              };
              onChange(e);
              setIsPhoneValid(value, !!isAgent);
              // onChange(e, !isPhoneValid(value));
            }}
          />

          {isAgent && (
            <TextFieldWrapper
              pattern="[A-Za-z]"
              onChange={debounce(onAgentNickName, 400)}
              style={{ marginLeft: "auto" }}
              name={"nickName"}
              required
              label="כינוי"
              // onBlur={(e) => {
              //   const { target: { name, value } } = e;

              //   if (value && !validateEnglishInput(e) || signupDetails.value.nickName === value) {
              //     return;
              //   }
              //   onAgentNickName(e);
              // }}
              hasError={errorDetails?.nickName}
              error={errorDetails?.nickName}
            />
          )}
          {!isAgent && (
            <TextFieldWrapper
              key={"agentSuid"}
              defaultValue={signupDetails.value.agentSuid}
              onChange={debounce(onAgentCode, 400)}
              style={{ marginLeft: "auto" }}
              name={"agentSuid"}
              required
              label="קוד סוכן"
              // onBlur={(e) => {
              //   const { target: { name, value } } = e;
              //   validateEnglishInput(e);
              //   if (signupDetails.value.agentSuid === value) {
              //     e.stopPropagation();
              //     return;
              //   }
              //   onAgentCode(e);
              // }}
              // onBlur={onAgentCode}
              hasError={errorDetails?.agentSuid}
              error={errorDetails?.agentSuid}
            />
          )}
        </RowPhoneAgentWrapper>
        {/*<TextFieldWrapper*/}
        {/*    onChange={onChange}*/}
        {/*    type="tel"*/}
        {/*    required={!!isAgent}*/}
        {/*    // style={{marginLeft: "auto"}}*/}
        {/*    name={"phoneNumber"}*/}
        {/*    label="מספר טלפון"*/}
        {/*    onBlur={onBlur}*/}
        {/*    hasError={errorDetails?.phoneNumber}*/}
        {/*    error={errorDetails?.phoneNumber}*/}
        {/*/>*/}

        <Error
          dir={"auto"}
          variant="body2"
          gutterBottom
          style={{
            visibility: errors?.general ? "visible" : "hidden",
            color: theme.color.error,
          }}
        >
          {isString(errors?.general) ? errors.general : "skeleton"}
        </Error>

        <ButtonWrap
          disabled={!!disableSubmit}
          variant="contained"
          type="submit"
          isLoading={errors?.isLoading}
          caption={"הירשם"}
        />
        {/*<GoogleButton*/}
        {/*    type="image"*/}
        {/*    // disabled={isLoading}*/}
        {/*    // isLoading={isLoading}*/}
        {/*    src={GoogleSignInButtonImg}*/}
        {/*    onClick={signInWithGoogle}*/}
        {/*/>*/}
      </ElementsWrapper>
    </form>
  );
}

export default SignUpUI;
