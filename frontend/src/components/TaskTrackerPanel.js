import React, { useState, useEffect, useContext } from 'react';
import { StudyContext } from '../context/StudyContext';
import '../styles/tasktracker.css';

export default function TaskTrackerPanel({ planId }) {
  const [newTask, setNewTask] = useState({
    subject: '',
    description: '',
    deadline: '',
    priority: 'medium'
  });
  const [planTasks, setPlanTasks] = useState([]);
  const {
    createTask,
    updateTask,
    deleteTask,
    getPlanTasks,
    loading
  } = useContext(StudyContext);

  useEffect(() => {
    if (planId) {
      fetchTasks();
    }
  }, [planId]);

  const fetchTasks = async () => {
    try {
      const tasks = await getPlanTasks(planId);
      setPlanTasks(tasks);
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.subject || !newTask.deadline) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      await createTask(planId, newTask);
      setNewTask({
        subject: '',
        description: '',
        deadline: '',
        priority: 'medium'
      });
      await fetchTasks();
    } catch (err) {
      console.error('Failed to create task:', err);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await updateTask(taskId, { status: newStatus });
      await fetchTasks();
    } catch (err) {
      console.error('Failed to update task:', err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(taskId);
        await fetchTasks();
      } catch (err) {
        console.error('Failed to delete task:', err);
      }
    }
  };

  return (
    <div className="task-tracker">
      <h3>Tasks</h3>

      <form onSubmit={handleAddTask} className="task-form">
        <input
          type="text"
          placeholder="Subject"
          value={newTask.subject}
          onChange={(e) =>
            setNewTask({ ...newTask, subject: e.target.value })
          }
          required
          disabled={loading}
        />
        <input
          type="text"
          placeholder="Description"
          value={newTask.description}
          onChange={(e) =>
            setNewTask({ ...newTask, description: e.target.value })
          }
          disabled={loading}
        />
        <input
          type="datetime-local"
          value={newTask.deadline}
          onChange={(e) =>
            setNewTask({ ...newTask, deadline: e.target.value })
          }
          required
          disabled={loading}
        />
        <select
          value={newTask.priority}
          onChange={(e) =>
            setNewTask({ ...newTask, priority: e.target.value })
          }
          disabled={loading}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <button type="submit" className="btn btn-small" disabled={loading}>
          Add Task
        </button>
      </form>

      <div className="tasks-list">
        {planTasks.map(task => (
          <div key={task._id} className={`task-item task-${task.priority}`}>
            <div className="task-content">
              <h4>{task.subject}</h4>
              {task.description && <p>{task.description}</p>}
              <p className="task-deadline">
                Deadline: {new Date(task.deadline).toLocaleString()}
              </p>
            </div>

            <div className="task-controls">
              <select
                value={task.status}
                onChange={(e) => handleStatusChange(task._id, e.target.value)}
                disabled={loading}
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
              <button
                onClick={() => handleDeleteTask(task._id)}
                className="btn-delete"
                disabled={loading}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
