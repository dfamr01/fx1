import { Form, useLoaderData, redirect } from "react-router-dom";

export async function action({ request, params }) {
  return redirect(`/agents/${params.agentId}`);

  // const formData = await request.formData();
  // const updates = Object.fromEntries(formData);
  // await updateAgent(params.agentId, updates);
  // return redirect(`/agents/${params.agentId}`);
}

export default function EditAgent() {
  const { agent } = useLoaderData();

  return (
    <Form
      method="post"
      id="agent-form"
      action={""}
      // onSubmit={(event) => {
      //     if (
      //         !confirm(
      //             "Please confirm you want to delete this record."
      //         )
      //     ) {
      //         event.preventDefault();
      //     }
      // }}
    >
      <p>
        <span>Name</span>
        <input
          placeholder="First"
          aria-label="First name"
          type="text"
          name="first"
          defaultValue={agent?.first}
        />
        <input
          placeholder="Last"
          aria-label="Last name"
          type="text"
          name="last"
          defaultValue={agent?.last}
        />
      </p>
      <label>
        <span>Twitter</span>
        <input
          type="text"
          name="twitter"
          placeholder="@jack"
          defaultValue={agent?.twitter}
        />
      </label>
      <label>
        <span>Avatar URL</span>
        <input
          placeholder="https://example.com/avatar.jpg"
          aria-label="Avatar URL"
          type="text"
          name="avatar"
          defaultValue={agent?.avatar}
        />
      </label>
      <label>
        <span>Notes</span>
        <textarea
          name="notes"
          defaultValue={agent?.notes}
          rows={6}
        />
      </label>
      <p>
        <button type="submit">Save</button>
        <button type="button">Cancel</button>
      </p>
    </Form>
  );
}
