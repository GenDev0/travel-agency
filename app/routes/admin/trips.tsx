import { Header, TripCard } from "components";
import { getAllTrips } from "~/appwrite/trips";
import type { Route } from "./+types/trips";
import {
  redirect,
  useNavigate,
  useSearchParams,
  type LoaderFunctionArgs,
} from "react-router";
import { parseTripData } from "lib/utils";
import { useState } from "react";
import { PagerComponent } from "@syncfusion/ej2-react-grids";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  try {
    const limit = 8;
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const offset = (page - 1) * limit;
    const { allTrips, total } = await getAllTrips(limit, offset);

    return {
      trips:
        allTrips
          .map(({ $id, tripDetail, imageUrls }) => ({
            id: $id,
            ...parseTripData(tripDetail),
            imageUrls: imageUrls || [],
          }))
          .filter((trip): trip is NonNullable<typeof trip> => trip !== null) ||
        ([] as Trip[]),
      total,
    };
  } catch (error) {
    console.error("Error in loader:", error);
    return redirect("/");
  }
};

export function HydrateFallback() {
  return <p>Loading...</p>;
}

const Trips = ({ loaderData }: Route.ComponentProps) => {
  const navigate = useNavigate();
  const { trips, total } = loaderData;
  const [searchParams] = useSearchParams();
  const initialPage = parseInt(searchParams.get("page") || "1", 10);
  const [currentPage, setCurrentPage] = useState(initialPage);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", newPage.toString());
    navigate(`?${newParams.toString()}`);
  };
  return (
    <main className='all-users wrapper'>
      <Header
        title='All Trips'
        description='View and edit AI-generated travel plans.'
        ctaText='Crate a Trip'
        ctaLink='/trips/create'
      />
      <section>
        <h1 className='p-24-semibold text-dark-100 mb-4'>
          Manage Created Trips
        </h1>
        <div className='trip-grid mb-4'>
          {trips.map(
            ({
              id,
              imageUrls,
              itinerary,
              name,
              estimatedPrice,
              interests,
              travelStyle,
            }) =>
              id && (
                <TripCard
                  key={id}
                  id={id}
                  imageUrl={imageUrls?.[0] || ""}
                  location={itinerary?.[0]?.location || ""}
                  name={name || ""}
                  price={estimatedPrice || ""}
                  tags={[interests || "", travelStyle || ""]}
                />
              )
          )}
        </div>
        <PagerComponent
          totalRecordsCount={total}
          pageSize={8}
          currentPage={currentPage}
          click={(args) => handlePageChange(args.currentPage)}
          cssClass='!mb-4'
        />
      </section>
    </main>
  );
};

export default Trips;
