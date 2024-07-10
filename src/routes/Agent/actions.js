import { SELECTED_DATE } from "../../utilities/constants";

export function storeSelectedDate(selectedDateKey) {
  return localStorage.setItem("agentLastDateChoice", selectedDateKey);
}

export function getSelectedDate() {
  let res = localStorage.getItem("agentLastDateChoice");
  return res || SELECTED_DATE.TODAY.key;
}

export async function loader({ params }) {
  let res = getSelectedDate();
  return { selectedDate: res };
}

export async function action({ request, params }) {
  // let formData = await request.formData();
  // return updateAgent(params.agentId, {
  //   favorite: formData.get("favorite") === "true",
  // });
}
