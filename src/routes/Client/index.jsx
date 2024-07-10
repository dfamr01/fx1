import React, { useEffect, useRef } from "react";
import { useSignal } from "@preact/signals-react";
import { Link, useLoaderData, useSearchParams } from "react-router-dom";
import { styled, css } from "@mui/material/styles";
import { useState } from "react";
import AmountInput from "../../components/AmountInput/index.jsx";
import { Button, CircularProgress } from "@mui/material";
import DepositComponent from "./components/DepositComponent/index.jsx";
import { OpenWhatsapp, getTransactionUrl } from "../../utilities/utils.js";
import {
  TRANSACTION_STATUS,
  TRANSACTION_TYPE,
  WITHDRAW_TEXT,
} from "../../utilities/constants.js";
import MaterialLink from "@mui/material/Link";
import { CONTACT_AGENT_TEXT } from "../../utilities/language.js";
import Avatar from "@mui/material/Avatar";
import {
  ElementsWrapper,
  PageWrapper,
  PaperWrapper,
} from "../../styles/common.js";
import { CURRENCIES } from "../../utilities/currency.js";
import Typography from "@mui/material/Typography";
import { connect } from "react-redux";
import { bindActionCreators } from "@reduxjs/toolkit";
import { useGetUserAccountFromDBThunkQuery } from "../../redux/userAccount/reducers.js";
import { getUserProfile } from "../../redux/userProfile/selectors.js";
import TimerCounter from "../../components/TimerCounter/index.jsx";
import { storeLastAmount } from "./helpers.js";
import { theme } from "../../styles/theme.js";
import AlertDialog from "../../components/AlertDialog/index.jsx";
import { transactionDB } from "../../apis/transactions/transaction.db.js";
import { useClient, useClientDnD } from "./hooks.client.js";
import Transactions from "../../components/Transactions/index.jsx";
import { useGetTransactionsFromDBThunkQuery } from "../../redux/transactions/reducers.js";
import { messagesDB } from "../../apis/user/messages.db.js";
import { errorHandler } from "../../components/Toast/index.jsx";
import { useFindTransactionMemo } from "../../utilities/hooks.js";

const Paper = styled(PaperWrapper)`
  ${({ disabled }) =>
    disabled &&
    css`
      pointer-events: none;
      opacity: 0.5;
      filter: blur(1px);
      background-color: #00000080;
    `}
`;

const ButtonsWrapper = styled("div")`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const ClientNameAndAvatarWrap = styled("div")`
  display: flex;
  align-items: center;
  margin-bottom: 5px;
`;

const ClientName = styled(Typography)`
  font-size: 20px;
  font-weight: bold;
  text-transform: capitalize;
`;

const LinkWrap = styled("div")`
  display: flex;
  justify-content: flex-end;
