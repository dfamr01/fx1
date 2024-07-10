import { useSignal } from "@preact/signals-react";

import { signal, computed, effect, batch } from "@preact/signals-core";

import { styled } from "@mui/material/styles";
import { connect } from "react-redux";
import {
  Avatar,
  Box,
  Button,
  Divider,
  Switch,
  Typography,
} from "@mui/material";
import { getAuthIsLoggedIn } from "../../../../../redux/auth/selectors.js";
import { getUserProfile } from "../../../../../redux/userProfile/selectors.js";
import { theme } from "../../../../../styles/theme.js";
import { BANKS } from "../../../../../utilities/constants.js";
import CloseButton from "../../../../../components/CloseButton/index.jsx";
import { successHandler } from "../../../../../components/Toast/index.jsx";

const Wrap = styled("div")`
  padding: 10px 10px;
  margin-top: 10px;
  display: flex;
  flex-direction: row-reverse;
  flex-wrap: wrap;
  background-color: ${theme.color.grayLight};
  border-radius: 10px;
`;

const TitleDaysWrap = styled("div")`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  width: 100%;
`;

const SwitchWrapper = styled("div")`
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  width: 100%;
  justify-content: space-between;
`;

const TitleIconWrap = styled("div")`
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
`;

const Title = styled(Typography)`
  font-weight: bold;
  user-select: none;
`;

const AccountTextContentWrap = styled("div")`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`;

const AccountTextWrap = styled("div")`
  display: flex;
  flex-direction: row-reverse;
`;

const AccountText = styled(Typography)`
  font-weight: 500;
  /* text-align: end; */
`;

const AccountTextDetail = styled(Typography)`
  color: #525252;
  padding: 0 3px;
`;

const ActionButtonWrap = styled("div")`
  position: relative;
`;

const ActionInnerButtonWrap = styled("div")`
  position: absolute;
  display: flex;
  bottom: 0;
  left: 0;
`;

const EditButton = styled(Button)`
  /* position: absolute;
  bottom: 0;
  left: 0; */
`;

const DeleteButton = styled(Button)`
  font-weight: 500;
  /* text-align: end; */
  color: red;
`;

function AccountUI({
  className,
  disableToggle,
  bankAccount,
  onToggleAvailability,
  onEdit,
  onDelete,
}) {
  const deleteFlag = useSignal(false);

  function onEditClick(e) {
    onEdit(bankAccount);
  }

  function onDeleteClick(e) {
    deleteFlag.value = true;
    onDelete(bankAccount)
      .then(() => {
        successHandler("נמחק בהצלחה");
      })
      .finally(() => {
        deleteFlag.value = false;
      });
  }

  return (
    <Wrap
      className={className}
      style={{ opacity: deleteFlag.value ? 0.6 : 1 }}
    >
      <TitleDaysWrap>
        <SwitchWrapper>
          <TitleIconWrap>
            <Title>חשבון בנק</Title>
            <Avatar
              style={{ margin: "0 5px", width: 30, height: 30 }}
              src={BANKS[bankAccount.bankKey]?.iconImage}
            />
          </TitleIconWrap>

          <Switch
            disabled={disableToggle}
            checked={bankAccount.isActive}
            onChange={onToggleAvailability}
          />
        </SwitchWrapper>
      </TitleDaysWrap>

      <Divider
        style={{
          margin: "10px 0",
          width: "100%",
        }}
      />

      <AccountTextContentWrap>
        <AccountTextWrap>
          <AccountText dir="auto">{"בנק:"}</AccountText>
          <AccountTextDetail>
            {BANKS[bankAccount.bankKey]?.value} |{" "}
            {BANKS[bankAccount.bankKey]?.bankId}
          </AccountTextDetail>
        </AccountTextWrap>

        <AccountTextWrap>
          <AccountText dir="auto">{"סניף:"}</AccountText>
          <AccountTextDetail>{bankAccount.branchId}</AccountTextDetail>
        </AccountTextWrap>

        <AccountTextWrap>
          <AccountText dir="auto">{"מספר חשבון:"}</AccountText>
          <AccountTextDetail>{bankAccount.accountNumber}</AccountTextDetail>
        </AccountTextWrap>
      </AccountTextContentWrap>

      <ActionButtonWrap>
        <ActionInnerButtonWrap>
          <DeleteButton
            disabled={deleteFlag.value}
            onClick={onDeleteClick}
          >
            מחיקה
          </DeleteButton>
          <EditButton
            disabled={deleteFlag.value}
            onClick={onEditClick}
          >
            ערוך
          </EditButton>
        </ActionInnerButtonWrap>
      </ActionButtonWrap>
    </Wrap>
  );
}

function mapStateToProps(state) {
  return {
    isLoggedIn: getAuthIsLoggedIn(state),
    userProfile: getUserProfile(state),
  };
}

const Component = connect(mapStateToProps)(AccountUI);

export default Component;
