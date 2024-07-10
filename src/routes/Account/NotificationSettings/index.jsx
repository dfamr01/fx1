import { useSignal } from "@preact/signals-react";

import { styled } from "@mui/material/styles";
import { connect } from "react-redux";
import {
  Typography,
  FormGroup,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { getAuthIsLoggedIn } from "../../../redux/auth/selectors";
import { getUserProfile } from "../../../redux/userProfile/selectors";

import WithSideBar from "../../../layouts/WithSideBar/index";
import { ContentWrapper, PageWrapper, Title } from "../shared";
import { useEffect } from "react";
import { ElementsWrapper } from "../../../styles/common";
import { updateUserProfileThunk } from "../../../redux/userProfile/thunks";
import { errorHandler, successHandler } from "../../../components/Toast/index";
import { ACCOUNT_MENU } from "../common";
import HelpTooltip from "../../../components/HelpTooltip/index";

const Content = styled(ContentWrapper)`
  @media only screen and (max-width: 600px) {
    padding: 5px 5px;
  }
`;
const Category = styled(Typography)`
  font-weight: bold;
`;

const DEFAULT = { transactionsSms: false };

function NotificationSettings({ isMobile, userProfile }) {
  const notificationSignal = useSignal(
    userProfile?.notificationSettings || DEFAULT
  );
  const errorDetails = useSignal({});
  const isPending = useSignal(false);

  useEffect(() => {
    if (userProfile?.notificationSettings) {
      notificationSignal.value = userProfile.notificationSettings;
    }
  }, [userProfile]);

  function updateError({ name, value, required, hasError, errorText }) {
    errorDetails.value = {
      ...errorDetails.value,
      [name]: !!hasError || errorText || (required && !value),
    };
  }

  async function update(value) {
    try {
      isPending.value = true;
      const updateDate = { notificationSettings: value };
      await updateUserProfileThunk(userProfile.uid, updateDate);
      successHandler("עודכן בהצלחה");

      isPending.value = false;
    } catch (err) {
      errorHandler("ארע שגיאה");
      isPending.value = false;
    }
  }

  function onChange({ target: { name, value, checked, required } }) {
    notificationSignal.value = {
      ...notificationSignal.value,
      [name]: checked,
    };

    update(notificationSignal.value);
    updateError({ name, value: checked, required });
  }

  return (
    <WithSideBar
      showSideBar={!isMobile}
      sideBarMenu={ACCOUNT_MENU}
    >
      <PageWrapper>
        <ElementsWrapper style={{ width: "100%", maxWidth: "800px" }}>
          <Title
            variant="h6"
            noWrap
          >
            הגדרת התראות
          </Title>

          <Content>
            <Category
              variant="h6"
              dir="auto"
            >
              הגדרות סמס
            </Category>
            <FormGroup style={{ flexDirection: "row-reverse" }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={notificationSignal.value.transactionsSms}
                    onChange={onChange}
                    name={"transactionsSms"}
                  />
                }
                dir="auto"
                label="התראת עסקאות"
              />
              <HelpTooltip caption={"שליחת התראה על עדכון הוראה"} />
            </FormGroup>
          </Content>
        </ElementsWrapper>
      </PageWrapper>
    </WithSideBar>
  );
}

function mapStateToProps(state) {
  return {
    isLoggedIn: getAuthIsLoggedIn(state),
    userProfile: getUserProfile(state),
  };
}

const Component = connect(mapStateToProps)(NotificationSettings);

export default Component;
