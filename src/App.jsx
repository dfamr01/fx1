import PropTypes from "prop-types";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import dayjs from "dayjs";

import Client from "./routes/Client/index.jsx";
import {
  action as clientAction,
  loader as clientLoader,
} from "./routes/Client/actions.js";
import Agent from "./routes/Agent/index.jsx";
import { loader as agentsLoader } from "./routes/Agent/actions.js";
import CryptoGuide from "./routes/CryptoGuide/index.jsx";
import ErrorPage from "./error-page.jsx";
import HomePage from "./routes/HomePage/index.jsx";
import Toast from "./components/Toast/index.jsx";
import { connect } from "react-redux";
import { useInitUser } from "./apis/user/helpers/user.js";
import { bindActionCreators } from "@reduxjs/toolkit";
import { getAuthIsLoggedIn } from "./redux/auth/selectors.js";
import CreateAccountPage from "./routes/CreateAccountPage/index.jsx";
import Account from "./routes/Account/index.jsx";
import Deposit from "./routes/Account/Deposit/index.jsx";
import DoNotDisturb from "./routes/Account/DoNotDisturb/index.jsx";
import Profile from "./routes/Account/Profile/index.jsx";
import BankAccount from "./routes/Account/BankAccount/index.jsx";
import { useCheckMobileScreen } from "./utilities/hooks.js";
import minMax from "dayjs/plugin/minMax"; // load on demand
import utc from "dayjs/plugin/utc"; // load on demand
import timezone from "dayjs/plugin/timezone"; // load on demand
import isBetween from "dayjs/plugin/isBetween"; // load on demand
import isoWeek from "dayjs/plugin/isoWeek"; // load on demand
import duration from "dayjs/plugin/duration"; // load on demand
import updateLocale from "dayjs/plugin/updateLocale"; // load on demand
import relativeTime from "dayjs/plugin/relativeTime"; // load on demand
import localeData from "dayjs/plugin/localeData"; // load on demand
import localizedFormat from "dayjs/plugin/localizedFormat"; // load on demand
import { getUserProfile } from "./redux/userProfile/selectors.js";
import UserPageHoc from "./components/UserPageHoc/index.jsx";
import NotificationSettings from "./routes/Account/NotificationSettings/index.jsx";

dayjs.extend(localeData); // use plugin
dayjs.extend(localizedFormat); // use plugin
dayjs.extend(duration); // use plugin
dayjs.extend(minMax); // use plugin
dayjs.extend(utc); // use plugin
dayjs.extend(timezone); // use plugin
dayjs.extend(isBetween); // use plugin
dayjs.extend(isoWeek); // use plugin
dayjs.extend(updateLocale); // use plugin
dayjs.extend(relativeTime); // use plugin

dayjs.tz.setDefault(dayjs.tz.guess());
function App({ children, isLoggedIn }) {
  useInitUser();
  // const isMobile = false;
  const isMobile = useCheckMobileScreen();

  return (
    <>
      <Toast />
      {children}
      <RouterProvider
        router={createBrowserRouter(
          createRoutesFromElements(
            <>
              <Route errorElement={<ErrorPage />}>
                <Route
                  path="createAccount/"
                  element={
                    isLoggedIn ? (
                      <Navigate to="/" />
                    ) : (
                      <CreateAccountPage isLoggedIn={isLoggedIn} />
                    )
                  }
                />

                <Route
                  path="/agent"
                  element={
                    !isLoggedIn ? (
                      <Navigate to="/createAccount" />
                    ) : (
                      <UserPageHoc>
                        <Agent />
                      </UserPageHoc>
                    )
                  }
                  loader={agentsLoader}
                  // action={agentsAction}
                />

                <Route
                  path="/client"
                  element={
                    !isLoggedIn ? (
                      <Navigate to="/createAccount" />
                    ) : (
                      <UserPageHoc>
                        <Client />
                      </UserPageHoc>
                    )
                  }
                  loader={clientLoader}
                  action={clientAction}
                />
              </Route>
              <Route
                path="/crypto-guide"
                element={<CryptoGuide />}
                errorElement={<ErrorPage />}
              ></Route>

              {/* user account routes */}
              <Route
                exact
                path="/account"
              >
                <Route
                  exact
                  path="profile"
                  element={
                    !isLoggedIn ? (
                      <Navigate to="/" />
                    ) : (
                      <Profile isMobile={isMobile} />
                    )
                  }
                />
                <Route
                  exact
                  path="bankAccount"
                  element={
                    !isLoggedIn ? (
                      <Navigate to="/" />
                    ) : (
                      <BankAccount isMobile={isMobile} />
                    )
                  }
                />
                <Route
                  exact
                  path="deposit"
                  element={
                    !isLoggedIn ? (
                      <Navigate to="/" />
                    ) : (
                      <Deposit isMobile={isMobile} />
                    )
                  }
                />
                <Route
                  exact
                  path="doNotDisturb"
                  element={
                    !isLoggedIn ? (
                      <Navigate to="/" />
                    ) : (
                      <DoNotDisturb isMobile={isMobile} />
                    )
                  }
                />

                <Route
                  exact
                  path="notificationSettings"
                  element={
                    !isLoggedIn ? (
                      <Navigate to="/" />
                    ) : (
                      <NotificationSettings isMobile={isMobile} />
                    )
                  }
                />
                <Route
                  path=""
                  element={
                    !isLoggedIn ? (
                      <Navigate to="/" />
                    ) : isMobile ? (
                      <Account />
                    ) : (
                      <Navigate to="bankAccount" />
                    )
                  }
                  // element={<Account />}
                  errorElement={<ErrorPage />}
                />
              </Route>

              <Route
                exact
                path="/"
                element={
                  isLoggedIn ? <HomePage /> : <Navigate to="/createAccount" />
                }
                errorElement={<ErrorPage />}
              ></Route>
            </>
          )
        )}
      />
    </>
  );
}

function mapStateToProps(state) {
  return {
    isLoggedIn: getAuthIsLoggedIn(state),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({}, dispatch);
}

App.propTypes = {
  children: PropTypes.any,
};

const AppComponent = connect(mapStateToProps, mapDispatchToProps)(App);
export default AppComponent;
