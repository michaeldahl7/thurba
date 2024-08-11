// import { useRouter } from "@tanstack/react-router";
// import { useMutation, useQueryClient } from "@tanstack/react-query";

// export function useAuth() {
//   const { authClient } = useRouter().context;
//   const queryClient = useQueryClient();

//   const signInMutation = useMutation({
//     mutationFn: (provider: "github" | "google") => authClient.signIn(provider),
//   });

//   const signOutMutation = useMutation({
//     mutationFn: () => authClient.signOut(),
//     onSuccess: () => {
//       queryClient.invalidateQueries(["currentUser"]);
//     },
//   });

//   return {
//     signIn: signInMutation.mutate,
//     signOut: signOutMutation.mutate,
//   };
// }
