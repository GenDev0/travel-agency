import { Outlet, useNavigate } from "react-router";
import { logoutUser } from "~/appwrite/auth";

export function HydrateFallback() {
  return <p>Loading...</p>;
}

const RootLayout = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate("/sign-in");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <>
      <main className='root-layout'>
        <button onClick={handleLogout} className='cursor-pointer'>
          <img src='/assets/icons/logout.svg' alt='Logout' className='size-6' />
        </button>
        <button
          onClick={() => {
            navigate("/dashboard");
          }}
          className='cursor-pointer'
        >
          Dashboard
        </button>
        <Outlet />
      </main>
    </>
  );
};

export default RootLayout;
