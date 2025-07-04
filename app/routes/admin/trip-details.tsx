import { getAllTrips, getTripById } from "~/appwrite/trips";
import type { Route } from "./+types/trip-details";
import { redirect, useNavigate, type LoaderFunctionArgs } from "react-router";
import { cn, getFirstWord, parseTripData } from "lib/utils";
import { Header, InfoPill, TripCard } from "components";
import {
  ChipDirective,
  ChipListComponent,
  ChipsDirective,
} from "@syncfusion/ej2-react-buttons";

// get ID from URL params router v7
export const loader = async ({ params }: LoaderFunctionArgs) => {
  try {
    const { tripId } = params as { tripId?: string };
    if (!tripId) {
      throw new Error("Trip ID is required");
    }

    // Run both promises in parallel
    const [trip, trips] = await Promise.all([
      getTripById(tripId),
      getAllTrips(4, 0),
    ]);

    if (!trip) {
      throw new Error("Trip not found");
    }

    const popularTrips =
      trips?.allTrips
        .map((trip) => {
          const parsedTrip = parseTripData(trip?.tripDetail);
          return parsedTrip
            ? { ...parsedTrip, id: trip?.$id, imageUrls: trip?.imageUrls }
            : null;
        })
        .filter((trip): trip is NonNullable<typeof trip> => trip !== null) ||
      [];

    return { trip, popularTrips };
  } catch (error) {
    console.error("Error in loader:", error);
    return redirect("/trips");
  }
};

export const HydrateFallback = () => {
  return <p>Loading trip details...</p>;
};

const TripDetails = ({ loaderData }: Route.ComponentProps) => {
  const navigate = useNavigate();
  const { trip, popularTrips } = loaderData;
  const tripDetails = parseTripData(trip?.tripDetail);

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
    interests,
    itinerary,
    travelStyle,
    weatherInfo,
  } = tripDetails;

  const pillItems = [
    { text: travelStyle, bg: "!bg-pink-50 !text-pink-500" },
    { text: groupType, bg: "!bg-primary-50 !text-primary-500" },
    { text: budget, bg: "!bg-success-50 !text-success-700" },
    { text: interests, bg: "!bg-navy-50 !text-navy-500" },
  ];
  const visitTimeAndWeatherInfo = [
    { title: "Best Time to Visit", items: bestTimeToVisit },
    { title: "Weather", items: weatherInfo },
  ];

  return (
    <main className='travel-detail wrapper'>
      <Header
        title='Trip Details'
        description='View and edit AI-generated travel plans.'
      />
      <section className='container wrapper-md'>
        <header>
          <h1 className='p-40-semibold text-dark-100'>{name}</h1>
          <div className='flex flex-wrap items-center gap-5'>
            <InfoPill
              text={`${duration > 1 ? duration : "1"} day${
                duration > 1 ? "s" : ""
              } plan`}
              image='/assets/icons/calendar.svg'
            />
            <InfoPill
              text={
                itinerary
                  ?.slice(0, 2)
                  .map((item) => `${item.location}`)
                  .join(", ") || ""
              }
              image='/assets/icons/location-mark.svg'
            />
          </div>
        </header>
        <section className='gallery'>
          {trip?.imageUrls &&
            trip.imageUrls.map((url: string, index: number) => (
              <img
                key={index}
                src={url}
                alt={`Trip Image ${index + 1}`}
                className={cn(
                  "w-full rounded-xl object-cover",
                  index === 0
                    ? "md:col-span-2 md:row-span-2 h-[330px]"
                    : "md:col-span-1 md:row-span-1 h-[150px]"
                )}
              />
            ))}
        </section>
        <section className='flex gap-3 md:gap-5 items-center flex-wrap'>
          <ChipListComponent id='travel-chip'>
            <ChipsDirective>
              {pillItems.map((pill, index) => (
                <ChipDirective
                  key={index}
                  text={getFirstWord(pill.text)}
                  cssClass={`${pill.bg} !text-base !font-medium !px-4`}
                />
              ))}
            </ChipsDirective>
          </ChipListComponent>
          <ul className='flex gap-1 items-center'>
            {Array(5)
              .fill(null)
              .map((_, index) => (
                <li key={index}>
                  <img
                    src='/assets/icons/star.svg'
                    alt='Rating Star'
                    className='size-[18px]'
                  />
                </li>
              ))}
            <li>
              <ChipListComponent>
                <ChipsDirective>
                  <ChipDirective
                    text={"4.9/5"}
                    cssClass='!bg-yellow-50 !text-yellow-700'
                  />
                </ChipsDirective>
              </ChipListComponent>
            </li>
          </ul>
        </section>
        <section className='title'>
          <article>
            <h3>
              {duration > 1 ? `${duration} Days` : "1 Day"} {country}{" "}
              {travelStyle} Trip
            </h3>
            <p>
              {budget}, {groupType} and {interests}
            </p>
          </article>
          <h2>{estimatedPrice}</h2>
        </section>
        <p className='text-sm md:text-lg font-normal text-dark-400'>
          {description}
        </p>
        <ul className='itinerary'>
          {itinerary.map((dayPlan: DayPlan, index) => (
            <li key={index}>
              <h3>
                Day: {dayPlan.day}: {dayPlan.location}
              </h3>
              <ul>
                {dayPlan.activities.map((activity, index) => (
                  <li key={index}>
                    <span className='flex-shrink-0 p-16-semibold text-dark-400'>
                      {activity.time}
                    </span>
                    <p className='flex-grow'>{activity.description}</p>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
        {visitTimeAndWeatherInfo.map((info) => (
          <section key={info.title} className='visit-time-weather'>
            <h3 className='p-40-semibold text-dark-100 mb-4'>{info?.title}</h3>
            <ul className='flex flex-wrap gap-2'>
              {info?.items.map((item) => (
                <li key={item} className='flex items-center gap-2'>
                  <p className='flex-grow'>{item}</p>
                </li>
              ))}
            </ul>
          </section>
        ))}
        <section className='flex flex-col gap-6'>
          <h2 className='p-24-semibold text-dark-100'>Popular Trips</h2>
          {popularTrips.length > 0 ? (
            <div className='trip-grid'>
              {popularTrips.map(
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
                      tags={[interests, travelStyle]}
                    />
                  )
              )}
            </div>
          ) : (
            <p>No popular trips available.</p>
          )}
        </section>
      </section>
    </main>
  );
};

export default TripDetails;
