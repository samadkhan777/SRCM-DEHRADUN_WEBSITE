import { useState } from "react";
import { Link } from "react-router-dom";
import topLogoWhiteMode from "url:../Images/Heartfulness_Logo_Blk_Pwd_8f65f0f06c.svg";
import topLogoDarkMode from "url:../Images/Heartfulness_Logo_Wht_Pwd_5725d94b54.svg";

const Header = () => {

    const[ menuOpen, setMenuOpen] = useState(false);
  
    return (
         <header className="w-full relative z-50 bg-white dark:bg-gray-900 shadow-md ">

          <div className="max-w-7xl mx-auto px-4">
              
              <div className="flex items-center justify-between h-16">
              
                <Link to="/" className="flex items-center cursor-pointer">
                    <img className="block dark:hidden h-12 w-auto object-contain " src= {topLogoWhiteMode} alt ="HFN White mode logo" />
           
                    <img className="hidden dark:block h-12 w-auto object-contain " src= {topLogoDarkMode} alt ="HFN Dark mode logo" />
                </Link>
               
               <nav className="hidden md:flex items-center gap-8"> 
                
                <Link to="/events" className="font-bold text-gray-700 dark:text-gray-200 ">
                    Events
                </Link>
                
                <Link to="/about" className="font-bold text-gray-700 dark:text-gray-200 ">
                    About
                </Link>
                
                <button className="font-bold text-gray-700 dark:text-gray-200 ">
                    Locate us
                </button>
                
                <button className="font-bold text-gray-700 dark:text-gray-200 ">
                    हिन्दी
                </button>

                <input 
                    type="text"
                    placeholder="Search.."
                    className="ml-4 px-3 py-1.5 rounded-md border border-gray-300 dark:border-gray-600 bg-transparent focus:outline-none focus:ring-1 focus:ring-blue-40"
                />

               </nav>  
             

              <button
                className="md:hidden text-2xl" 
                onClick={() => setMenuOpen(!menuOpen)}
              >
                ☰  
              </button>
            
            </div>  

              {/* Mobile Menu */}

              {menuOpen && (
  <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 px-4 py-6 space-y-5 transition-all duration-300">

    <Link
      to="/events"
      onClick={() => setMenuOpen(false)}
      className="block text-gray-800 dark:text-gray-200 hover:text-blue-500"
    >
      Events
    </Link>

    <Link
      to="/about"
      onClick={() => setMenuOpen(false)}
      className="block text-gray-800 dark:text-gray-200 hover:text-blue-500"
    >
      About
    </Link>

    <button className="block text-left text-gray-800 dark:text-gray-200 hover:text-blue-500">
      Locate Us
    </button>

    <button className="block text-left text-gray-800 dark:text-gray-200 hover:text-blue-500">
      हिन्दी
    </button>

    <input
      type="text"
      placeholder="Search..."
      className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-transparent text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
    />
  </div>
)}
          
          </div>
        
         </header>
    );
};

export default Header;