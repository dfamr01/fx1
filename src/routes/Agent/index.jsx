import React, { useMemo } from "react";

import { useLoaderData, useNavigation } from "react-router-dom";
import { useSignal } from "@preact/signals-react";
import { useSearchParams } from "react-router-dom";
import { connect } from "react-redux";

import { styled, css } from "@mui/material/styles";
import { CircularProgress, Box, Typography, Avatar } from "@mui/material";
import { CircularProgressWrap, PageWrapper } from "../../styles/common.js";
import { useGetTransactionsFromDBThunkQuery } from "../../redux/transactions/reducers.js";
import {
  daysToISOday,
  getDateFromDateKey,
  getLocalTime,
  getServerTime,
} from "../../utilities/date.js";
import Transactions from "../../components/Transactions/index.jsx";
import { transactionDB } from "../../apis/transactions/transaction.db.js";
import { useGetAgentUsersCountFromDBThunkQuery } from "../../redux/agentUsers/reducers.js";
import DateSelector from "./components/Dates/index.jsx";
import {
  SELECTED_DATE,
  TRANSACTION_STATUS,
  TRANSACTION_TYPE,
} from "../../utilities/constants.js";
import { appendSignal } from "../../utilities/utils.js";
import { getSelectedDate, storeSelectedDate } from "./actions.js";
import Stats from "./components/Stats/index.jsx";
import { getUserProfile } from "../../redux/userProfile/selectors.js";
import { messagesDB } from "../../apis/user/messages.db.js";
import { CURRENCIES } from "../../utilities/currency.js";
import { useFindTransactionMemo } from "../../utilities/hooks.js";

const Page = styled(PageWrapper)`
  justify-content: flex-start;
  height: 100%;
`;

const ClientNameAndAvatarWrap = styled("div")`
  display: flex;
  align-items: center;
  margin-bottom: 5px;
  flex-direction: column;
`;

const ClientName = styled(Typography)`
  font-size: 20px;
  font-weight: bold;
  text-transform: capitalize;
`;

const InnerWrap = styled(Box)`
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  height: 100%;
  width: 100%;
  max-width: 800px;
`;

const UserCountWrap = styled(Box)`
  display: flex;
  width: 100%;
  align-items: center;
  flex-direction: row-reverse;
`;
const UserCountCaption = styled(Typography)`
  padding-right: 5px;
`;

const UserCount = styled(Typography)`
  font-size: 16px;
  font-weight: bold;
  padding: 0 2px;
`;

const DateSelectorWrap = styled(DateSelector)`
  padding-top: 15px;
  padding: 15px 5px 5px 5px;
`;

const Caption = styled(Typography)`
  font-size: 23px;
  font-weight: bold;
  text-transform: capitalize;
  margin-bottom: 5px;
`;

const NoTransactions = styled("div")`
  font-size: 23px;
  display: flex;
  justify-content: center;
  align-items: center;

  margin-top: 25px;
  color: #c02929;
`;

const StatsDateSelectWrap = styled("div")`
  width: 100%;
  max-width: 800px;
`;

const StatsWrap = styled("div")`
  display: flex;
  background-color: #f6f6f6;
  border-radius: 10px;
  justify-content: center;
`;

