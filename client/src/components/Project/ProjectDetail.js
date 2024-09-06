import React, { useEffect, useRef, useState } from "react";
import { useProjects } from "../../context/ProjectContext";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axiosApi from "../../axios/api";
import TaskDetailDialog from "../DialogBox/TaskDetailDialog";
import AddTaskDialog from "../DialogBox/AddTaskDialog";
import AddMemberDialog from "../DialogBox/AddMemberDialog";
import Chat from "../Chat/Chat";
import EditProjectDialog from "../DialogBox/EditProjectDialog";
import MetricsDialog from "../DialogBox/MetricsDialog";

const ProjectDetail = () => {
  const { projectId } = useParams();
  const { projects, removeProject } = useProjects();
  const [project, setProject] = useState(null);
  const { user } = useSelector((state) => state.auth);
  const [userRole, setUserRole] = useState(null);
  const [showAddMemberDialog, setShowAddMemberDialog] = useState(false);
  const [showAddTaskDialog, setShowAddTaskDialog] = useState(false);
  const [showEditProjectDialog, setShowEditProjectDialog] = useState(false);
  const [showMetricsDialog,setShowMetricsDialog]=useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [newMemberRole, setNewMemberRole] = useState("member");
  const [selectedTask, setSelectedTask] = useState(null);
  const [showError, setShowError] = useState(false);
  const [taskDetails, setTaskDetails] = useState({
    title: "",
    description: "",
    status: "to-do",
    priority: "medium",
    assignedTo: [],
    dueDate: "",
  });
  const { updateProject } = useProjects();
  const [showChat, setShowChat] = useState(false);
  const chatRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const navigate=useNavigate();

  useEffect(() => {
    if (projects.length > 0) {
      const foundProject = projects.find((proj) => proj._id === projectId);

      if (foundProject) {
        setProject(foundProject);
        const member = foundProject.members.find(
          (member) => member.userId._id === user.id
        );

        if (member) {
          setUserRole(member.role);
        } else {
          console.error(
            `User with id ${user.id} is not a member of project with id ${projectId}`
          );
        }
      } else {
        console.error(`Project with id ${projectId} not found.`);
      }
    }
  }, [projects, projectId]);

  const handleTaskClick = (task) => {
    setSelectedTask(task);

  };

  const handleCloseDialog = () => {
    
    setSelectedTask(null);
  };

  const handleAddMember = () => {
    setShowAddMemberDialog(true);
  };

  const handleAddMemberSubmit = async (e) => {
    e.preventDefault();
    setShowError(false);
    try {
      const res = await axiosApi.get(`user/detail/${newMemberEmail}`);
      const newMember = res.data.user;

      const res2 = await axiosApi.post(
        `project/mail/${newMemberEmail}`,
        JSON.stringify({ project, role: newMemberRole })
      );
      project.members.push({ userId: newMember, role: newMemberRole });
      await updateProject(project);
      setShowAddMemberDialog(false);
      setNewMemberEmail("");
      setNewMemberRole("member");
    } catch (err) {
      setShowError(true);
      setNewMemberEmail("");
      console.error("Error adding member");
    }
  };

  const handleAddTask = () => {
    setShowAddTaskDialog(true);
  };

  const handleAddTaskSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      const newTask = { ...taskDetails };

      const details = { newTask, project: project.name };

      const res = await axiosApi.post(`project/${project._id}/task`, details);
      const updatedProject = {
        ...project,
        tasks: [...project.tasks, res.data.task],
      };
      
      await updateProject(updatedProject);
      setProject(updatedProject);
      setShowAddTaskDialog(false);
      setTaskDetails({
        title: "",
        description: "",
        status: "to-do",
        priority: "medium",
        assignedTo: [],
        dueDate: "",
      });
      setIsLoading(false);
    } catch (err) {
      console.error("Error adding task:", err);
    }
  };

  const handleChatIconClick = () => {
    setShowChat((prevShowChat) => !prevShowChat);

    if (chatRef.current) {
      chatRef.current.scrollIntoView({ behavior: "smooth" });
    } else {
      console.log(!showChat);
    }
  };
  const handleEditProjectClick = () => {
    setShowEditProjectDialog(true);
  };
  const handleEditProjectSave = async (updatedProjectDetails) => {
    try {
      const updatedProject = {
        ...project,
        name: updatedProjectDetails.name,
        description: updatedProjectDetails.description,
        members: updatedProjectDetails.members,
      };
      await updateProject(updatedProject);
      setProject(updatedProject);
      setShowEditProjectDialog(false);
    } catch (err) {
      console.error("Error updating project:", err);
    }
  };

  const handleSaveTaskDetails = async (updatedTask) => {
    const taskId = updatedTask._id;
    try {
      const res = await axiosApi.put(`task/update/${taskId}`, updatedTask);
    } catch (err) {
      console.error("Error Saving/Updating Task");
    }
    const updatedTasks = project.tasks.map((t) =>
      t._id === updatedTask._id ? updatedTask : t
    );
    const updatedProject = { ...project, tasks: updatedTasks };
    await updateProject(updatedProject);
    setProject(updatedProject);
    setSelectedTask(null);
  };

  const handleTaskRemove = async (taskId) => {
    try {
      const res = await axiosApi.delete(`/task/${taskId}`);
      setProject((prevState) => {
        const updatedProject = {
          ...prevState,
          tasks: prevState.tasks.filter((curr) => curr._id !== taskId),
        };
        updateProject(updatedProject);
      });
    } catch (err) {
      console.error("Error removing task");
    }
  };

  const handleDeleteProjectClick = () => {
    setIsDelete(true);
  };
  const handleDeleteProject=()=>{
    console.log("yes is clicked");

    removeProject(projectId);
    setTimeout(()=>{
      setIsDelete(false);
      navigate('/dashboard');
    },1000);
    
    
  }

  const handleMetricsClick=()=>{
      setShowMetricsDialog(true);
  }

  if (!project) {
    return <p className="text-gray-700">No project selected.</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-lg mt-6 border-2 relative">
      <div className="flex justify-end space-x-4">
        <button
          className="  h-full border-2 p-2 rounded-full hover:bg-gray-200"
          onClick={handleEditProjectClick}
        >
          <img
            src={require("../../static/edit.png")}
            alt="edit"
            className="h-8 w-8"
          ></img>
        </button>
        <button
          className="  h-full border-2 p-2 rounded-full hover:bg-gray-200"
          onClick={handleMetricsClick}
        >
          <img
            src={require("../../static/PeformanceMetric.png")}
            alt="Chat"
            className="h-8 w-8"
          />
        </button>
        <button
          className="  h-full border-2 p-2 rounded-full hover:bg-gray-200"
          onClick={handleChatIconClick}
        >
          <img
            src={require("../../static/chat.png")}
            alt="Chat"
            className="h-8 w-8"
          />
        </button>
        { (userRole=='admin') && <button
          className="  h-full border-2 p-2 rounded-full hover:bg-gray-200"
          onClick={handleDeleteProjectClick}
        >
          <img
            src={require("../../static/delete.png")}
            alt="Delete"
            className="h-8 w-8"
          />
        </button> }
      </div>
      <h2 className="text-4xl font-bold mb-6 text-center text-purple-700">
        {project.name}
      </h2>
      <p className="text-gray-700 mb-6 text-center ">{project.description}</p>
      <div className="mb-8">
        <h3 className="text-2xl font-semibold mb-4 text-blue-700">Members</h3>
        <ul className="list-disc list-inside space-y-2">
          {project.members.length ? (
            project.members.map((member, idx) => (
              <li key={idx} className="text-gray-600 flex items-center">
                <span className="font-medium">{member.userId.name}</span>
                <span className="ml-2 text-gray-500">
                  ({member.userId.email})
                </span>
                <span className="ml-2 bg-yellow-200 text-yellow-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">
                  {member.role}
                </span>
              </li>
            ))
          ) : (
            <p className=" text-2xl">No members are added.</p>
          )}
        </ul>
      </div>
      <div className="mb-8">
        <h3 className="text-2xl font-semibold mb-4 text-green-700">Tasks</h3>
        <ul className="space-y-4">
          {project.tasks.length ? (
            project.tasks.map((task, idx) => (
              <li
                key={idx}
                className="border border-gray-300 rounded-lg p-4 cursor-pointer"
                onClick={() => handleTaskClick(task)}
              >
                <h4 className="font-semibold text-lg mb-2">{task.title}</h4>
                <p className="text-gray-600">{task.description}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm text-gray-500">
                    Priority: {task.priority}
                  </span>
                </div>
              </li>
            ))
          ) : (
            <p className=" text-2xl"> No tasks are assigned.</p>
          )}
        </ul>
      </div>
      {showAddMemberDialog && (
        <AddMemberDialog
          showError={showError}
          handleAddMemberSubmit={handleAddMemberSubmit}
          newMemberEmail={newMemberEmail}
          setNewMemberEmail={setNewMemberEmail}
          newMemberRole={newMemberRole}
          setNewMemberRole={setNewMemberRole}
          setShowAddMemberDialog={setShowAddMemberDialog}
          setShowError={setShowError}
        />
      )}

      {selectedTask && (
        <TaskDetailDialog
          task={selectedTask}
          onClose={handleCloseDialog}
          onSave={handleSaveTaskDetails}
          userRole={userRole}
          handleRemove={handleTaskRemove}
        />
      )}

      {(userRole === "admin" || userRole === "manager") && (
        <div className="flex justify-center mt-4">
          <button
            onClick={handleAddMember}
            className="btn bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 mr-4 rounded"
          >
            Add Member
          </button>
          <button
            onClick={handleAddTask}
            className="btn bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            Add Task
          </button>
        </div>
      )}

      {showAddTaskDialog && (
        <AddTaskDialog
          isLoading={isLoading}
          project={project}
          taskDetails={taskDetails}
          setTaskDetails={setTaskDetails}
          setShowAddTaskDialog={setShowAddTaskDialog}
          handleAddTaskSubmit={handleAddTaskSubmit}
        />
      )}

      {showEditProjectDialog && (
        <EditProjectDialog
          project={project}
          onClose={() => setShowEditProjectDialog(false)}
          onSave={handleEditProjectSave}
        />
      )}
        {showMetricsDialog && (
        <MetricsDialog  project={project}
        setShowMetricsDialog={setShowMetricsDialog}
        />
      )}

      <div ref={chatRef} className="mt-4">
        {" "}
        <Chat projectID={projectId} />
      </div>

      {isDelete && <div className="fixed inset-0 flex items-center justify-center z-50 bg-slate-50 bg-opacity-40 ">
        <div className="bg-white p-6 rounded shadow-lg">
          <p className="text-xl font-bold mb-4">
            Are you sure to delete project?
          </p>
          <div className="flex justify-center space-x-4">
            <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleDeleteProject}>
              Yes
            </button>
            <button className="bg-red-400 text-white px-4 py-2 rounded" onClick={()=>(setIsDelete(false))}>
              No
            </button>
          </div>
        </div>
      </div>}
    </div>
  );
};

export default ProjectDetail;
