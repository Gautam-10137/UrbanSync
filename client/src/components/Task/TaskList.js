import React, { useEffect, useState } from "react";
import axiosApi from "../../axios/api";
import { useSelector } from "react-redux";
import TaskDetailDialog from "../DialogBox/TaskDetailDialog";
import { loadUser } from "../../redux/authSlice";
import { useProjects } from "../../context/ProjectContext";

const TaskList = () => {
  const {fetchTask}=useProjects();
  const { user } = useSelector((state) => state.auth);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);

  const fetchAssignedTasks = async () => {
      try {
        const res = await axiosApi.get(`/task/assigned-to/${user.id}`);
        setTasks(res.data.tasks);
        
      } catch (err) {
        setError("Error fetching tasks");
      } finally {
        setLoading(false);
      }
    };
    useEffect(() => {
        fetchAssignedTasks();
      
    }, []);
     
  useEffect(() => {
    if(fetchTask){
      fetchAssignedTasks();
    }
    
  }, [fetchTask]);
  
 useEffect(()=>{
  
 },[tasks]);

  const handleTaskClick = (task) => {
    setSelectedTask(task);
  };

  const handleCloseDialog = () => {
    setSelectedTask(null);
  };

  const handleStatusChange = async (taskId, newStatus,event) => {
    event.stopPropagation();
    try {
      const res = await axiosApi.put(`/task/${taskId}/status`, { status: newStatus });
      setTasks(tasks.map(task => task._id === taskId ? { ...task, status: newStatus } : task));
      
    } catch (err) {
      console.error('Error updating task status', err);
      setError('Error updating task status');
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-700 text-xl">Loading...</div>
      </div>
    );
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div className="p-6 bg-gray-200 min-h-screen">
      <h2 className="text-3xl text-green-500 font-bold mb-6 text-center">Assigned Tasks</h2>
      {tasks.length > 0 ? (
        <ul className="space-y-4">
          {tasks.map((task) => (
            <li
              key={task._id}
              className="border border-gray-300 rounded-lg p-4 shadow-md bg-white"
              onClick={() => handleTaskClick(task)}
            >
              <h4 className="font-semibold text-xl mb-2 text-blue-600">
                {task.title}
              </h4>
              <p className="text-gray-600 mb-2">{task.description}</p>
              <p className="text-gray-700 mb-1">
                <strong>Project:</strong> {task.projectId.name}
              </p>
              <p className="text-gray-700 mb-1">
                <strong>Priority:</strong>{" "}
                <span
                  className={`inline-block px-2 py-1 rounded ${
                    task.priority === "high"
                      ? "bg-red-500 text-white"
                      : task.priority === "medium"
                      ? "bg-yellow-500 text-white"
                      : "bg-green-500 text-white"
                  }`}
                >
                  {task.priority}
                </span>
              </p>
              <p className="text-gray-700 mb-1">
                <strong>Status:</strong>
                <select
                  value={task.status}
                  onChange={(e) => handleStatusChange(task._id, e.target.value,e)}
                  className="ml-2 border border-gray-300 rounded-md p-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  <option value="to-do">To-do</option>
                  <option value="in-progress">In-progress</option>
                  <option value="completed">Completed</option>
                </select>
              </p>
              <p className="text-gray-700 mb-1">
                <strong>Assigned Date:</strong>{" "}
                {new Date(task.assignedDate).toLocaleDateString()}
              </p>
              <p className="text-gray-700 mb-1">
                <strong>Due Date:</strong>{" "}
                {new Date(task.dueDate).toLocaleDateString()}
              </p>
              
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center text-gray-700 mt-6">
          No tasks assigned to you.  
        </div>
      )}
      {selectedTask && (
        <TaskDetailDialog task={selectedTask} onClose={handleCloseDialog} />
      )}
    </div>
  );
};

export default TaskList;
