import { getCurrency } from "../../utilities/currency.js";
import { getLastAmount } from "./helpers.js";

export async function loader({ params }) {
  const [currency, amount] = await Promise.all([
    getCurrency(),
    getLastAmount(),
  ]);
  return { currency, amount };
}

export async function action({ request, params }) {
  // let formData = await request.formData();
  // return updateAgent(params.agentId, {
  //   favorite: formData.get("favorite") === "true",
  // });
}
