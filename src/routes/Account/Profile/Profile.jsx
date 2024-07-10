import { useSignal } from "@preact/signals-react";

import { styled } from "@mui/material/styles";
import { connect } from "react-redux";
import { Typography } from "@mui/material";
import { getAuthIsLoggedIn } from "../../../redux/auth/selectors";
import { getUserProfile } from "../../../redux/userProfile/selectors";
import {
  debounceFunction,
  hasError,
  validator,
} from "../../../utilities/utils";
import WithSideBar from "../../../layouts/WithSideBar/index";
import { ContentWrapper, PageWrapper, Title } from "../shared";
import StyledTextField from "../../../components/StyledTextField/index";
import { isEqual } from "lodash";
import PhoneNumberInput from "../../../components/PhoneNumberInput/index";
import { useEffect, useRef } from "react";
import {
  AcceptActionButton,
  CancelActionButton,
  EditActionButton,
  ElementsWrapper,
} from "../../../styles/common";
import ImageInput from "../../../components/ImageInput/index";
import storageFB from "../../../utilities/firebase/storage";
import { updateUserProfileThunk } from "../../../redux/userProfile/thunks";
import { errorHandler, successHandler } from "../../../components/Toast/index";

const RowWrapper = styled("div")`
  display: flex;
  justify-content: flex-end;
`;
const Content = styled(ContentWrapper)`
  @media only screen and (max-width: 600px) {
    padding: 5px 5px;
  }
`;

const StyledAvatarWrap = styled(ImageInput)`
  margin: 0 auto;
  cursor: pointer;
  --dim: 60px;
  height: var(--dim);
  min-height: var(--dim);
  width: var(--dim);
  min-width: var(--dim);
`;

const TextFieldWrapper = styled(StyledTextField)`
  margin: 10px;
`;

const ActionButtonWrap = styled("div")`
  display: flex;
  width: 100%;
  justify-content: space-between;
  max-width: 100vw;
`;

const ButtonText = styled(Typography)`
  font-weight: 500;
  text-align: center;
  color: inherit;
`;

