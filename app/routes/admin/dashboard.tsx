import { Header } from "components"
import { user } from "~/constants"

const Dashboard = () => {
  return (
    <main className="dashboard wrapper">
      <Header title={`Welcome, ${user?.name ?? "Guest"} 👋`} description="Track activities, trends and popular destinations in real time." onButtonClick={() => console.log("Header clicked")} />

        Dashboard content goes here. You can add charts, statistics, and other relevant information to provide insights into the application's performance or user activities.
    </main>
  )
}

export default Dashboard