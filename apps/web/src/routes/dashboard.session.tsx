import { createFileRoute } from "@tanstack/react-router"; //Outlet,

import { trpc } from "../router";
import { Spinner } from "../components/Spinner";
// import type { RouterOutputs } from "@acme/api";

export const Route = createFileRoute("/dashboard/session")({
  errorComponent: () => "Oh crap!",
  loader: async ({ context: { trpcQueryUtils } }) => {
    //     // await trpcQueryUtils.post.posts.ensureData();
    await trpcQueryUtils.auth.getSession.ensureData();

    return;
  },
  pendingComponent: Spinner,
  component: DashboardUserComponent,
});

function DashboardUserComponent() {
  const handleGitHubLogin = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.location.href = "http://localhost:3000/login/github";
  };

  const { data, isLoading } = trpc.auth.getSession.useQuery();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (data) {
    return <div>Welcome, {data.id}!</div>;
  } else return <div>No session</div>;

  //   return (
  //     <div>
  //       {/* biome-ignore lint/a11y/useValidAnchor: <explanation> */}
  //       <a href="#" onClick={handleGitHubLogin}>
  //         Sign in with GitHub
  //       </a>
  //     </div>
  //   );

  //   return (
  //     <div className="flex-1 flex">
  //       <div className="divide-y w-48">
  //         {/* <div>Hello session id {session?.id}</div>
  //         <div>Hello session user id {session?.userId}</div>
  //         <div>Hello user id {user?.id}</div>
  //         <div>Hello source {source}</div> */}
  //       </div>
  //       {/* <div>{JSON.stringify(honoHeaders)}</div>
  //        */}

  //       {/* <div className="p-4">
  //         <h2 className="text-xl font-bold mb-4">HTTP Headers</h2>
  //         {headerEntries.length > 0 ? (
  //           <ul className="space-y-2">
  //             {headerEntries.map(([key, value]) => (
  //               <li key={key} className="bg-gray-100 p-2 rounded">
  //                 <span className="font-semibold">{key}:</span> {value}
  //               </li>
  //             ))}
  //           </ul>
  //         ) : (
  //           <p className="text-gray-500">No headers available</p>
  //         )}
  //       </div> */}
  //       <div className="flex-1 border-l border-gray-200">
  //         <Outlet />
  //       </div>
  //     </div>
  //   );
}