function Agent({ userProfile }) {
  const { selectedDate } = useLoaderData();
  const dateSelectKey = useSignal(getSelectedDate());
  let [searchParams, setSearchParams] = useSearchParams();

  const query = useSignal({
    fromDate: getDateFromDateKey(getSelectedDate()),
  });

  const navigation = useNavigation();
  const { displayName, uid, suid, firstName, lastName, avatar } = userProfile;

  const {
    data: transactionsData,
    error,
    isLoading,
    isFetching,
  } = useGetTransactionsFromDBThunkQuery({
    agentUid: uid,
    // status: TRANSACTION_STATUS.PENDING.key ,
    fromDate: query.value.fromDate,
  });

  async function onUpdateTransaction(id, transaction, data) {
    transactionDB
      .update({
        id,
        data,
      })
      .then((res) => {
        // only update on status change  for now
        if (!data?.status) {
          return;
        }
        // user has no mobile
        if (!transaction.userProfile.phoneNumber) {
          return;
        }
        const status = TRANSACTION_STATUS[data.status].value;
        if (transaction.userProfile?.notificationSettings?.transactionsSms) {
          const symbolizedAmount = `${
            CURRENCIES[transaction.currencyKey].symbol
          }${transaction.amount}`;
          messagesDB.sendTransactionText({
            uid,
            suid,
            toUid: transaction.userProfile.uid,
            toSuid: transaction.userProfile.suid,
            to: transaction.userProfile.phoneNumber,
            symbolizedAmount,
            transactionId: id,
            status,
            transactionValue: TRANSACTION_TYPE.DEPOSIT.value,
            displayName: displayName,
            agentRecipient: false,
          });
        }
      });
  }

  function onDateSelect(event) {
    const {
      target: { name, value, required },
    } = event;

    dateSelectKey.value = name;
    storeSelectedDate(name);
    const qDate = getDateFromDateKey(name);

    appendSignal(query, "fromDate", qDate);
  }

  const {
    data: agentUsersCountData,
    error: agentUsersCountError,
    isLoading: agentUsersCountIsLoading,
    isFetching: agentUsersCountIsFetching,
  } = useGetAgentUsersCountFromDBThunkQuery({
    agentUid: uid,
    agentSuid: suid,
  });

  // const isFetchingTransactionsData = true;
  const isFetchingTransactionsData =
    !transactionsData || transactionsData.isFetching;
  const noTransactionsData =
    !isFetchingTransactionsData && !transactionsData.data?.length;
  const hasTransactionsData =
    !isFetchingTransactionsData && transactionsData.data?.length;

  const selectedTransaction = useFindTransactionMemo({
    transactions: transactionsData?.data,
    transactionId: searchParams.get("transactionId"),
    key: "status",
    value: TRANSACTION_STATUS.PENDING.key,
  });

  return (
    <Page id="client">
      <ClientNameAndAvatarWrap>
        <Avatar
          alt="user avatar"
          src={avatar?.photoURL}
        />
        <ClientName>{displayName}</ClientName>
      </ClientNameAndAvatarWrap>
      <InnerWrap>
        <UserCountWrap>
          <UserCountCaption>:לקוחות רשומים</UserCountCaption>
          <UserCount>{agentUsersCountData?.data || 0}</UserCount>
        </UserCountWrap>

        <StatsDateSelectWrap>
          <StatsWrap>
            <Stats
              transactions={transactionsData?.data.filter(
                (el) => el.type === TRANSACTION_TYPE.DEPOSIT.key
              )}
              title={"הפקדות"}
              style={{ backgroundColor: "#e4e8ff" }}
            />
            <Stats
              style={{ backgroundColor: "#ffe4e4" }}
              transactions={transactionsData?.data.filter(
                (el) => el.type === TRANSACTION_TYPE.WITHDRAW.key
              )}
              title={"משיכות"}
            />
          </StatsWrap>

          <DateSelectorWrap
            selected={dateSelectKey.value}
            options={SELECTED_DATE}
            onSelected={onDateSelect}
          />
        </StatsDateSelectWrap>

        {noTransactionsData && (
          <NoTransactions>
            <Typography variant="h5">אין הוראות</Typography>
          </NoTransactions>
        )}

        {isFetchingTransactionsData && (
          <CircularProgressWrap>
            <CircularProgress />
          </CircularProgressWrap>
        )}

        {!!hasTransactionsData && (
          <Transactions
            selectedTransaction={selectedTransaction}
            transactions={transactionsData?.data}
            onChange={onUpdateTransaction}
            showClient
          />
        )}
      </InnerWrap>
    </Page>
  );
}

function mapStateToProps(state) {
  return {
    userProfile: getUserProfile(state),
  };
}

const Component = connect(mapStateToProps)(React.memo(Agent));

export default Component;
