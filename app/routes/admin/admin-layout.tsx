import { Outlet, redirect } from "react-router";
import { SidebarComponent } from "@syncfusion/ej2-react-navigations";
import { MobileSidebar, NavItems } from "components";
import { account } from "~/appwrite/client";
import { getExistingUser, storeUserData } from "~/appwrite/auth";

export async function clientLoader() {
  try {
    const user = await account.get();
    if (!user.$id) {
      // If user is not logged in, redirect to the sign-in page
      return redirect("/sign-in");
    }
    const existingUser = await getExistingUser(user.$id);
    if (existingUser?.status === "user") {
      // If user's status is "user", redirect to the home page
      return redirect("/");
    }
    return existingUser?.$id ? existingUser : await storeUserData();
  } catch (error) {
    console.log("Error in AdminLayout clientLoader: signing in user - ", error);
    return redirect("/sign-in");
  }
}

export function HydrateFallback() {
  return <p>Loading...</p>;
}

const AdminLayout = () => {
  return (
    <>
      <div className='admin-layout'>
        <MobileSidebar />
        <aside className='w-full max-w-[270px] hidden lg:block'>
          <SidebarComponent width={"270px"} enableGestures={false}>
            <NavItems />
          </SidebarComponent>
        </aside>
        <aside className='children'>
          <Outlet />
        </aside>
      </div>
    </>
  );
};

export default AdminLayout;
