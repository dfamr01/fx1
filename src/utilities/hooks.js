import React, { useEffect, useMemo, useReducer, useState } from "react";
import { debounceFunction } from "./utils";
import { useSignal } from "@preact/signals-react";
import { TRANSACTION_STATUS } from "./constants";

export const useCheckMobileScreen = () => {
  const isMobile = useSignal(window.innerWidth <= 800);
  const handleWindowSizeChange = () => {
    isMobile.value = window.innerWidth <= 800;
  };

  useEffect(() => {
    function debounceFun() {
      debounceFunction(handleWindowSizeChange, 300);
    }
    window.addEventListener("resize", debounceFun);
    return () => {
      window.removeEventListener("resize", debounceFun);
    };
  }, []);

  return isMobile.value;
};

// will re-render the component at the interval time
export const useReRender = ({ active = true, interval = 1000 } = {}) => {
  const reducer = (state) => {
    return state + 1;
  };

  const [state, dispatch] = useReducer(reducer, 0);

  useEffect(() => {
    let intervalId;
    if (!active) {
      clearInterval(intervalId);
      return;
    }
    intervalId = setInterval(() => {
      dispatch();
    }, interval);

    return () => clearInterval(intervalId);
  }, [active, interval]);
  return [state];
};

// get the transaction
export function useFindTransactionMemo(
  transactions,
  transactionId,
  key,
  value
) {
  function findTransactions({ transactions, transactionId, key, value }) {
    let res = null;
    if (!transactionId || !transactions?.length) {
      return res;
    }
    res = transactions.find((el) => {
      if (el.id === transactionId)
        if (key && value) {
          if (el[key] === value) {
            return el;
          }
        } else {
          return el;
        }
    });
    return res;
  }

  const selectedTransaction = useMemo(
    () => findTransactions(transactions),
    [transactions, transactionId, key, value]
  );
  return selectedTransaction;
}
