import React from 'react';
import { Link } from 'react-router-dom';

const ProjectCard = ({ project }) => {
  return (
    <div className="w-64 h-60 border-2 border-blue-500 rounded-lg overflow-hidden shadow-lg p-6 m-4 bg-blue-50 transform transition duration-300 hover:scale-105 hover:bg-blue-100">
      <Link to={`/project/${project._id}`}>
        <div className="font-bold text-xl mb-2 text-blue-700">{project.name}</div>
        <p className="text-gray-700 text-base mb-4 line-clamp-3">{project.description}</p>
        <p className="text-gray-500 text-sm mb-2">Members: {project.members.length}</p>
        <p className="text-gray-500 text-sm">Tasks: {project.tasks.length}</p>
      </Link>
    </div>
  );
};

export default ProjectCard;
