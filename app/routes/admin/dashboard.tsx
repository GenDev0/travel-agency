import { Header, StatsCard, TripCard } from "components";
import { getAllUsers, getUser } from "~/appwrite/auth";
import type { Route } from "./+types/dashboard";
import {
  getTripsByTravelStyle,
  getTripsCreatedPerDay,
  getUserGrowthPerDay,
  getUsersAndTripsStats,
} from "~/appwrite/dashboard";
import { getAllTrips } from "~/appwrite/trips";
import { parseTripData } from "lib/utils";
import {
  Category,
  ChartComponent,
  ColumnSeries,
  DataLabel,
  Inject,
  Legend,
  load,
  Series,
  SeriesCollectionDirective,
  SeriesDirective,
  SplineAreaSeries,
  Tooltip,
} from "@syncfusion/ej2-react-charts";
import { tripXAxis, tripYAxis, userXAxis, userYAxis } from "~/constants";
import {
  ColumnDirective,
  ColumnsDirective,
  GridComponent,
} from "@syncfusion/ej2-react-grids";

// export async function clientLoader() {
//   return await getUser();
// }

export const clientLoader = async () => {
  const [
    user,
    dashboardStats,
    trips,
    userGrowth,
    tripsCreated,
    tripsByTravelStyle,
    allUsers,
  ] = await Promise.all([
    getUser(),
    getUsersAndTripsStats(),
    getAllTrips(4, 0),
    getUserGrowthPerDay(),
    getTripsCreatedPerDay(),
    getTripsByTravelStyle(),
    getAllUsers(4, 0),
  ]);
  const allTrips =
    trips.allTrips
      .map(({ $id, tripDetail, imageUrls }) => ({
        id: $id,
        ...parseTripData(tripDetail),
        imageUrls: imageUrls || [],
      }))
      .filter((trip): trip is NonNullable<typeof trip> => trip !== null) || [];
  const mappedUsers: UsersItineraryCount[] = allUsers.users.map((user) => ({
    name: user.name,
    imageUrl: user.imageUrl || "",
    count: user.itineraryCount || 0,
  }));
  return {
    user,
    dashboardStats,
    allTrips,
    userGrowth,
    tripsCreated,
    tripsByTravelStyle,
    allUsers: mappedUsers,
  };
};

export function HydrateFallback() {
  return <p>Loading...</p>;
}

