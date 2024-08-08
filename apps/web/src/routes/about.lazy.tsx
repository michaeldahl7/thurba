// import { createLazyFileRoute } from "@tanstack/react-router";
// import { api } from "../utils/api";

// export const Route = createLazyFileRoute("/about")({
//   component: About,
// });

// export function About() {
//   // This can either be a tuple ['login'] or string 'login'
//   const mutation = api.hello.signup.useMutation();
//   const handleLogin = () => {
//     const username = "John Doe";
//     const password = "123456";
//     mutation.mutate({ username, password });
//   };
//   return (
//     <div>
//       <h1>Login Form</h1>
//       {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
//       <button onClick={handleLogin} disabled={mutation.isPending}>
//         Login
//       </button>
//       {mutation.error && <p>Something went wrong! {mutation.error.message}</p>}
//     </div>
//   );
// }
