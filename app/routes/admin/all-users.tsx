import { Header } from 'components'

const AllUsers = () => {
  return (
    <main className="dashboard wrapper">
      <Header title="Users Page" description="Check out our users in real time." onButtonClick={() => console.log("Header clicked")} />
      

      All users Page content goes here.
    </main>
  )
}

export default AllUsers