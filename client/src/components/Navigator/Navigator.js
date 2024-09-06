import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../../redux/authSlice';

const Navigator = ({ page }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <div className="bg-gray-800 text-white">
      <div className="container mx-auto flex justify-between items-center py-4">
        <div className="text-2xl font-bold">
          <Link to="/" className="hover:text-gray-300 transition duration-300">
            UrbanSync
          </Link>
        </div>
        <div className="text-xl font-semibold flex space-x-8">
         
          <Link to="/dashboard" className="hover:text-gray-300 text-2xl transition duration-300">
            Dashboard
          </Link>
        </div>
        <div>
          {!isAuthenticated ? (
            <div className="flex space-x-4 mr-4">
              <Link to="/login" className="text-blue-300 hover:text-blue-500 transition duration-300">
                Login
              </Link>
              <Link to="/register" className="text-blue-300 hover:text-blue-500 transition duration-300">
                Sign Up
              </Link>
            </div>
          ) : (
            <div className="flex items-center space-x-4  text-xl mx-2">
              <span>Hello, {user.name}</span>
              <button onClick={handleLogout} className="text-red-300 mr-2 hover:text-red-500 transition duration-300">
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navigator;
