import { useSignal } from "@preact/signals-react";

import { styled } from "@mui/material/styles";
import { connect } from "react-redux";
import { getUserProfile } from "../../../redux/userProfile/selectors.js";
import { Button, CircularProgress, Typography } from "@mui/material";
import { NEW_BANK_ACCOUNT } from "../../../utilities/constants.js";
import {
  AddButtonWrap,
  ContentWrapper,
  PageWrapper,
  Title,
} from "../shared.js";
import NewAccount from "./components/NewAccount/index.jsx";
import AccountUI from "./components/AccountUI/index.jsx";
import {
  useGetUserAccountFromDBThunkQuery,
  useUpdateUserAccountDBThunkMutation,
} from "../../../redux/userAccount/reducers.js";
import { omit } from "lodash";
import { theme } from "../../../styles/theme.js";
import { CircularProgressWrap } from "../../../styles/common.js";
import { successHandler } from "../../../components/Toast/index.jsx";
import { ACCOUNT_MENU } from "../common.jsx";
import React from "react";

const AddButton = styled(Button)`
  /* color: inherit; */
`;

const AccountErrorText = styled(Typography)`
  color: ${theme.color.error};
  text-align: center;
  font-weight: bold;
  text-decoration: underline;
`;

function BankAccount({ userProfile, isMobile }) {
  const newBankAccount = useSignal(NEW_BANK_ACCOUNT);
  const addBankAccountFlag = useSignal(false);
  const editAccounts = useSignal({});
  const { uid } = userProfile;
  const { data, error, isLoading, isFetching } =
    useGetUserAccountFromDBThunkQuery({ uid });

  const [
    updateUserAccountDBThunk, // This is the mutation trigger
    { isLoading: isUpdating }, // This is the destructured mutation result
  ] = useUpdateUserAccountDBThunkMutation();

  const { bankAccounts = [] } = data || {};

  function addAccount() {
    addBankAccountFlag.value = true;
  }

  function cancelAddBankAccount() {
    addBankAccountFlag.value = false;
  }

  function onToggleAvailability(index) {
    const newBankAccounts = bankAccounts.map((el) => {
      return {
        ...el,
        isActive: false,
      };
    });

    newBankAccounts[index].isActive = !bankAccounts[index].isActive;

    updateUserAccountDBThunk({ uid, data: { bankAccounts: newBankAccounts } })
      .unwrap()
      .then(() => {
        // successHandler("נשמר בהצלחה")
      })
      .finally(() => {});
  }

  async function onSubmitNewBankAccount(newAccount) {
    const newBankAccounts = bankAccounts.map((el) => {
      return {
        ...el,
        isActive: false,
      };
    });
    newBankAccounts.unshift(newAccount);

    updateUserAccountDBThunk({
      uid,
      skipOptimistic: true,
      data: { bankAccounts: newBankAccounts },
    })
      .unwrap()
      .then(() => {
        successHandler("הוסף בהצלחה");
        cancelAddBankAccount();
      })
      .catch((err) => {});
  }

  function onEditBankAccount(editBankAccount, index) {
    editAccounts.value = { ...editAccounts.value, [index]: editBankAccount };
  }

  function onEditBankAccountSubmit(editedBankAccount, index) {
    const newBankAccounts = [...bankAccounts];

    newBankAccounts[index] = editedBankAccount;
    updateUserAccountDBThunk({
      uid,
      data: { bankAccounts: newBankAccounts },
    })
      .unwrap()
      .then(() => {
        successHandler("נשמר בהצלחה");
        editAccounts.value = omit(editAccounts.value, index);
      });
  }

  async function onDeleteBankAccount(editedBankAccount, index) {
    const newBankAccounts = [...bankAccounts];
    newBankAccounts.splice(index, 1);

    return updateUserAccountDBThunk({
      uid,
      data: { bankAccounts: newBankAccounts },
    }).unwrap();
  }

  function onEditBankAccountCancel(index) {
    editAccounts.value = omit(editAccounts.value, index);
  }

  function hasErrors() {
    if (!bankAccounts?.length) {
      return;
      // return "אין חשבון מוגדר"
    }
    const noActiveBank = !bankAccounts.filter((el) => el.isActive).length;

    if (noActiveBank) {
      return "אין חשבון פעיל";
    }
  }

  const accountSettingError = hasErrors();

  return (
    <PageWrapper>
      <Title
        variant="h6"
        noWrap
      >
        הגדרות חשבון בנק
      </Title>
      <ContentWrapper style={{ maxWidth: "540px" }}>
        {!uid ? (
          <CircularProgressWrap>
            <CircularProgress />
          </CircularProgressWrap>
        ) : (
          <>
            <AddButtonWrap>
              <AddButton
                variant="contained"
                onClick={addAccount}
              >
                <Typography>{"הוספת חשבון"}</Typography>
              </AddButton>
            </AddButtonWrap>

            {
              <AccountErrorText variant="h6">
                {accountSettingError}
              </AccountErrorText>
            }

            {addBankAccountFlag.value && (
              <NewAccount
                disabled={isUpdating}
                accountInit={newBankAccount.value}
                onSubmit={onSubmitNewBankAccount}
                onCancel={cancelAddBankAccount}
              />
            )}

            {isLoading || !data ? (
              <CircularProgressWrap>
                <CircularProgress />
              </CircularProgressWrap>
            ) : (
              bankAccounts?.map((bankAccount, index) => {
                const edit = editAccounts.value[index];

                if (edit) {
                  return (
                    <NewAccount
                      key={`${edit.bankKey}${edit.branchId}${edit.accountNumber}`}
                      disabled={isUpdating}
                      accountInit={edit}
                      onSubmit={(acc) => onEditBankAccountSubmit(acc, index)}
                      onCancel={() => onEditBankAccountCancel(index)}
                    />
                  );
                }
                return (
                  <AccountUI
                    // disableToggle={isUpdating}
                    key={`${bankAccount.bankKey}${bankAccount.branchId}${bankAccount.accountNumber}`}
                    bankAccount={bankAccount}
                    onToggleAvailability={() => onToggleAvailability(index)}
                    onEdit={() => onEditBankAccount(bankAccount, index)}
                    onDelete={() => onDeleteBankAccount(bankAccount, index)}
                  />
                );
              })
            )}
          </>
        )}
      </ContentWrapper>
    </PageWrapper>
  );
}

function mapStateToProps(state) {
  return {
    userProfile: getUserProfile(state),
  };
}

const Component = connect(mapStateToProps)(BankAccount);

export default Component;
