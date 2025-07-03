import { cn } from "lib/utils";
import { Link, NavLink, useLoaderData, useNavigate } from "react-router";
import { logoutUser } from "~/appwrite/auth";
import { sidebarItems } from "~/constants";

const NavItems = ({ handleClick }: { handleClick?: () => void }) => {
  const user = useLoaderData();
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
    <section className='nav-items'>
      <Link to='/' className='link-logo'>
        <img className='size-[30px]' src='/assets/icons/logo.svg' alt='logo' />
        <h1>Tourismo</h1>
      </Link>
      <div className='container'>
        <nav>
          {sidebarItems.map(({ id, href, icon, label }) => (
            <NavLink key={id} to={href}>
              {({ isActive }) => (
                <div
                  className={cn("group nav-item", {
                    "bg-primary-100 !text-white": isActive,
                  })}
                  onClick={handleClick}
                >
                  <img
                    src={icon}
                    alt={label}
                    className={`group-hover:brightness-0 size-0 group-hover:invert ${
                      isActive ? "brightness-0 invert" : "text-dark-200"
                    }`}
                  />
                  <span>{label}</span>
                </div>
              )}
            </NavLink>
          ))}
        </nav>
        <footer className='nav-footer'>
          <img
            src={user?.imageUrl || "/assets/images/david.webp"}
            alt={user?.name || "User"}
            loading='lazy'
            referrerPolicy='no-referrer'
          />
          <article>
            <h2>{user?.name || "User"}</h2>
            <p>{user?.email || "user@example.com"}</p>
          </article>
          <button onClick={handleLogout} className='cursor-pointer'>
            <img
              src='/assets/icons/logout.svg'
              alt='Logout'
              className='size-6'
            />
          </button>
        </footer>
      </div>
    </section>
  );
};

export default NavItems;
