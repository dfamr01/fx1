import { css, styled } from "@mui/material/styles";
import { Button, Typography, Box, Avatar } from "@mui/material";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import {
  DEPOSIT_OPTIONS,
  SORT_ORDER,
  TRANSACTION_STATUS,
  TRANSACTION_STATUS_COLOR,
  TRANSACTION_TYPE,
} from "../../utilities/constants";
import { getLocalTime, getLocalize } from "../../utilities/date";
import React, { useMemo, useState } from "react";
import { CURRENCIES } from "../../utilities/currency";
import StatusSelect from "./components/StatusSelect/index";
import { sortBy } from "lodash";
import { useReRender } from "../../utilities/hooks";
import { CustomScrollBars } from "../../styles/common";

const TransActionWrap = styled(Box)`
  display: flex;
  overflow-y: auto;
  max-width: 100vw;
`;
const TableContainerWrap = styled(TableContainer)`
  @media only screen and (min-width: 650px) {
    ${CustomScrollBars};
  }
`;

const TableWrap = styled(Table)`
  direction: ltr;
`;
const TableRowWrap = styled(TableRow)``;

const TableCellWrap = styled(TableCell)`
  @media only screen and (max-width: 650px) {
    padding: 10px 4px;
    max-width: 100px;
  }
`;
const TableCellHeaderWrap = styled(TableCell)`
  padding: 5px 8px 8px 8px;
  @media only screen and (max-width: 650px) {
    padding: 5px 5px 5px 5px;
  }
`;
const TheadButton = styled(Button)`
  justify-content: flex-end;
`;

const DateWrap = styled("div")`
  text-align: center;
`;

const DateLocalize = styled(Typography)``;

const DateHour = styled(Typography)``;

const Date = styled(Typography)``;

const ClientNameAndAvatarWrap = styled("div")`
  display: flex;
  align-items: center;
  flex-direction: row-reverse;

  @media only screen and (max-width: 650px) {
    flex-direction: column;
  }
`;

const AvatarWrap = styled(Avatar)`
  @media only screen and (max-width: 650px) {
    width: 35px;
    height: 35px;
  }
`;

const ClientNameMethodWrap = styled("div")`
  padding-right: 5px;
  @media only screen and (max-width: 650px) {
    padding-right: 0;
  }
`;

const ClientMethod = styled(Typography)`
  color: gray;
  font-size: 13px;
  font-weight: bold;
`;

const ClientName = styled(Typography)`
  font-size: 14px;
  font-weight: bold;
  text-transform: capitalize;
  color: #3c3c3c;
  text-align: center;
  @media only screen and (max-width: 600px) {
    font-size: 12px;
  }
`;

const StatusSelectWrap = styled(StatusSelect)`
  --dim: 125px;
  @media only screen and (max-width: 600px) {
    --dim: 100px;
    width: var(--dim);
  }
  .MuiInputBase-root {
    font-size: 13px;
    width: var(--dim);
  }
  @media only screen and (max-width: 600px) {
    .MuiSelect-select {
      text-overflow: unset;
      overflow: visible !important;
      padding: 8.5px 14px !important;
    }
  }

  @media only screen and (max-width: 600px) {
    ${({ should_margin }) =>
      should_margin &&
      css`
        .MuiSelect-icon {
          padding-right: unset;

          right: -4px;
        }
      `}
  }

  width: var(--dim);
  /* @media only screen and (max-width: 600px) {
    width: 125px;
  } */
`;

const Status = styled(Button)`
  background-color: ${({ status }) =>
    TRANSACTION_STATUS_COLOR[status]} !important;
  color: #fdfdfd !important;
  padding: 5px;
  border-radius: 25px;
  width: 100px;
  text-align: center;
`;

