import { lazy, Suspense } from "react";
import LoadingSpinner from "../../../components/LoadingSpinner/index.jsx";
import WithSideBar from "../../../layouts/WithSideBar/index.jsx";
import { ACCOUNT_MENU } from "../common.jsx";

const Module = lazy(() => import("./Profile.jsx"));

function Profile({ isMobile }) {
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

export default Profile;
