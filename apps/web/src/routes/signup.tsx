import { createFileRoute } from "@tanstack/react-router";
import { api } from "../utils/api";
import type { FieldApi } from "@tanstack/react-form";
import { useForm } from "@tanstack/react-form";
// import { formOptions } from "@tanstack/react-form";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { z } from "zod";

const usernameSchema = z.string();
//   .min(3, "Username must be at least 3 characters long")
//   .max(30, "Username must not exceed 30 characters")
//   .regex(
//     /^[a-zA-Z0-9_]+$/,
//     "Username can only contain letters, numbers, and underscores",
//   );

const passwordSchema = z.string();
//   .min(8, "Password must be at least 8 characters long")
//   .max(72, "Password must not exceed 72 characters")
//   .regex(
//     /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
//     "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
//   );

export const Route = createFileRoute("/signup")({
  component: Signup,
});

function FieldInfo({ field }: { field: FieldApi<any, any, any, any> }) {
  return (
    <>
      {field.state.meta.isTouched && field.state.meta.errors.length ? (
        <em>{field.state.meta.errors.join(",")}</em>
      ) : null}
      {field.state.meta.isValidating ? "Validating..." : null}
    </>
  );
}

export default function Signup() {
  const mutation = api.hello.signup.useMutation();
  const form = useForm({
    defaultValues: {
      username: "",
      password: "",
      confirm_password: "",
    },
    onSubmit: async ({ value }) => {
      mutation.mutate({
        username: value.username,
        password: value.password,
      });
    },
    validatorAdapter: zodValidator(),
  });

  return (
    <div>
      <h1>Simple Form Example</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <div>
          {/* A type-safe field component*/}
          <form.Field
            name="username"
            validatorAdapter={zodValidator()}
            validators={{
              onBlur: usernameSchema,
            }}
            // biome-ignore lint/correctness/noChildrenProp: <explanation>
            children={(field) => {
              // Avoid hasty abstractions. Render props are great!
              return (
                <>
                  <label htmlFor={field.name}>Username:</label>
                  <input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  <FieldInfo field={field} />
                </>
              );
            }}
          />
        </div>
        <div>
          <form.Field
            name="password"
            validatorAdapter={zodValidator()}
            validators={{
              onBlur: passwordSchema,
            }}
            // biome-ignore lint/correctness/noChildrenProp: <explanation>
            children={(field) => (
              <>
                <label htmlFor={field.name}>Password:</label>
                <input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                <FieldInfo field={field} />
              </>
            )}
          />
          {mutation.error && (
            <p>Something went wrong! {mutation.error.message}</p>
          )}
        </div>
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          // biome-ignore lint/correctness/noChildrenProp: <explanation>
          children={([canSubmit, isSubmitting]) => (
            <>
              <button type="submit" disabled={!canSubmit}>
                {isSubmitting ? "..." : "Submit"}
              </button>
              <button type="reset" onClick={() => form.reset()}>
                Reset
              </button>
            </>
          )}
        />
      </form>
    </div>
  );
}