function Transactions({
  noUpdatesTransaction,
  selectedTransaction,
  showClient,
  hideHeaders,
  transactions,
  onChange,
  ...props
}) {
  useReRender({ interval: 30 * 1000 });

  const [orderSelector, setOrderSelector] = useState({ by: "", order: "" });

  function getSorted(arr, by, order = SORT_ORDER.DESC) {
    if (!arr?.length || !by) {
      return arr;
    }

    const res = sortBy(arr, [by]);
    if (order === SORT_ORDER.ASC) {
      res.reverse();
    }

    return res;
  }

  const sortedTransactions = useMemo(
    () => getSorted(transactions, orderSelector.by, orderSelector.order),
    [transactions, orderSelector.by, orderSelector.order]
  );

  function onClickHeaderName(e) {
    const {
      target: { name },
    } = e;

    if (orderSelector?.by === name) {
      if (orderSelector.order === SORT_ORDER.ASC) {
        setOrderSelector((prev) => {
          return {
            ...prev,
            order: SORT_ORDER.DESC,
          };
        });
      } else {
        setOrderSelector((prev) => {
          return {
            ...prev,
            order: SORT_ORDER.ASC,
          };
        });
      }

      return;
    }

    setOrderSelector({
      by: name,
      order: SORT_ORDER.ASC,
    });
  }

  return (
    <TransActionWrap {...props}>
      <TableContainerWrap
        dir="rtl"
        component={Paper}
      >
        <TableWrap aria-label="transaction table">
          {!hideHeaders && (
            <TableHead>
              <TableRowWrap>
                <TableCellHeaderWrap align="right">
                  <TheadButton
                    onClick={onClickHeaderName}
                    name="status"
                  >
                    סטטוס
                  </TheadButton>
                </TableCellHeaderWrap>
                <TableCellHeaderWrap align="right">
                  <TheadButton
                    onClick={onClickHeaderName}
                    name="amount"
                  >
                    סכום
                  </TheadButton>
                </TableCellHeaderWrap>
                <TableCellHeaderWrap align="right">
                  <TheadButton
                    onClick={onClickHeaderName}
                    name="type"
                  >
                    הוראה
                  </TheadButton>
                </TableCellHeaderWrap>
                <TableCellHeaderWrap align="right">
                  <TheadButton
                    onClick={onClickHeaderName}
                    name="createdAt"
                  >
                    תאריך
                  </TheadButton>
                </TableCellHeaderWrap>
                <TableCellHeaderWrap align="right">
                  <TheadButton
                    onClick={onClickHeaderName}
                    name="displayName"
                  >
                    לקוח
                  </TheadButton>
                </TableCellHeaderWrap>
              </TableRowWrap>
            </TableHead>
          )}
          <TableBody
            style={{
              borderTop: hideHeaders
                ? "1px solid rgba(224, 224, 224, 1)"
                : "unset",
            }}
          >
            {sortedTransactions?.map((row) => {
              const {
                id,
                amount,
                currencyKey,
                type,
                createdAt,
                status,
                uid,
                method,
                userProfile = {},
              } = row;

              const { displayName, firstName, lastName, avatar } = userProfile;
              const name = displayName || `${firstName} ${lastName}`;
              const dateObj = getLocalTime(createdAt?.toDate());
              // const dateObj = dayjs(createdAt.toDate());
              const date = dateObj.format("DD/MM/YYYY");
              const dateHour = dateObj.format("HH:mm");

              const dateLocale = getLocalize(dateObj).fromNow();
              const methodValue = method && DEPOSIT_OPTIONS[method]?.value;
              let sx = {};
              const selectedComponent = selectedTransaction?.id === id;
              if (selectedComponent) {
                sx = {
                  boxShadow: "0px 0px 5px 2px #1da9d6",
                  backgroundColor: "#ab1dd612",
                };
              }
              const scroll = (ref) => {
                ref?.scrollIntoView();
              };

              const should_margin = status === TRANSACTION_STATUS.PENDING.key;
              return (
                <TableRow
                  ref={selectedComponent ? scroll : null}
                  key={id}
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                    ...sx,
                  }}
                >
                  <TableCellWrap align="right">
                    {noUpdatesTransaction ? (
                      <Status status={status}>
                        {TRANSACTION_STATUS[status].value}
                      </Status>
                    ) : (
                      <StatusSelectWrap
                        should_margin={+should_margin}
                        options={Object.values(TRANSACTION_STATUS)}
                        current={status}
                        onChange={(newStatus) =>
                          onChange(id, row, { status: newStatus })
                        }
                      />
                    )}
                  </TableCellWrap>

                  <TableCellWrap align="right">
                    {CURRENCIES[currencyKey].symbol}
                    {amount}
                  </TableCellWrap>
                  <TableCellWrap align="right">
                    {TRANSACTION_TYPE[type].value}
                  </TableCellWrap>
                  <TableCellWrap align="right">
                    <DateWrap>
                      <DateLocalize variant="body2">{dateLocale}</DateLocalize>
                      <DateHour variant="caption">
                        {dateHour}
                        {", "}
                      </DateHour>
                      <Date variant="caption">{date}</Date>
                    </DateWrap>
                  </TableCellWrap>
                  <TableCellWrap align="right">
                    <ClientNameAndAvatarWrap>
                      {showClient && (
                        <AvatarWrap
                          alt="user avatar"
                          src={avatar?.photoURL}
                        />
                      )}
                      <ClientNameMethodWrap>
                        {showClient && <ClientName>{name}</ClientName>}
                        {methodValue && (
                          <ClientMethod>{methodValue}</ClientMethod>
                        )}
                      </ClientNameMethodWrap>
                    </ClientNameAndAvatarWrap>
                  </TableCellWrap>
                </TableRow>
              );
            })}
          </TableBody>
        </TableWrap>
      </TableContainerWrap>
    </TransActionWrap>
  );
}

const Component = React.memo(Transactions);
export default Component;
