import { Header, StatsCard, TripCard } from "components";
import { dashboardStats, user } from "~/constants";

const Dashboard = () => {
  const { totalTrips, totalUsers, tripsCreated, userRole, usersJoined } =
    dashboardStats;
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
          <TripCard
            id="1"
            imageUrl="/assets/images/sample.jpeg"
            location="Paris, France"
            name="Romantic Paris"
            price="$1200"
            tags={["romantic", "city", "europe"]}
          />
        </div>
      </section>
    </main>
  );
};

export default Dashboard;
