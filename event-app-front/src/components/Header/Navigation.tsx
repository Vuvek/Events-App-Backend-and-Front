import { Link } from "react-router-dom";
import { getDataFromStorage } from "../../utils/commonFunctions";
import { useState } from "react";
import EventModal from "../../modal/CreateEventModal";
import { useNavigate } from "react-router-dom";

const Navigation = () => {
  const userData = getDataFromStorage("token");
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/signin");
  };

  return (
    <div className="w-full bg-gray-800 text-white h-32 md:h-20 flex flex-wrap items-center justify-center md:justify-between sticky top-0 z-30">
      <div className="pl-6 m-2 md:m-0">
        <h1 className="font-bold text-2xl">Events App</h1>
      </div>

      <div className="pr-6 cursor-pointer">
        <div className="w-[40%] pl-4 flex items-center justify-between">
          <div className="text-white flex justify center items-center space-x-6">
            {userData ? (
              <>
                <button
                  data-modal-target="crud-modal"
                  data-modal-toggle="crud-modal"
                  className="block text-white bg-blue-700 hover:bg-blue-800 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  type="button"
                  onClick={() => setShowModal(true)}
                >
                  <h3 className="cursor-pointer hover:border-white whitespace-nowrap">
                    Create Event
                  </h3>
                </button>
                <button
                  data-modal-target="crud-modal"
                  data-modal-toggle="crud-modal"
                  className="block text-white bg-blue-700 hover:bg-blue-800 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  type="button"
                  onClick={handleLogout}
                >
                  <h3 className="cursor-pointer hover:border-white pr-4">
                    Logout
                  </h3>
                </button>
              </>
            ) : (
              <>
                <Link to="/signin">
                  <h3 className="cursor-pointer hover:border-b-2 hover:border-white">
                    Login
                  </h3>
                </Link>
                <Link to="/signup">
                  <h3 className="cursor-pointer hover:border-b-2 hover:border-white">
                    SignUp
                  </h3>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {showModal && <EventModal setShowModal={setShowModal} />}
    </div>
  );
};

export default Navigation;
