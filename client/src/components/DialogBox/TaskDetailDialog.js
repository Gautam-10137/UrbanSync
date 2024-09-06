import React, { useEffect, useState } from 'react';
import axiosApi from '../../axios/api';
import { useSelector } from 'react-redux';
import { useProjects } from '../../context/ProjectContext';

const TaskDetailDialog = ({ task, onClose, onSave, userRole ,handleRemove,members}) => {
  const [isEditing, setIsEditing] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const [taskMembers,setTaskMembers]=useState([]);

  const formatDate = (date) => {
    if (!date) return ''; 
    return new Date(date).toISOString().split('T')[0];
  };  

  const [editedTask, setEditedTask] = useState({
    title: task.title,
    description: task.description,
    priority: task.priority,
    status: task.status,
    assignedTo: task.assignedTo,
    assignedDate: formatDate(task.assignedDate),  // Format the date
    dueDate: formatDate(task.dueDate),   
    comments: task.comments,
    _id: task._id
 
  });

  useEffect(() => {
    if (Array.isArray(task.assignedTo) && Array.isArray(members)) {
      const userDetailsMap = members.reduce((acc, member) => {
        acc[member.userId._id] = member.userId;
        return acc;
      }, {});
      const assignedDetails = task.assignedTo.map((userId) => userDetailsMap[userId]).filter(Boolean);
      setTaskMembers(assignedDetails);
    }
    else{
      setTaskMembers(task.assignedTo);
    }
  }, [task.assignedTo, members]);

  const { fetchProjects,updateTaskInProject } = useProjects();
  const [isAddComment, setIsAddComment] = useState(false);
  const [newComment, setNewComment] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedTask((prevTask) => ({
      ...prevTask,
      [name]: value,
    }));
  };

  const handleSave = () => {
    onSave(editedTask);
    setIsEditing(false);
  };

  const handleAddCommentClick = () => {
    setIsAddComment(true);
  };
  console.log(task);
  const handleAddComment = async () => {
    try {
      const comment = { author: user.id, content: newComment };
      const res = await axiosApi.post(`task/${task._id}/comment`, comment, {
        headers: { 'Content-Type': 'application/json' },
      });
    

      const updatedTask = {
        ...editedTask,
        comments: [...editedTask.comments, res.data.newComment],
      };
  
      setEditedTask(updatedTask);
  
      updateTaskInProject(updatedTask);
  
      onSave(updatedTask);
      setIsAddComment(false);
      setNewComment('');
 
    } catch (err) {
      console.error('Error adding comment:', err.message);
    }
  };

  const handleRemoveTask=()=>{
        handleRemove(task._id);
        onClose();
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded shadow-lg max-w-md max-h-full overflow-y-auto">
        {isEditing ? (
          <>
            <h3 className="text-2xl font-semibold mb-4">Edit Task</h3>
            <label className="block mb-2">
              Title:
              <input
                type="text"
                name="title"
                value={editedTask.title}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </label>
            <label className="block mb-2">
              Description:
              <textarea
                name="description"
                value={editedTask.description}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </label>
            <label className="block mb-2">
              Priority:
              <select
                name="priority"
                value={editedTask.priority}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </label>
            <label className="block mb-2">
              Status:
              <select
                name="status"
                value={editedTask.status}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="to-do">To-do</option>
                <option value="in-progress">In-progress</option>
                <option value="done">Done</option>
              </select>
            </label>
            <label className="block mb-2">
              Assigned Date:
              <input
                type="date"
                name="assignedDate"
                value={editedTask.assignedDate}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </label>
            <label className="block mb-2">
              Due Date:
              <input
                type="date"
                name="dueDate"
                value={editedTask.dueDate}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </label>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsEditing(false)}
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
          </>
        ) : (
          <>
            <h3 className="text-2xl font-semibold mb-4">{task.title}</h3>
            <p className="text-gray-700 mb-2">
              <strong>Description:</strong>
            </p>
            <p className="text-gray-600 mb-4">{task.description}</p>
            <p className="text-gray-700 mb-2">
              <strong>Priority:</strong> {task.priority}
            </p>
            <p className="text-gray-700 mb-2">
              <strong>Status:</strong> {task.status}
            </p>
            <p className="text-gray-700 mb-2">
              <strong>Assigned To:</strong>
            </p>
            <ul className="list-disc list-inside mb-2">
              {taskMembers.map((user, index) => (
                <li key={index} className="text-gray-600">
                  {user.name} ({user.email})
                </li>
              ))}
            </ul>
            <p className="text-gray-700 mb-2">
              <strong>Assigned Date:</strong> {task.assignedDate}
            </p>
            <p className="text-gray-700 mb-2">
              <strong>Due Date:</strong> {task.dueDate}
            </p>
            <div>
              <p className="text-gray-700 mb-2">
                <strong>Comments:</strong>
              </p>
              <div className="max-h-40 overflow-y-auto mb-2">
                <ul className="space-y-2">
                  {editedTask.comments && editedTask.comments.length > 0 ? (
                    editedTask.comments.map((comment, idx) => (
                      <li
                        key={idx}
                        className="text-gray-700 bg-gray-100 p-2 rounded shadow-sm"
                      >
                        <strong>{comment.author.name}:</strong> {comment.content}
                      </li>
                    ))
                  ) : (
                    <p className="text-gray-500">No comments yet.</p>
                  )}
                </ul>
              </div>
              {isAddComment && (
                <div className="mt-4">
                  <label className="block mb-2">
                    New Comment:
                    <textarea
                      name="newComment"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </label>
                  <button
                    className="mt-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    onClick={handleAddComment}
                  >
                    Add
                  </button>
                </div>
              )}
              {!isAddComment && (
                <button
                  onClick={handleAddCommentClick}
                  className="mt-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Add Comment
                </button>
              )}
            </div>
            <div className="flex justify-end space-x-4 mt-4">
            {(userRole === 'admin' || userRole === 'manager') && (
                
                <button
                  onClick={handleRemoveTask}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Remove
                </button>
              )}
              {(userRole === 'admin' || userRole === 'manager') && (
                
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Edit
                </button>
              )}
              <button
                onClick={onClose}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Close
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TaskDetailDialog;
