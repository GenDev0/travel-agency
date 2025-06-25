// Get all trips from appwrite
import { appwriteConfig, database } from './client';
import { Query, type Models } from 'appwrite';

export  const getAllTrips = async (limit: number, offset: number) => {
    try {
        const allTrips = await database.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.tripCollectionId,
            [
                Query.limit(limit),
                Query.offset(offset),
                Query.orderDesc('createdAt'),
            ]
        );
        if (allTrips.total === 0) {
            return { allTrips: [], total: 0 };
        }
        
        return { allTrips: allTrips.documents, total: allTrips.total };
    } catch (error) {
        console.log('Error fetching trips:', error);
        return { allTrips: [], total: 0 };
    }
}

// Get trip by ID from appwrite
export const getTripById = async (tripId: string) => {
    try {
        const trip = await database.getDocument(
            appwriteConfig.databaseId,
            appwriteConfig.tripCollectionId,
            tripId
        );
        if (!trip.$id) {
            console.log('Trip not found');
            return null;
        }
        return trip;
    } catch (error) {
        console.log('Error fetching trip by ID:', error);
        return null;
    }
}
