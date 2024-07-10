import { userAccountMiddleware } from "../../redux/userAccount/reducers.js";
import { transactionsMiddleware } from "../../redux/transactions/reducers.js";
import { agentUsersMiddleware } from "../../redux/agentUsers/reducers.js";

const middlewares = [
  userAccountMiddleware,
  transactionsMiddleware,
  agentUsersMiddleware,
];

export default middlewares;
