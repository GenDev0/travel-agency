import { GoogleGenerativeAI } from "@google/generative-ai";
import { ID } from "appwrite";
import { parseMarkdownToJson } from "lib/utils";
import { data, type ActionFunctionArgs } from "react-router";
import { appwriteConfig, database } from "~/appwrite/client";

export const action = async ({ request }: ActionFunctionArgs) => {
  const {country, numberOfDays, travelStyle, interests, budget, groupType, userId} = await request.json();
  const genAi = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const unsplashApiKey = process.env.UNSPLASH_ACCESS_KEY!;

  try {
    const prompt = `Generate a ${numberOfDays}-day travel itinerary for ${country} based on the following user information:
    Budget: '${budget}'
    Interests: '${interests}'
    TravelStyle: '${travelStyle}'
    GroupType: '${groupType}'
    Return the itinerary and lowest estimated price in a clean, non-markdown JSON format with the following structure:
    {
    "name": "A descriptive title for the trip",
    "description": "A brief description of the trip and its highlights not exceeding 100 words",
    "estimatedPrice": "Lowest average price for the trip in USD, e.g.$price",
    "duration": ${numberOfDays},
    "budget": "${budget}",
    "travelStyle": "${travelStyle}",
    "country": "${country}",
    "interests": ${interests},
    "groupType": "${groupType}",
    "bestTimeToVisit": [
      '🌸 Season (from month to month): reason to visit',
      '☀️ Season (from month to month): reason to visit',
      '🍁 Season (from month to month): reason to visit',
      '❄️ Season (from month to month): reason to visit'
    ],
    "weatherInfo": [
      '☀️ Season: temperature range in Celsius (temperature range in Fahrenheit)',
      '🌦️ Season: temperature range in Celsius (temperature range in Fahrenheit)',
      '🌧️ Season: temperature range in Celsius (temperature range in Fahrenheit)',
      '❄️ Season: temperature range in Celsius (temperature range in Fahrenheit)'
    ],
    "location": {
      "city": "name of the city or region",
      "coordinates": [latitude, longitude],
      "openStreetMap": "link to open street map"
    },
    "itinerary": [
    {
      "day": 1,
      "location": "City/Region Name",
      "activities": [
        {"time": "Morning", "description": "🏰 Visit the local historic castle and enjoy a scenic walk"},
        {"time": "Afternoon", "description": "🖼️ Explore a famous art museum with a guided tour"},
        {"time": "Evening", "description": "🍷 Dine at a rooftop restaurant with local wine"}
      ]
    },
    ...
    ]
    }`;
    const textResult = await genAi.getGenerativeModel({
        model: "gemini-2.0-flash",
    }).generateContent([prompt]);
    const trip = parseMarkdownToJson(textResult.response.text());
    if (!trip) {
      throw new Error("Failed to parse the trip data from the AI response.");
    }
    // Get image from Unsplash
    const unsplashResponse = await fetch(`https://api.unsplash.com/search/photos?query=${country} ${interests} ${travelStyle}&client_id=${unsplashApiKey}`);
    if (!unsplashResponse.ok) {
      throw new Error("Failed to fetch images from Unsplash.");
    }
    const imageUrls = (await unsplashResponse.json()).results.slice(0,3).map((image: any) => image.urls?.regular || null);
       // Save the trip to your appwrite database
       const result = await database.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.tripCollectionId,
        ID.unique(),
        {
          tripDetail: JSON.stringify(trip),
          imageUrls: imageUrls,
          createdAt: new Date().toISOString(),
          userId: userId,
        }
        );

        return data({id: result.$id});

  } catch (error) {
    console.log("Error generating a travel plan:", error);
    return new Response("Failed to create a travel plan", { status: 500 });
    
  }
};
