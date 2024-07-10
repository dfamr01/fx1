import LoadingSpinner from "../../components/LoadingSpinner/index.jsx";
import WithSideBar from "../../layouts/WithSideBar/index.jsx";
import { Suspense, lazy } from "react";
const Component = lazy(() => import("./CryptoGuide.jsx"));

function CryptoGuide() {
  return (
    <WithSideBar>
      <Suspense fallback={<LoadingSpinner />}>
        <Component />
      </Suspense>
    </WithSideBar>
  );
}

export default CryptoGuide;
