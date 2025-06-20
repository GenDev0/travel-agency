import { Header } from "components";
import {
  GridComponent,
  ColumnsDirective,
  ColumnDirective,
} from "@syncfusion/ej2-react-grids";
import { cn, formatDate } from "lib/utils";
import { getAllUsers } from "~/appwrite/auth";
import type { Route } from "./+types/all-users";
import type { Models } from "node_modules/appwrite/types/client";

export const loader = async () => {
  const { users, total } = await getAllUsers(10, 0);
  return { users, total };
};

export function HydrateFallback() {
  return <p>Loading...</p>;
}

const AllUsers = ({ loaderData }: Route.ComponentProps) => {
  const data = (loaderData as { users: Models.Document[]; total: number }) || {
    users: [],
    total: 0,
  };
  return (
    <main className="all-users wrapper">
      <Header
        title="Manage Users"
        description="Filter, sort, and access detailed users profiles."
        onButtonClick={() => console.log("Header clicked")}
      />
      <GridComponent dataSource={data.users} gridLines="None">
        <ColumnsDirective>
          <ColumnDirective
            field="name"
            headerText="Name"
            width="200"
            textAlign="Left"
            template={(props: UserData) => (
              <div className="flex items-center gap-1.5 px-4">
                <img
                  src={props.imageUrl}
                  alt={props.name}
                  className="size-8 rounded-full aspect-square"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
                <span>{props.name}</span>
              </div>
            )}
          />
          <ColumnDirective
            field="email"
            headerText="Email"
            width="250"
            textAlign="Left"
          />
          <ColumnDirective
            field="joinedAt"
            headerText="Date Joined"
            width="150"
            textAlign="Left"
            template={({ joinedAt }: UserData) => {
              return <span>{formatDate(joinedAt)}</span>;
            }}
          />
          <ColumnDirective
            field="itineraryCreated"
            headerText="Trip Created"
            width="130"
            textAlign="Left"
          />
          <ColumnDirective
            field="status"
            headerText="Role"
            width="150"
            template={({ status }: UserData) => (
              <article
                className={cn(
                  "status-column",
                  status === "user" ? "bg-success-50" : "bg-light-300"
                )}
              >
                <div
                  className={cn(
                    "size-1.5 rounded-full",
                    status === "user" ? "bg-success-500" : "bg-gray-500"
                  )}
                />
                <h3
                  className={cn(
                    "font-inter text-xs font-medium",
                    status === "user" ? "text-success-700" : "text-gray-500"
                  )}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </h3>
              </article>
            )}
          />
        </ColumnsDirective>
      </GridComponent>
    </main>
  );
};

export default AllUsers;
