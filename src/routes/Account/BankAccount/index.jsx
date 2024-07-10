import React from "react";

import LoadingSpinner from "@components/LoadingSpinner/index.jsx";
import WithSideBar from "../../../layouts/WithSideBar/index.jsx";

import { ACCOUNT_MENU } from "../common.jsx";
import { Suspense, lazy } from "react";

const Module = lazy(() => import("./BankAccount.jsx"));

function BankAccount({ isMobile }) {
  return (
    <WithSideBar
      showSideBar={!isMobile}
      sideBarMenu={ACCOUNT_MENU}
    >
      <Suspense fallback={<LoadingSpinner />}>
        <Module isMobile={isMobile} />
      </Suspense>
    </WithSideBar>
  );
}

export default BankAccount;