function Profile({ isMobile, userProfile }) {
  const userProfileSignal = useSignal(userProfile);
  const avatarFile = useSignal({ file: null });
  const errorDetails = useSignal({});
  const isPending = useSignal(false);
  const imgResetRef = useRef(null);
  const edit = useSignal(false);

  useEffect(() => {
    userProfileSignal.value = userProfile;
  }, [userProfile]);

  function updateError({ name, value, required, hasError, errorText }) {
    errorDetails.value = {
      ...errorDetails.value,
      [name]: !!hasError || errorText || (required && !value),
    };
  }

  function onChange({ target: { name, value, required } }) {
    userProfileSignal.value = {
      ...userProfileSignal.value,
      [name]: value,
    };

    updateError({ name, value, required });
  }

  function onAvatarChanged(file) {
    avatarFile.value = { file };
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
      updateError({ name: "phoneNumber", value: input, errorText: "" });
    }

    return isValid;
  }

  function onBlur({ target: { name, value, required } }) {
    updateError({
      name,
      value,
      required,
    });
  }

  function setIsValidEmail(event) {
    const {
      target: { name, value, required },
    } = event;
    onChange(event);

    const isValid = validator.isValidEmail(value);

    if (!isValid) {
      updateError({ name, value, errorText: "אימייל לא תקין" });
    } else {
      updateError({ name, value, errorText: "" });
    }

    return isValid;
  }

  async function onSubmit(e) {
    e.preventDefault();
    isPending.value = true;
    let uploadImageFileRes;
    try {
      if (avatarFile.value.file) {
        uploadImageFileRes = await storageFB.uploadImageFile({
          path: "avatars",
          name: `${avatarFile.value.file.name}`,
          file: avatarFile.value.file,
          maxHeight: 100,
          maxWidth: 100,
        });

        userProfileSignal.value = {
          ...userProfileSignal.value,
          avatar: {
            photoName: uploadImageFileRes.metadata?.name || null,
            photoRef: uploadImageFileRes.metadata?.fullPath || null,
            photoBucket: uploadImageFileRes.metadata?.bucket || null,
            photoURL: uploadImageFileRes.downloadURL || null,
          },
        };
      }
      await updateUserProfileThunk(userProfile.uid, userProfileSignal.value);
      isPending.value = false;
      avatarFile.value = { file: null };
      edit.value = false;
      successHandler("עודכן בהצלחה");
    } catch (err) {
      errorHandler("ארע שגיאה");
      isPending.value = false;
    }
  }

  function onCancel() {
    edit.value = false;
    userProfileSignal.value = userProfile;
    avatarFile.value = { file: null };
    imgResetRef.current();
  }

  function onEdit() {
    edit.value = true;
  }

  //if one of the conditions is false button is disabled
  let submitConstraints = [
    !isPending.value,
    userProfileSignal.value.lastName,
    userProfileSignal.value.firstName,
    validator.isPhoneValid(userProfileSignal.value.phoneNumber),
    validator.isValidEmail(userProfileSignal.value.email),
    isEqual(userProfile, userProfileSignal.value) //if the profile didnt changed but the avatar did
      ? avatarFile.value.file
        ? true
        : false
      : true,
  ];

  const disableSubmit =
    submitConstraints.filter((el) => !el).length ||
    hasError(errorDetails.value);

  return (
    <PageWrapper>
      <ElementsWrapper>
        <Title
          variant="h6"
          noWrap
        >
          הגדרות פרופיל
        </Title>

        <form onSubmit={onSubmit}>
          <Content>
            <StyledAvatarWrap
              disabled={!edit.value}
              resetRef={imgResetRef}
              onChange={onAvatarChanged}
              src={userProfileSignal.value?.avatar?.photoURL}
            />
            <RowWrapper>
              <TextFieldWrapper
                disabled={!edit.value}
                value={userProfileSignal.value.lastName}
                onChange={onChange}
                name={"lastName"}
                required
                label="שם משפחה"
                hasError={errorDetails.value?.lastName}
                error={errorDetails.value?.lastName}
                onBlur={onBlur}
              />
              <TextFieldWrapper
                disabled={!edit.value}
                value={userProfileSignal.value.firstName}
                onChange={onChange}
                name={"firstName"}
                required
                label="שם"
                hasError={errorDetails.value?.firstName}
                error={errorDetails.value?.firstName}
                onBlur={onBlur}
              />
            </RowWrapper>

            <TextFieldWrapper
              disabled={!edit.value}
              value={userProfileSignal.value.email}
              onChange={(event) => {
                onChange(event);
                debounceFunction(() => {
                  setIsValidEmail(event);
                }, 500);
              }}
              name={"email"}
              required
              label="אימייל"
              hasError={errorDetails.value?.email}
              error={errorDetails.value?.email}
              onBlur={onBlur}
            />

            <RowWrapper>
              {userProfileSignal.value.suid && (
                <TextFieldWrapper
                  value={userProfileSignal.value.suid}
                  name={"nickName"}
                  disabled
                  label="קוד סוכן"
                />
              )}

              {
                <PhoneNumberInput
                  disabled={!edit.value}
                  value={userProfileSignal.value.phoneNumber}
                  error={errorDetails.value.phoneNumber}
                  country={"il"}
                  name={"phoneNumber"}
                  placeholder="מספר טלפון"
                  // value={mobilePhoneNumber}
                  onChange={(value) => {
                    if (value?.length > 0 && value[0] !== "+") {
                      value = "+" + value;
                    }
                    const e = {
                      target: {
                        name: "phoneNumber",
                        value: value ? value : "",
                      },
                    };
                    onChange(e);

                    setIsPhoneValid(value);
                    // onChange(e, !isPhoneValid(value));
                  }}
                />
              }
            </RowWrapper>

            <ActionButtonWrap>
              {!edit.value ? (
                <EditActionButton
                  style={{ marginLeft: "auto" }}
                  variant="outlined"
                  onClick={onEdit}
                >
                  <ButtonText>ערוך</ButtonText>
                </EditActionButton>
              ) : (
                <>
                  <CancelActionButton
                    variant="outlined"
                    onClick={onCancel}
                  >
                    <ButtonText>בטל</ButtonText>
                  </CancelActionButton>
                  <AcceptActionButton
                    disabled={!!disableSubmit}
                    type="submit"
                  >
                    <ButtonText>שמור</ButtonText>
                  </AcceptActionButton>
                </>
              )}
            </ActionButtonWrap>
          </Content>
        </form>
      </ElementsWrapper>
    </PageWrapper>
  );
}

function mapStateToProps(state) {
  return {
    isLoggedIn: getAuthIsLoggedIn(state),
    userProfile: getUserProfile(state),
  };
}

const Component = connect(mapStateToProps)(Profile);

export default Component;
