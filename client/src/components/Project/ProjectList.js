import React, { useEffect } from 'react';
import { useProjects } from '../../context/ProjectContext';
import ProjectCard from './ProjectCard';

const ProjectList = () => {
  const { projects, fetchProjects, loading } = useProjects();

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  if (loading) return <p>Loading...</p>;

  return (
    <section className="mt-4 py-8 px-4 sm:px-6 lg:px-8 bg-gray-300">
      
      <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-4 text-center text-purple-700">My Projects</h1>

        {projects.length>0?<div className="flex flex-wrap justify-around ">
          {projects.length>0 && projects.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>:<div className='text-center text-gray-700 mt-6 text-l'>
          No Projects Found.
        </div>}
      </div>
    </section>
  );
};

export default ProjectList;
