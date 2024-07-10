import WithSideBar from "../../../layouts/WithSideBar/index.jsx";

import { ACCOUNT_MENU } from "../common.jsx";
import { Suspense, lazy } from "react";
import LoadingSpinner from "../../../components/LoadingSpinner/index.jsx";

const Module = lazy(() => import("./DoNotDisturb.jsx"));

function DoNotDisturb({ isMobile }) {
  return (
    <WithSideBar
      showSideBar={!isMobile}
      sideBarMenu={ACCOUNT_MENU}
    >
      <Suspense fallback={<LoadingSpinner />}>
        <Module />
      </Suspense>
    </WithSideBar>
  );
}

export default DoNotDisturb;