`;

function Client({ userProfile }) {
  let [searchParams, setSearchParams] = useSearchParams();

  const { uid, suid, displayName } = userProfile;

  const { agent, agentNotFound } = useClient({ uid });
  const alertPromptInput = useSignal({
    open: false,
  });

  function setAlertOpen(val) {
    alertPromptInput.value = {
      ...alertPromptInput.value,
      open: val,
    };
  }

  function openAlert({ title, caption, onConfirm }) {
    alertPromptInput.value = {
      ...alertPromptInput.value,
      open: true,
      title,
      caption,
      onConfirm,
    };
  }

  const {
    data: agentAccount,
    error: agentAccountError,
    isLoading: agentAccountIsLoading,
    isFetching: agentAccountIsFetching,
  } = useGetUserAccountFromDBThunkQuery({ uid: agent.value.uid });

  const {
    uid: agentUid,
    suid: agentSuid,
    phoneNumber: agentPhoneNumber,
  } = agent.value;

  const { bankAccounts, depositOptions, depositOptionsLimits, doNotDisturbs } =
    agentAccount || {};
  const { isDoNotDisturb, calcDnDFunc } = useClientDnD({ doNotDisturbs });

  const { currency: _currency, amount: lastAmount } = useLoaderData();
  const [currency, setCurrency] = useState(_currency);
  const amount = useSignal(lastAmount);

  const {
    data: transactionsData,
    error,
    isLoading,
    isFetching,
  } = useGetTransactionsFromDBThunkQuery({
    uid,
    // status: TRANSACTION_STATUS.PENDING.key ,
    // fromDate: query.value.fromDate,
  });
  const isFetchingTransactionsData =
    !transactionsData || transactionsData.isFetching;
  const noTransactionsData =
    !isFetchingTransactionsData && !transactionsData.data?.length;
  const hasTransactionsData =
    !isFetchingTransactionsData && transactionsData.data?.length;

  function onSetAmount(val) {
    storeLastAmount(val.floatValue);
    amount.value = val.floatValue;
  }

  const {
    displayName: agentDisplayName,
    firstName,
    lastName,
    avatar,
  } = agent.value;

  async function HandleWithdrawClick() {
    const symbolizedAmount = `${currency.symbol}${amount.value}`;
    const symbolizedAmountEncoded = encodeURIComponent(symbolizedAmount);

    try {
      const newTransaction = await transactionDB.create({
        uid,
        suid,
        agentUid,
        agentSuid,
        type: TRANSACTION_TYPE.WITHDRAW.key,
        method: "",
        amount: amount.value,
        currencyKey: currency.key,
      });
      if (agent.value?.notificationSettings?.transactionsSms) {
        messagesDB.sendTransactionText({
          uid,
          suid,
          toUid: agentUid,
          toSuid: agentSuid,
          to: agentPhoneNumber,
          symbolizedAmount,
          transactionId: newTransaction.id,
          transactionValue: TRANSACTION_TYPE.WITHDRAW.value,
          displayName,
          agentRecipient: true,
        });
      }
    } catch (err) {
      errorHandler(err);
      return;
    }

    setAlertOpen(false);

    const messageEncoded =
      encodeURIComponent(WITHDRAW_TEXT) + symbolizedAmountEncoded;
    OpenWhatsapp(agent.value.phoneNumber, messageEncoded);
  }

  function HandleContactAgentClick() {
    const messageEncoded = encodeURIComponent(CONTACT_AGENT_TEXT);
    OpenWhatsapp(agent.value.phoneNumber, messageEncoded);
  }

  // const displayName = displayName ? displayName : `${firstName} ${lastName}`;
  const disableButton = !amount.value;

  function depositErrors() {
    if (amount.value < CURRENCIES[currency.key].min) {
      return `${CURRENCIES[currency.key].symbol}${
        CURRENCIES[currency.key].min
      } הסכום המינימלי להפקדה`;
    }
    return null;
  }

  const hasDepositErrors = depositErrors();

  const selectedTransaction = useFindTransactionMemo({
    transactions: transactionsData?.data,
    transactionId: searchParams.get("transactionId"),
  });

  const disableDepositButton = !amount.value || hasDepositErrors;
  if (agentNotFound.value) {
    return (
      <PageWrapper id="client">
        <Typography
          variant="h4"
          style={{ color: theme.color.error }}
        >
          סוכן לא נמצא
        </Typography>
        <Typography variant="h6">אנא צור קשר עם סוכן</Typography>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper id="client">
      {!agentAccount?.uid ? (
        <CircularProgress />
      ) : (
        <>
          <AlertDialog
            {...alertPromptInput.value}
            setOpen={setAlertOpen}
          />
          <ClientNameAndAvatarWrap>
            <Avatar
              style={{ marginRight: 5 }}
              alt="user avatar"
              src={avatar?.photoURL}
            />
            <ClientName>{agentDisplayName}</ClientName>
          </ClientNameAndAvatarWrap>
          {isDoNotDisturb.value.isDnDOn && (
            <TimerCounter
              timerSec={isDoNotDisturb.value.maxDiffToLastOn}
              caption={"הסוכן יהיה זמן בעוד"}
              removeOnZero={false}
              onDone={() => {
                calcDnDFunc(doNotDisturbs);
              }}
            />
          )}
          <Paper
            style={{ justifyContent: "flex-start" }}
            disabled={+isDoNotDisturb.value.isDnDOn}
          >
            <ElementsWrapper>
              <AmountInput
                variant={"standard"}
                label={"סכום"}
                amount={amount.value}
                setAmount={onSetAmount}
                currency={currency}
                setCurrency={setCurrency}
                error={!amount.value}
              />
              <ButtonsWrapper>
                <DepositComponent
                  amount={amount.value}
                  currency={currency}
                  agent={agent.value}
                  user={userProfile}
                  disabled={!!disableDepositButton}
                  bankAccounts={bankAccounts}
                  depositOptions={depositOptions}
                  depositOptionsLimits={depositOptionsLimits}
                />
                <Button
                  disabled={disableButton}
                  style={{ margin: "0 10px" }}
                  variant="contained"
                  color="success"
                  onClick={() =>
                    openAlert({
                      title: "משיכה",
                      caption: `האם ברצונך לבצע משיכה של ${currency.symbol}${amount.value}`,
                      onConfirm: HandleWithdrawClick,
                    })
                  }
                >
                  משיכה
                </Button>
              </ButtonsWrapper>
              <Typography
                style={{ color: "#d32f2f", paddingTop: 3 }}
                dir="auto"
                variant="body2"
                gutterBottom
              >
                {hasDepositErrors}
              </Typography>
              <LinkWrap>
                <Link
                  rel="noreferrer"
                  to="/crypto-guide"
                  underline="always"
                  target="_blank"
                >
                  <Typography dir="auto">מדריך הפקדה בקריפטו</Typography>
                </Link>
              </LinkWrap>
              <LinkWrap>
                <MaterialLink
                  variant="body2"
                  onClick={HandleContactAgentClick}
                  component="button"
                >
                  צור קשר עם הסוכן
                </MaterialLink>
              </LinkWrap>
            </ElementsWrapper>
          </Paper>
        </>
      )}
      <Transactions
        style={{ paddingTop: "10px" }}
        hideHeaders
        noUpdatesTransaction
        selectedTransaction={selectedTransaction}
        transactions={transactionsData?.data}
      />
    </PageWrapper>
  );
}

function mapStateToProps(state) {
  return {
    userProfile: getUserProfile(state),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({}, dispatch);
}

const Component = connect(mapStateToProps, mapDispatchToProps)(Client);
export default Component;
