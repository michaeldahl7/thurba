// import { client } from "@acme/rpc";
// import { Navigate } from "@tanstack/react-router";
// // import { user }

// export type User = {
//   id: string;
//   // Add other user properties as needed
// };

// export type Session = {
//   id: string;
//   userId: string;
//   fresh: boolean;
//   // Add other session properties as needed
// };

// export async function checkAuth() {
//   try {
//     const response = await client.getSession.$post();
//     if (response.ok) {
//       const data = await response.json();
//       return { user: data.user, session: data.session };
//     } else {
//       return { user: null, session: null };
//     }
//   } catch (error) {
//     console.error("Error checking auth:", error);
//     return { user: null, session: null };
//   }
// }

// export async function logout() {
//   await client.logout.$post();
//   Navigate({ to: "/login" });
// }
