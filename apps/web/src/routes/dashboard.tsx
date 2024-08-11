import React from "react";
// import { useAuth } from "../hooks/useAuth";
import { useQuery } from "@tanstack/react-query";

function Dashboard() {
  //   const { signOut } = useAuth();
  //   const { data: user } = useQuery(["currentUser"]);
  //   const { data: notifications } = useQuery(["notifications"]);

  //   if (!user) return <div>Loading...</div>;

  return (
    <div>
      <h1>Welcome, {user.name}!</h1>
      <button onClick={() => signOut()}>Sign Out</button>
    </div>
  );
}

export default Dashboard;
