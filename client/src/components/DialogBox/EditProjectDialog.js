import React, { useState } from "react";

const EditProjectDialog = ({ project, onClose, onSave }) => {
  const [projectDetails, setProjectDetails] = useState({
    name: project.name,
    description: project.description,
    members: project.members,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProjectDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleSave = () => {
    onSave(projectDetails);
  };

  const handleRemoveMember = (memberIndex) => {
    setProjectDetails((prevDetails) => ({
      ...prevDetails,
      members: prevDetails.members.filter((_, index) => index !== memberIndex),
    }));
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4">Edit Project</h2>
        <label className="block mb-2">
          Project Name:
          <input
            type="text"
            name="name"
            value={projectDetails.name}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </label>
        <label className="block mb-4">
          Description:
          <textarea
            name="description"
            value={projectDetails.description}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </label>
        <div className="mb-4">
          <h3 className="text-xl font-bold mb-2">Members</h3>
          <ul className="list-disc list-inside space-y-2">
            {projectDetails.members.map((member, index) => (
              <li key={index} className="flex justify-between items-center">
                <span>
                  {member.userId.name} ({member.userId.email}) - {member.role}
                </span>
                <button
                  onClick={() => handleRemoveMember(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProjectDialog;
