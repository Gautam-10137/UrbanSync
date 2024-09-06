import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../redux/authSlice";

const DashNavigator = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    console.log(user);
  }, [user]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <div className="flex justify-between items-center mb-4 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg p-4 shadow-lg transform transition duration-300 hover:shadow-xl">
      <Link to="/" className="text-3xl font-bold text-white hover:text-yellow-300 transition duration-300">
        RemoteCollab
      </Link>
      <Link to="/dashboard" className="text-3xl font-bold text-white hover:text-yellow-300 transition duration-300">
        My Dashboard
      </Link>
      <div className="flex items-center space-x-4 text-white">
        {user ? <span className="text-lg font-medium">Hello, {user.name}</span> : null}
        <button
          onClick={handleLogout}
          className="text-red-300 hover:text-red-500 transition duration-300"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default DashNavigator;
