import { Header } from "components";
import { getAllTrips } from "~/appwrite/trips";
import type { Route } from "./+types/trips";

export const loader = async () => {
  const { allTrips, total } = await getAllTrips(10, 0);
  return { trips: allTrips, total };
};

export function HydrateFallback() {
  return <p>Loading...</p>;
}

const Trips = ({ loaderData }: Route.ComponentProps) => {
  const { trips, total } = loaderData;
  console.log("🚀 ~ Trips ~ trips:", trips);
  console.log("🚀 ~ Trips ~ total:", total);
  return (
    <main className="all-users wrapper">
      <Header
        title="Manage Users"
        description="View and edit AI-generated travel plans."
        onButtonClick={() => console.log("Header clicked")}
        ctaText="Add Trip"
        ctaLink="/trips/create"
      />
    </main>
  );
};

export default Trips;
