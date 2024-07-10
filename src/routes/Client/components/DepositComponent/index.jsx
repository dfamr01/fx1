import React, { useState } from "react";
import { Button } from "@mui/material";
import CustomDialog from "../../../../components/CustomDialog/index.jsx";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import List from "@mui/material/List";
import Avatar from "@mui/material/Avatar";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import {
  DEPOSIT_OPTIONS,
  DEPOSIT_OPTIONS_IMG,
  TRANSACTION_TYPE,
} from "../../../../utilities/constants.js";
import {
  OpenWhatsapp,
  getTransactionUrl,
} from "../../../../utilities/utils.js";
import CashDepositModal from "../CashDepositModal/index.jsx";
import BankDepositModal from "../BankDepositModal/index.jsx";
import { errorHandler } from "../../../../components/Toast/index.jsx";
import { transactionDB } from "../../../../apis/transactions/transaction.db.js";
import { messagesDB } from "../../../../apis/user/messages.db.js";

// eslint-disable-next-line react/prop-types
export default function DepositComponent({
  depositOptions,
  depositOptionsLimits = {},
  bankAccounts,
  disabled,
  agent,
  user,
  amount,
  currency,
}) {
  const [openDepositMethodsDialog, setOpenDepositMethodsDialog] =
    useState(false);
  const [openCashModal, setOpenCashModal] = useState(false);
  const [openBankModal, setOpenBankModal] = useState(false);
  const depositCurrencyLimitObject = depositOptionsLimits[currency.key];

  const handleClickOpen = () => {
    setOpenDepositMethodsDialog(true);
  };

  async function createTransaction({ method }) {
    try {
      const { uid: agentUid, suid: agentSuid } = agent;
      const { uid, suid } = user;
      const newTransaction = await transactionDB.create({
        uid,
        suid,
        agentUid,
        agentSuid,
        type: TRANSACTION_TYPE.DEPOSIT.key,
        method,
        amount: amount,
        currencyKey: currency.key,
      });

      if (agent?.notificationSettings?.transactionsSms) {
        const symbolizedAmount = `${currency.symbol}${amount}`;
        messagesDB.sendTransactionText({
          uid,
          suid,
          toUid: agentUid,
          toSuid: agentSuid,
          to: agent.phoneNumber,
          symbolizedAmount,
          transactionId: newTransaction.id,
          transactionValue: TRANSACTION_TYPE.DEPOSIT.value,
          displayName: user.displayName,
          agentRecipient: true,
        });
      }
      return true;
    } catch (err) {
      errorHandler(err);
      return false;
    }
  }

  const symbolizedAmount = `${currency.symbol}${amount}`;

  function checkMinimumDeposit(el) {
    if (amount < depositCurrencyLimitObject[el.key]?.min) {
      errorHandler(
        `מינימום הפקדה ${currency.symbol}${
          depositCurrencyLimitObject[el.key]?.min
        }`
      );
      setOpenDepositMethodsDialog(false);
      return false;
    }
    return true;
  }

  const handleListItemClick = async (el) => {
    if (!checkMinimumDeposit(el)) {
      return;
    }

    const res = await createTransaction({ method: el.key });
    if (!res) {
      return;
    }

    // eslint-disable-next-line react/prop-types
    const symbolizedAmountEncoded = encodeURIComponent(symbolizedAmount);
    const messageEncoded =
      encodeURIComponent(el.text) + symbolizedAmountEncoded;
    OpenWhatsapp(agent.phoneNumber, messageEncoded);
    setOpenDepositMethodsDialog(false);
  };

  function handleDepositCashOptionClick(el) {
    if (!checkMinimumDeposit(el)) {
      return;
    }
    setOpenDepositMethodsDialog(false);
    setOpenCashModal(true);
  }

  function getBankAccount(bankAccounts) {
    return bankAccounts?.find(({ isActive }) => isActive);
  }

  function handleDepositBankOptionClick(el) {
    if (!checkMinimumDeposit(el)) {
      return;
    }
    setOpenDepositMethodsDialog(false);
    const bank = getBankAccount(bankAccounts);
    if (!bank) {
      errorHandler("אין חשבון בנק מוגדר לסוכן \n אנא אעדכן סוכן");
      return;
    }
    setOpenBankModal(true);
  }

  function onClickCrypto() {
    window.open("/crypto-guide", "_blank");
    setOpenDepositMethodsDialog(false);
  }

  const keyFuncMap = {
    [DEPOSIT_OPTIONS.CASH.key]: handleDepositCashOptionClick,
    [DEPOSIT_OPTIONS.BANK_TRANSFER.key]: handleDepositBankOptionClick,
    [DEPOSIT_OPTIONS.BIT.key]: handleListItemClick,
    [DEPOSIT_OPTIONS.PAY_BOX.key]: handleListItemClick,
    [DEPOSIT_OPTIONS.CRYPTO.key]: onClickCrypto,
  };

  return (
    <>
      <Button
        onClick={handleClickOpen}
        disabled={disabled}
        style={{ margin: "0 10px" }}
        variant="contained"
      >
        הפקדה
      </Button>

      {openCashModal && (
        <CashDepositModal
          createTransaction={() =>
            createTransaction({ method: DEPOSIT_OPTIONS.CASH.key })
          }
          phoneNumber={agent.phoneNumber}
          amount={symbolizedAmount}
          text={DEPOSIT_OPTIONS.CASH.text}
          open={openCashModal}
          setOpen={setOpenCashModal}
        />
      )}
      {openBankModal && (
        <BankDepositModal
          bankAccount={bankAccounts?.find(({ isActive }) => isActive)}
          agent={agent}
          amount={symbolizedAmount}
          text={DEPOSIT_OPTIONS.CASH.text}
          open={openBankModal}
          setOpen={setOpenBankModal}
          createTransaction={() =>
            createTransaction({ method: DEPOSIT_OPTIONS.BANK_TRANSFER.key })
          }
        />
      )}

      {openDepositMethodsDialog && (
        <CustomDialog
          open={openDepositMethodsDialog}
          setOpen={setOpenDepositMethodsDialog}
          caption={"בחר שיטת הפקדה"}
          showCloseButton={false}
        >
          <List sx={{ pt: 0 }}>
            {Object.values(DEPOSIT_OPTIONS).map((el) => {
              if (!depositOptions || !depositOptions[el.key].isAvailable) {
                return null;
              }
              let minDepositCaption = "";
              if (
                depositCurrencyLimitObject &&
                depositCurrencyLimitObject[el.key]
              ) {
                minDepositCaption = `${currency.symbol}${
                  depositCurrencyLimitObject[el.key].min
                } מינימום`;
              }
              return (
                <ListItem
                  disableGutters
                  key={el.key}
                >
                  <ListItemButton onClick={() => keyFuncMap[el.key](el)}>
                    <ListItemAvatar>
                      <Avatar
                        src={DEPOSIT_OPTIONS_IMG[el.key].iconImage}
                      ></Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={DEPOSIT_OPTIONS[el.key].value}
                      secondary={minDepositCaption}
                    />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </CustomDialog>
      )}
    </>
  );
}
