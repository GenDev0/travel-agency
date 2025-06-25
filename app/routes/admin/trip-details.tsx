import { getTripById } from "~/appwrite/trips";
import type { Route } from "./+types/trip-details";
import { redirect, useNavigate, type LoaderFunctionArgs } from "react-router";
import { parseTripData } from "lib/utils";
import { Header } from "components";

// get ID from URL params router v7
export const loader = async ({ params }: LoaderFunctionArgs) => {
  try {
    const { tripId } = params as { tripId?: string };
    if (!tripId) {
      throw new Error("Trip ID is required");
    }
    const trip = await getTripById(tripId);
    if (!trip) {
      throw new Error("Trip not found");
    }
    return trip;
  } catch (error) {
    console.log("Error in clientLoader:", error);
    // Handle error appropriately, e.g., return an empty object or a default value
    return redirect("/trips");
  }
};

export const HydrateFallback = () => {
  return <p>Loading trip details...</p>;
};

const TripDetails = ({ loaderData }: Route.ComponentProps) => {
  const navigate = useNavigate();
  const tripDetails = parseTripData(loaderData?.tripDetail) as Trip | null;
  if (!tripDetails) {
    navigate("/trips");
    return null; // or a loading state
  }

  const {
    name,
    bestTimeToVisit,
    budget,
    country,
    description,
    duration,
    estimatedPrice,
    groupType,
    id,
    imageUrls,
    interests,
    itinerary,
    location,
    payment_link,
    travelStyle,
    weatherInfo,
  } = tripDetails;

  return (
    <main className="travel-detail wrapper">
      <Header
        title="Trip Details"
        description="View and edit AI-generated travel plans."
        onButtonClick={() => console.log("Header clicked")}
      />
      <section className="container wrapper-md">
        <header>
          <h1 className="p-40-semibold text-dark-100">{name}</h1>
        </header>
      </section>
    </main>
  );
};

export default TripDetails;
