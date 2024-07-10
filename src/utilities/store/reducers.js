import auth from "../../redux/auth/reducers.js";
import user from "../../redux/user/reducers.js";
import userProfile from "../../redux/userProfile/reducers.js";
import userAccount from "../../redux/userAccount/reducers.js";
import transactions from "../../redux/transactions/reducers.js";
import agentUsers from "../../redux/agentUsers/reducers.js";

const reducer = {
  auth,
  user,
  userProfile,
  userAccount,
  transactions,
  agentUsers,
};

export default reducer;
