import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const Home = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <div className="font-sans text-gray-900">
      <header className="text-center py-12 bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
        <h1 className="text-5xl font-bold mb-4 transition duration-500 transform hover:scale-105">Welcome to UrbanSync</h1>
        <p className="text-xl mb-6 transition duration-500 transform hover:scale-105">Empowering Inter-Departmental Cooperation for Seamless Urban Development</p>
      </header>
      <main className="p-8">
        <section className="mb-12">
          <h2 className="text-4xl font-semibold mb-8 text-center">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-6 bg-blue-100 rounded-lg shadow-lg transition duration-500 transform hover:scale-105 hover:bg-blue-200">
              <h3 className="text-2xl font-bold mb-2">Task Scheduling & Work Distribution</h3>
              <p className="text-lg">Manage and coordinate inter-departmental tasks and workflows.</p>
            </div>
            <div className="p-6 bg-blue-100 rounded-lg shadow-lg transition duration-500 transform hover:scale-105 hover:bg-blue-200">
              <h3 className="text-2xl font-bold mb-2">Unified Project Planning</h3>
              <p className="text-lg"> Align overlapping projects and streamline phases to reduce conflicts.</p>
            </div>
            <div className="p-6 bg-blue-100 rounded-lg shadow-lg transition duration-500 transform hover:scale-105 hover:bg-blue-200">
              <h3 className="text-2xl font-bold mb-2">Training & Capacity Building</h3>
              <p className="text-lg"> Provide workshops and training to enhance skills.</p>
            </div>
            <div className="p-6 bg-blue-100 rounded-lg shadow-lg transition duration-500 transform hover:scale-105 hover:bg-blue-200">
              <h3 className="text-2xl font-bold mb-2">Data & Resource Exchange</h3>
              <p className="text-lg"> Share and access technical expertise, machinery, and project data.</p>
            </div>
            <div className="p-6 bg-blue-100 rounded-lg shadow-lg transition duration-500 transform hover:scale-105 hover:bg-blue-200">
              <h3 className="text-2xl font-bold mb-2">Advanced Analytics and Reporting</h3>
              <p className="text-lg">Get detailed analytics and reports to make informed decisions.</p>
            </div>
            <div className="p-6 bg-blue-100 rounded-lg shadow-lg transition duration-500 transform hover:scale-105 hover:bg-blue-200">
              <h3 className="text-2xl font-bold mb-2">Discussion Forums</h3>
              <p className="text-lg">Enable collaborative discussions within and between departments and with the public.</p>
            </div>
          </div>
        </section>
        {!isAuthenticated && (
          <section className="mb-12 text-center">
            <h2 className="text-4xl font-semibold mb-4">Get Started</h2>
            <p className="text-lg mb-6">Sign up now and take control of your projects.</p>
            <Link to="/signup" className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition duration-300 transform hover:scale-105">
              Sign Up
            </Link>
            <Link to="/login" className="ml-4 inline-block bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700 transition duration-300 transform hover:scale-105">
              Log In
            </Link>
          </section>
        )}
      </main>
    </div>
  );
};

export default Home;
