// import React from "react";
// import { useAuth } from "../hooks/useAuth";
// import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  function signOut(): void {
    console.log("Signing out");
  }

  //   const { signOut } = useAuth();
  //   const { data: user } = useQuery(["currentUser"]);
  //   const { data: notifications } = useQuery(["notifications"]);

  //   if (!user) return <div>Loading...</div>;

  return (
    <div>
      <h1>Welcome, user.name!</h1>
      {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
      <button onClick={() => signOut()}>Sign Out</button>
    </div>
  );
}
