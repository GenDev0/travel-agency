// @ts-nocheck
import { SidebarComponent } from "@syncfusion/ej2-react-navigations";
import { Link } from "react-router";
import NavItems from "./nav-items";

const MobileSidebar = () => {
  let sidebar: SidebarComponent;
  const toggleSidebar = () => {
    sidebar.toggle();
  };
  return (
    <div className='mobile-sidebar wrapper'>
      <header>
        <Link to='/' className='link-logo'>
          <img
            className='size-[30px]'
            src='/assets/icons/logo.svg'
            alt='logo'
          />
          <h1>Tourismo</h1>
        </Link>

        <button onClick={toggleSidebar}>
          <img src='/assets/icons/menu.svg' alt='Menu' className='size-7' />
        </button>
      </header>
      <SidebarComponent
        width='270'
        ref={(Sidebar) => (sidebar = Sidebar)}
        created={() => sidebar.hide()}
        closeOnDocumentClick={true}
        showBackdrop={true}
        type='over'
      >
        <NavItems handleClick={toggleSidebar} />
      </SidebarComponent>
    </div>
  );
};

export default MobileSidebar;
