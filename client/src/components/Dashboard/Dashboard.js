import React, { useEffect } from "react";
import ProjectList from "../Project/ProjectList";
import { Link, useNavigate } from "react-router-dom";
import TaskList from "../Task/TaskList";
import DashNavigator from "./DashNavigator";
import { useSelector } from "react-redux";
import { loadUser } from "../../redux/authSlice";
const Dashboard = () => {
  const {isAuthenticated,user}=useSelector((state)=>state.auth);
  const Navigate=useNavigate();

  useEffect(()=>{
     checkIsAuth();
  },[]);
  const checkIsAuth=()=>{
    if(!isAuthenticated || !user){
      const token=localStorage.getItem("token");
      if(token){
        loadUser();
        return;
      }
      Navigate('/login');
     }
  }
  return (
    <div className="bg-gray-100 min-h-screen flex justify-center items-center">
      <div className="container mx-auto">
       <DashNavigator/>
       <div>
        <Link
          to="/createProject"
          className="bg-blue-600 text-white float-end mr-8   px-4 py-2 rounded hover:bg-blue-700"
        >
          Create Project
        </Link> 
       </div>
        <div className="py-8 px-4 sm:px-6 lg:px-8">
          
          <ProjectList  />
        </div>
        <div className="py-8 px-4 sm:px-6 lg:px-8">
          <TaskList />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
