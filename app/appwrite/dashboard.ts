import { parseTripData } from "lib/utils";
import { appwriteConfig, database } from "./client";

interface Document {
  [key: string]: any; // Allow any other properties
}
type FilterByDate = (
  items: Document[],
  key: string,
  startDate: string,
  endDate?: string
) => number;

// get Users and Trips Stats from Appwrite
export const getUsersAndTripsStats = async () => {
  try {
    const d = new Date();
    const startOfCurrentMonth = new Date(
      d.getFullYear(),
      d.getMonth(),
      1
    ).toISOString();
    const startOfLastMonth = new Date(
      d.getFullYear(),
      d.getMonth() - 1,
      1
    ).toISOString();
    const endOfLastMonth = new Date(
      d.getFullYear(),
      d.getMonth(),
      0
    ).toISOString();
    const [users, trips] = await Promise.all([
      database.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId
      ),
      database.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.tripCollectionId
      ),
    ]);
    const filterByDate: FilterByDate = (items, key, startDate, endDate) => {
      return items.filter((item) => {
        const itemDate = new Date(item[key]);
        return (
          itemDate >= new Date(startDate) &&
          (endDate ? itemDate <= new Date(endDate) : true)
        );
      }).length;
    };
    const filterUsersByRole = (role: string) => {
      return users.documents.filter((user: Document) => user.status === role);
    };
    return {
      totalUsers: users.total,
      totalTrips: trips.total,
      usersJoined: {
        currentMonth: filterByDate(
          users.documents,
          "joinedAt",
          startOfCurrentMonth
        ),
        lastMonth: filterByDate(
          users.documents,
          "joinedAt",
          startOfLastMonth,
          endOfLastMonth
        ),
      },
      userRole: {
        total: filterUsersByRole("user").length,
        currentMonth: filterByDate(
          filterUsersByRole("user"),
          "joinedAt",
          startOfCurrentMonth
        ),
        lastMonth: filterByDate(
          filterUsersByRole("user"),
          "joinedAt",
          startOfLastMonth,
          endOfLastMonth
        ),
      },
      tripsCreated: {
        currentMonth: filterByDate(
          trips.documents,
          "createdAt",
          startOfCurrentMonth
        ),
        lastMonth: filterByDate(
          trips.documents,
          "createdAt",
          startOfLastMonth,
          endOfLastMonth
        ),
      },
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return { userCount: 0, tripCount: 0 };
  }
};

export const getUserGrowthPerDay = async () => {
  const users = await database.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.userCollectionId
  );

  const userGrowth = users.documents.reduce(
    (acc: { [key: string]: number }, user: Document) => {
      const date = new Date(user.joinedAt);
      const day = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      acc[day] = (acc[day] || 0) + 1;
      return acc;
    },
    {}
  );

  return Object.entries(userGrowth).map(([day, count]) => ({
    count: Number(count),
    day,
  }));
};

export const getTripsCreatedPerDay = async () => {
  const trips = await database.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.tripCollectionId
  );

  const tripsGrowth = trips.documents.reduce(
    (acc: { [key: string]: number }, trip: Document) => {
      const date = new Date(trip.createdAt);
      const day = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      acc[day] = (acc[day] || 0) + 1;
      return acc;
    },
    {}
  );

  return Object.entries(tripsGrowth).map(([day, count]) => ({
    count: Number(count),
    day,
  }));
};

export const getTripsByTravelStyle = async () => {
  const trips = await database.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.tripCollectionId
  );

  const travelStyleCounts = trips.documents.reduce(
    (acc: { [key: string]: number }, trip: Document) => {
      const tripDetail = parseTripData(trip.tripDetail);

      if (tripDetail && tripDetail.travelStyle) {
        const travelStyle = tripDetail.travelStyle;
        acc[travelStyle] = (acc[travelStyle] || 0) + 1;
      }
      return acc;
    },
    {}
  );

  return Object.entries(travelStyleCounts).map(([travelStyle, count]) => ({
    count: Number(count),
    travelStyle,
  }));
};