const Dashboard = ({ loaderData }: Route.ComponentProps) => {
  const {
    totalTrips,
    totalUsers,
    tripCount,
    tripsCreated,
    userCount,
    userRole,
    usersJoined,
  } = loaderData.dashboardStats;
  const user = loaderData.user as User | null;
  const { allTrips, tripsByTravelStyle, allUsers, userGrowth } = loaderData;

  const trips = allTrips.map((trip) => ({
    imageUrl: trip.imageUrls[0],
    name: trip.name,
    interest: trip.interests,
  }));

  const usersAndTrips = [
    {
      title: "Latest user signups",
      dataSource: allUsers,
      field: "count",
      headerText: "Trips created",
    },
    {
      title: "Trips based on interests",
      dataSource: trips,
      field: "interest",
      headerText: "Interests",
    },
  ];

  return (
    <main className='dashboard wrapper'>
      <Header
        title={`Welcome, ${user?.name ?? "Guest"} 👋`}
        description='Track activities, trends and popular destinations in real time.'
        onButtonClick={() => console.log("Header clicked")}
      />

      <section className='flex flex-col gap-6'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 w-full'>
          <StatsCard
            headerTitle={"Total Users"}
            total={totalUsers ?? 0}
            currentMonthCount={usersJoined?.currentMonth ?? 0}
            lastMonthCount={usersJoined?.lastMonth ?? 0}
          />
          <StatsCard
            headerTitle={"Total Trips"}
            total={totalTrips ?? 0}
            currentMonthCount={tripsCreated?.currentMonth ?? 0}
            lastMonthCount={tripsCreated?.lastMonth ?? 0}
          />
          <StatsCard
            headerTitle={"Active Users"}
            total={userRole?.total ?? 0}
            currentMonthCount={userRole?.currentMonth ?? 0}
            lastMonthCount={userRole?.lastMonth ?? 0}
          />
        </div>
      </section>
      <section className='container mx-auto'>
        <h1 className='text-xl font-semibold text-dark-100 mb-4'>
          Created Trips
        </h1>
        <div className='trip-grid'>
          {allTrips.map(
            ({
              id,
              imageUrls,
              itinerary,
              name,
              estimatedPrice,
              interests,
              travelStyle,
            }) => (
              <TripCard
                key={id}
                id={id.toString()}
                imageUrl={imageUrls[0]}
                location={itinerary?.[0].location ?? ""}
                name={name || ""}
                price={estimatedPrice || "0"}
                tags={[interests ?? "", travelStyle ?? ""]}
              />
            )
          )}
        </div>
      </section>
      <section className='grid grid-cols-1 lg:grid-cols-2 gap-5'>
        <ChartComponent
          id='user-growth-chart'
          primaryXAxis={userXAxis}
          primaryYAxis={userYAxis}
          title='User Growth'
          tooltip={{ enable: true }}
        >
          <Inject
            services={[
              ColumnSeries,
              SplineAreaSeries,
              Category,
              DataLabel,
              Tooltip,
              Legend,
            ]}
          />
          <SeriesCollectionDirective>
            <SeriesDirective
              dataSource={userGrowth}
              xName='day'
              yName='count'
              type='Column'
              name='Users'
              columnWidth={0.3}
              cornerRadius={{ topLeft: 10, topRight: 10 }}
              marker={{ visible: true, width: 10, height: 10 }}
            />
            <SeriesDirective
              dataSource={userGrowth}
              xName='day'
              yName='count'
              type='SplineArea'
              name='Wave'
              fill='rgba(135, 206, 235, 0.5)'
              border={{ width: 2, color: "#55a8c9" }}
            />
          </SeriesCollectionDirective>
        </ChartComponent>
        <ChartComponent
          id='trip-trend-chart'
          primaryXAxis={tripXAxis}
          primaryYAxis={tripYAxis}
          title='Trip Trends'
          tooltip={{ enable: true }}
        >
          <Inject
            services={[
              ColumnSeries,
              SplineAreaSeries,
              Category,
              DataLabel,
              Tooltip,
              Legend,
            ]}
          />
          <SeriesCollectionDirective>
            <SeriesDirective
              dataSource={tripsByTravelStyle}
              xName='travelStyle'
              yName='count'
              type='Column'
              name='Trips'
              columnWidth={0.3}
              cornerRadius={{ topLeft: 10, topRight: 10 }}
            />
          </SeriesCollectionDirective>
        </ChartComponent>
      </section>
      <section className='user-trip wrapper'>
        {usersAndTrips.map(
          ({ title, dataSource, field, headerText }, index) => (
            <div key={index} className='flex flex-col gap-5'>
              <h3 className='p-20-semibold text-dark-100'>{title}</h3>
              <GridComponent dataSource={dataSource} gridLines='None'>
                <ColumnsDirective>
                  <ColumnDirective
                    field={field}
                    headerText={headerText}
                    width='200'
                    textAlign='Left'
                    template={(props: UserData) => (
                      <div className='flex items-center gap-1.5 px-4'>
                        <img
                          src={props.imageUrl}
                          alt={props.name}
                          className='size-8 rounded-full aspect-square'
                          referrerPolicy='no-referrer'
                          loading='lazy'
                        />
                        <span>{props.name}</span>
                      </div>
                    )}
                  />
                  <ColumnDirective
                    field={field}
                    headerText={headerText}
                    width='150'
                    textAlign='Left'
                  />
                </ColumnsDirective>
              </GridComponent>
            </div>
          )
        )}
      </section>
    </main>
  );
};

export default Dashboard;
