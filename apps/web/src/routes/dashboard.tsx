// import React from "react";
// import { useAuth } from "../hooks/useAuth";
// import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@acme/ui/button";

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
      <h1 className="text-blue-300">Welcome, user.name!</h1>
      <Button variant="destructive" onClick={() => signOut()}>
        Sign Out
      </Button>
      {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
      <button onClick={() => signOut()}>Sign Out</button>
    </div>
  );
}
