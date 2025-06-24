import { Header } from "components";

const Trips = () => {
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
