import { cn } from "lib/utils"
import { Link, NavLink } from "react-router"
import { sidebarItems } from "~/constants"

const NavItems = ({handleClick} : {handleClick?: () => void}) => {

    const user = {
        name: "Ahmed Chebbi",
        email: "ahmed@chebbi.com",
        imageUrl: "/assets/images/david.webp"

    }

  return (
    <section className="nav-items">
        <Link to="/" className="link-logo">
          <img className="size-[30px]" src="/assets/icons/logo.svg" alt="logo" />
          <h1>Tourismo</h1>
        </Link>
        <div className="container">
            <nav>
                {sidebarItems.map(({id,href,icon,label}) => (
                   <NavLink key={id} to={href}>
                       {({isActive}) => (
                           <div className={cn(
                               "group nav-item", {"bg-primary-100 !text-white": isActive})}>
                               <img src={icon} alt={label} className={`group-hover:brightness-0 size-0 group-hover:invert ${isActive ? 'brightness-0 invert' : 'text-dark-200'}`}
                               onClick={handleClick}
                               />
                               <span>{label}</span>
                           </div>
                       )}
                   </NavLink>
                ))}
            </nav>
            <footer className="nav-footer">
                <img src={user?.imageUrl || "/assets/images/david.webp"} alt={user?.name || "User"} />
                <article>
                    <h2>{user?.name || "User"}</h2>
                    <p>{user?.email || "user@example.com"}</p>
                </article>
                <button onClick={() => console.log("Logout")} className="cursor-pointer">
                    <img src="/assets/icons/logout.svg" alt="Logout" className="size-6"/>
                </button>
            </footer>
        </div>
    </section>
  )
}

export default NavItems