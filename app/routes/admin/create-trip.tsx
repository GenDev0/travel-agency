import { ComboBoxComponent } from "@syncfusion/ej2-react-dropdowns";
import { Header } from "components";
import type { Route } from "./+types/create-trip";
import { comboBoxItems, selectItems } from "~/constants";
import { cn, formatKey } from "lib/utils";
import {
  LayerDirective,
  LayersDirective,
  MapsComponent,
} from "@syncfusion/ej2-react-maps";
import React, { useState } from "react";
import { world_map } from "~/constants/world_map";
import { ButtonComponent } from "@syncfusion/ej2-react-buttons";
import { account } from "~/appwrite/client";
import { redirect, useNavigate } from "react-router";

export const loader = async () => {
  try {
    const response = await fetch(
      "https://restcountries.com/v3.1/all?fields=name,latlng,maps,flag"
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data.map((country: any) => ({
      name: country.flag + country.name.common,
      coordinates: country.latlng,
      value: country.name.common,
      openStreetMap: country.maps?.openStreetMap,
    }));
  } catch (error) {
    console.log("Error fetching countries:", error);
    // Handle error appropriately, e.g., return an empty array or a default value
    return [];
  }
};

const CreateTrip = ({ loaderData }: Route.ComponentProps) => {
  const countries = loaderData as Country[];
  const navigate = useNavigate();
  const [formData, setFormData] = useState<TripFormData>({
    country: countries[0]?.name || "",
    travelStyle: "",
    interests: "",
    budget: "0",
    duration: 0,
    groupType: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const countryData = countries.map((country) => ({
    text: country.name,
    value: country.value,
  }));
  const mapData = [
    {
      country: formData.country,
      color: "#EA382E",
      coordinates:
        countries.find((country) => country.name === formData.country)
          ?.coordinates || [],
    },
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      console.log("🚀 ~ handleSubmit ~ formData:", formData);
      if (
        !formData.country ||
        !formData.travelStyle ||
        !formData.interests ||
        !formData.groupType ||
        !formData.budget
      ) {
        setError("Please fill in all fields correctly.");
        setLoading(false);
        return;
      }
      if (
        !formData.duration ||
        formData.duration < 1 ||
        formData.duration > 10
      ) {
        setError("Duration must be between 1 and 10 days.");
        setLoading(false);
        return;
      }
      const user = await account.get();
      if (!user) {
        setError("User not authenticated. Please log in.");
        setLoading(false);
        return;
      }
      // Proceed with form submission
      console.log("🚀 ~ handleSubmit ~ user:", user);
      console.log("🚀 ~ handleSubmit ~ form:", formData);

      try {
        const response = await fetch("/api/create-trip", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            country: formData.country,
            numberOfDays: formData.duration,
            travelStyle: formData.travelStyle,
            interests: formData.interests,
            budget: formData.budget,
            groupType: formData.groupType,
            userId: user.$id,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to create trip");
        }

        const result: CreateTripResponse = await response.json();
        console.log("Trip created successfully:", result);
        if (result?.id) {
          // Navigate to the trip details page
          console.log("Trip ID:", result.id);
          navigate(`/trips/${result.id}`);
        } else {
          setError("Trip creation failed. Please try again.");
        }
      } catch (error) {
        console.log("Error generating trip:", error);
        setError("Failed to generate the trip");
      }
    } catch (error) {
      console.log("Error submitting form:", error);
      setError("Failed to create trip");
    } finally {
      setLoading(false);
    }
  };
  function handleChange(key: keyof TripFormData, value: string | number) {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  return (
    <main className="flex flex-col gap-10 pb-20 wrapper">
      <Header
        title="Create A New Trip"
        description="View and Edit AI-Generated travel plans."
      />
      <section className="mt-2.5 wrapper-md">
        <form className="trip-form" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="country">Country</label>
            <ComboBoxComponent
              id="country"
              dataSource={countryData}
              fields={{ text: "text", value: "value" }}
              placeholder="Select a country"
              className="combo-box"
              change={(e: { value: string | undefined }) => {
                if (e.value) {
                  handleChange("country", e.value);
                }
              }}
              allowFiltering
              filtering={(e: any) => {
                const query = e.text.toLowerCase();
                e.updateData(
                  countryData.filter((item) =>
                    item.text.toLowerCase().includes(query)
                  )
                );
              }}
            />
          </div>
          <div>
            <label htmlFor="duration">Duration</label>
            <input
              id="duration"
              name="duration"
              type="number"
              placeholder="Enter trip duration (e.g., 7 days)"
              className="form-input placeholder:text-gray-100"
              onChange={(e) => handleChange("duration", Number(e.target.value))}
            />
          </div>
          {selectItems.map((key) => (
            <div key={key}>
              <label htmlFor={key}>{formatKey(key)}</label>
              <ComboBoxComponent
                id={key}
                dataSource={comboBoxItems[key].map((item) => ({
                  text: item,
                  value: item,
                }))}
                fields={{ text: "text", value: "value" }}
                placeholder={`Select ${formatKey(key)}`}
                className="combo-box"
                change={(e: { value: string | undefined }) => {
                  if (e.value) {
                    handleChange(key as keyof TripFormData, e.value);
                  }
                }}
                allowFiltering
                filtering={(e: any) => {
                  const query = e.text.toLowerCase();
                  e.updateData(
                    comboBoxItems[key].filter((item) =>
                      item.toLowerCase().includes(query)
                    )
                  );
                }}
              />
            </div>
          ))}
          <div>
            <label htmlFor="location">Location on the world map</label>
            <MapsComponent>
              <LayersDirective>
                <LayerDirective
                  shapeData={world_map}
                  dataSource={mapData}
                  shapePropertyPath="name"
                  shapeDataPath="country"
                  shapeSettings={{
                    colorValuePath: "color",
                    fill: "#E5E5E5",
                  }}
                />
              </LayersDirective>
            </MapsComponent>
          </div>
          <div className="bg-gray-200 h-px w-full" />
          {error && (
            <div className="error">
              <p>{error}</p>
            </div>
          )}
          <footer className="px-6 w-full">
            <ButtonComponent
              type="submit"
              className="button-class !h-12 !w-full"
              disabled={loading}
            >
              <img
                src={`/assets/icons/${loading ? "loader" : "magic-star"}.svg`}
                className={cn("size-5", { "animate-spin": loading })}
                alt="Generate Trip"
              />
              <span className="p-16-semibold text-white">
                {loading ? "Generating..." : "Generate Trip"}
              </span>
            </ButtonComponent>
          </footer>
        </form>
      </section>
    </main>
  );
};

export default CreateTrip;
