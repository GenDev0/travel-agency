import { Header, StatsCard, TripCard } from "components";
import { getUser } from "~/appwrite/auth";
import { allTrips, dashboardStats } from "~/constants";
import type { Route } from "./+types/dashboard";

// export async function clientLoader() {
//   return await getUser();
// }

export const clientLoader = async () => await getUser();

export function HydrateFallback() {
  return <p>Loading...</p>;
}

const Dashboard = ({ loaderData }: Route.ComponentProps) => {
  const { totalTrips, totalUsers, tripsCreated, userRole, usersJoined } =
    dashboardStats;
  const user = loaderData as User | null;
  return (
    <main className="dashboard wrapper">
      <Header
        title={`Welcome, ${user?.name ?? "Guest"} 👋`}
        description="Track activities, trends and popular destinations in real time."
        onButtonClick={() => console.log("Header clicked")}
      />

      <section className="flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          <StatsCard
            headerTitle={"Total Users"}
            total={totalUsers}
            currentMonthCount={usersJoined.currentMonth}
            lastMonthCount={usersJoined.lastMonth}
          />
          <StatsCard
            headerTitle={"Total Trips"}
            total={totalTrips}
            currentMonthCount={tripsCreated.currentMonth}
            lastMonthCount={tripsCreated.lastMonth}
          />
          <StatsCard
            headerTitle={"Active Users"}
            total={userRole.total}
            currentMonthCount={userRole.currentMonth}
            lastMonthCount={userRole.lastMonth}
          />
        </div>
      </section>
      <section className="container mx-auto">
        <h1 className="text-xl font-semibold text-dark-100 mb-4">
          Created Trips
        </h1>
        <div className="trip-grid">
          {allTrips
            .slice(0, 4)
            .map(({ id, imageUrls, itinerary, name, estimatedPrice, tags }) => (
              <TripCard
                key={id}
                id={id.toString()}
                imageUrl={imageUrls[0]}
                location={itinerary?.[0].location ?? ""}
                name={name}
                price={estimatedPrice}
                tags={tags}
              />
            ))}
        </div>
      </section>
    </main>
  );
};

export default Dashboard;
