import { css, styled } from "@mui/material/styles";
import {
  Button,
  Typography,
  Box,
  Avatar,
  CircularProgress,
} from "@mui/material";
import { TRANSACTION_STATUS } from "../../../../utilities/constants";
import { useMemo } from "react";
import React from "react";
import { CURRENCIES } from "../../../../utilities/currency";

const StatsWrap = styled(Box)`
  display: flex;
  flex-direction: column;
  padding: 10px;
  border-radius: 10px;
  margin: 0 5px;
`;

const TransActionBox = styled(Box)`
  background-color: #f0f0f0;
  border-radius: 15px;
  padding: 10px;
  height: 100%;
`;

const Caption = styled(Typography)`
  font-weight: bold;
`;

const CaptionWrap = styled(Box)`
  display: flex;
  justify-content: space-between;
`;

const AmountCaption = styled(Typography)``;
const CountCaption = styled(Typography)``;
const PendingCaption = styled(Typography)`
  color: #df2b2b;
  margin-top: auto;
  font-size: 14px;
`;

function Stats({ title, transactions, inputProps = {}, ...props }) {
  function getStates(transactions) {
    const res = {};
    let totalPending = 0;
    transactions?.forEach(({ status, amount, currencyKey, type }) => {
      if (!res[currencyKey]) {
        res[currencyKey] = {
          amount: 0,
          completeCount: 0,
          currencyKey,
          pendingCount: 0,
        };
      }
      if (status === TRANSACTION_STATUS.PENDING.key) {
        res[currencyKey].pendingCount++;
        totalPending++;
      }
      if (status === TRANSACTION_STATUS.COMPLETE.key) {
        res[currencyKey].amount += amount;
        res[currencyKey].completeCount++;
      }
    });
    return {
      totalPending,
      data: Object.values(res).filter((el) => el.completeCount),
    };
  }

  const statsCalcs = useMemo(() => getStates(transactions), [transactions]);

  return (
    <StatsWrap {...props}>
      <Caption dir="auto">{title}</Caption>

      <TransActionBox>
        {statsCalcs.data.map(({ amount, completeCount, currencyKey }) => {
          return (
            <CaptionWrap key={currencyKey}>
              <AmountCaption>
                {CURRENCIES[currencyKey].symbol}
                {amount}
              </AmountCaption>
              <CountCaption>{completeCount}</CountCaption>
            </CaptionWrap>
          );
        })}
      </TransActionBox>
      <PendingCaption
        style={{ visibility: statsCalcs.totalPending ? "visible" : "hidden" }}
      >
        {statsCalcs.totalPending} ממתינות לאישור
      </PendingCaption>
    </StatsWrap>
  );
}

const Component = React.memo(Stats);
export default Component;
