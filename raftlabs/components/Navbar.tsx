
import raftlabs from "../src/assets/raftlabs.png"

const Navbar = () => {
  return (
    <nav className="bg-white bg-fixed border-black-300 border-4 h-100"> {/* Use h-[200px] for height of 200px */}
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4 h-full"> {/* Ensure the content is vertically centered */}
        <a href="#" className="flex items-center space-x-3 rtl:space-x-reverse">
          <img src={raftlabs} className="h-8" alt="Flowbite Logo" />
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">TO-DO List</span>
        </a>
        
        <div className="hidden w-full md:block md:w-auto" id="navbar-default">
          {/* You can add navbar links or buttons here */}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
