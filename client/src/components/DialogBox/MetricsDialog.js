import React from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

// Register the components with ChartJS
ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const MetricsDialog = ({ project, setShowMetricsDialog }) => {
  // Prepare data for the pie chart
  const taskStatuses = project.tasks.reduce(
    (acc, task) => {
      acc[task.status] += 1;
      return acc;
    },
    { 'to-do': 0, 'in-progress': 0, 'completed': 0 }
  );

  // Calculate overdue tasks
  const overdueTasks = project.tasks.filter(task => {
    return task.status !== 'completed' && task.dueDate && new Date(task.dueDate) < Date.now();
  });

  const overdueRate = (overdueTasks.length / project.tasks.length) * 100;

  // Calculate average task duration
  const completedTasks = project.tasks.filter(task => task.status === 'completed');
  const averageDuration = completedTasks.reduce((total, task) => {
    const duration = (new Date(task.completedDate) - new Date(task.creationDate)) / (1000 * 60 * 60 * 24); // duration in days
    return total + duration;
  }, 0) / completedTasks.length;

  // Calculate project progress
  const projectProgress = (completedTasks.length / project.tasks.length) * 100;

  // Data for Pie chart (Task Completion)
  const pieData = {
    labels: ['To-do', 'In-progress', 'Completed'],
    datasets: [
      {
        label: '# of Tasks',
        data: [taskStatuses['to-do'], taskStatuses['in-progress'], taskStatuses['completed']],
        backgroundColor: ['#FF6384', '#36A2EB', '#4CAF50'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#4CAF50'],
      },
    ],
  };

  // Data for Bar chart (Task Overdue Rate)
  const barData = {
    labels: ['Overdue Tasks'],
    datasets: [
      {
        label: 'Overdue Rate (%)',
        data: [overdueRate.toFixed(2)], // Keep only two decimal points
        backgroundColor: '#FF9F40',
        hoverBackgroundColor: '#FF9F40',
      },
    ],
  };

  // Data for Bar chart (Average Task Duration)
  const durationData = {
    labels: ['Average Duration'],
    datasets: [
      {
        label: 'Average Task Duration (Days)',
        data: [averageDuration.toFixed(2)], // Keep only two decimal points
        backgroundColor: '#4BC0C0',
        hoverBackgroundColor: '#4BC0C0',
      },
    ],
  };

  // Data for Pie chart (Project Progress)
  const progressData = {
    labels: ['Progress', 'Remaining'],
    datasets: [
      {
        label: 'Project Progress',
        data: [projectProgress.toFixed(2), (100 - projectProgress).toFixed(2)],
        backgroundColor: ['#4BC0C0', '#E7E9ED'],
        hoverBackgroundColor: ['#4BC0C0', '#E7E9ED'],
      },
    ],
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg max-w-lg w-full max-h-[90vh] flex flex-col">
        <div className="flex-grow overflow-y-auto">
          <h3 className="text-2xl font-semibold mb-6">Project Metrics</h3>

          <div className="mb-6">
            <h4 className="text-xl font-medium text-gray-700 mb-2">Project Name:</h4>
            <p className="text-gray-600">{project.name}</p>
          </div>

          <div className="mb-6">
            <h4 className="text-xl font-medium text-gray-700 mb-2">Description:</h4>
            <p className="text-gray-600">{project.description}</p>
          </div>

          <div className="mb-6">
            <h4 className="text-xl font-medium text-gray-700 mb-2">Task Completion:</h4>
            <div className="h-64">
              <Pie data={pieData} />
            </div>
          </div>

          <div className="mb-6 border-t border-gray-200 pt-4">
            <h4 className="text-xl font-medium text-gray-700 mb-2">Task Overdue Rate:</h4>
            <div className="h-64">
              <Bar data={barData} />
            </div>
          </div>

          <div className="mb-6 border-t border-gray-200 pt-4">
            <h4 className="text-xl font-medium text-gray-700 mb-2">Average Task Duration:</h4>
            <div className="h-64">
              <Bar data={durationData} />
            </div>
          </div>

          <div className="mb-6 border-t border-gray-200 pt-4">
            <h4 className="text-xl font-medium text-gray-700 mb-2">Project Progress:</h4>
            <div className="h-64">
              <Pie data={progressData} />
            </div>
          </div>
        </div>

        <div className="flex justify-end p-4 border-t border-gray-200">
          <button
            onClick={() => setShowMetricsDialog(false)}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default MetricsDialog;
