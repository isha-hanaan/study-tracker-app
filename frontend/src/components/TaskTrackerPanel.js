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
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

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
      setError(null);
      const tasks = await getPlanTasks(planId);
      setPlanTasks(tasks || []);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to fetch tasks';
      console.error('Failed to fetch tasks:', err);
      setError(msg);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.subject || !newTask.deadline) {
      setError('Subject and deadline are required');
      return;
    }

    try {
      setError(null);
      await createTask(planId, newTask);
      setNewTask({
        subject: '',
        description: '',
        deadline: '',
        priority: 'medium'
      });
      setSuccessMsg('Task added successfully!');
      setTimeout(() => setSuccessMsg(null), 2000);
      await fetchTasks();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create task';
      console.error('Failed to create task:', err);
      setError(msg);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      setError(null);
      await updateTask(taskId, { status: newStatus });
      setSuccessMsg('Task updated!');
      setTimeout(() => setSuccessMsg(null), 2000);
      await fetchTasks();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update task';
      console.error('Failed to update task:', err);
      setError(msg);
    }
  };

  const startEdit = (task) => {
    setEditingId(task._id);
    setEditData({
      subject: task.subject,
      description: task.description,
      deadline: task.deadline,
      priority: task.priority
    });
    setError(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  const handleSaveEdit = async (taskId) => {
    if (!editData.subject || !editData.deadline) {
      setError('Subject and deadline are required');
      return;
    }

    try {
      setError(null);
      await updateTask(taskId, editData);
      setEditingId(null);
      setEditData({});
      setSuccessMsg('Task updated successfully!');
      setTimeout(() => setSuccessMsg(null), 2000);
      await fetchTasks();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update task';
      console.error('Failed to update task:', err);
      setError(msg);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        setError(null);
        await deleteTask(taskId);
        setSuccessMsg('Task deleted successfully!');
        setTimeout(() => setSuccessMsg(null), 2000);
        await fetchTasks();
      } catch (err) {
        const msg = err.response?.data?.message || 'Failed to delete task';
        console.error('Failed to delete task:', err);
        setError(msg);
      }
    }
  };

  return (
    <div className="task-tracker">
      <h3>Tasks for this Week</h3>

      {error && <div className="alert alert-error" style={{ marginBottom: '10px', padding: '10px', color: 'red', backgroundColor: '#fee' }}>{error}</div>}
      {successMsg && <div className="alert alert-success" style={{ marginBottom: '10px', padding: '10px', color: 'green', backgroundColor: '#efe' }}>{successMsg}</div>}

      <form onSubmit={handleAddTask} className="task-form" style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '5px' }}>
        <h4>Add New Task</h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
          <input
            type="text"
            placeholder="Subject *"
            value={newTask.subject}
            onChange={(e) =>
              setNewTask({ ...newTask, subject: e.target.value })
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
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
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
        </div>
        <button type="submit" className="btn btn-small" disabled={loading} style={{ backgroundColor: '#28a745', color: 'white', padding: '8px 15px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          {loading ? 'Adding...' : '+ Add Task'}
        </button>
      </form>

      <div className="tasks-list">
        {planTasks.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#999', padding: '20px' }}>No tasks yet. Add one to get started!</p>
        ) : (
          planTasks.map(task => (
            <div key={task._id} className={`task-item task-${task.priority}`} style={{ marginBottom: '10px', padding: '15px', border: '1px solid #e0e0e0', borderRadius: '5px', backgroundColor: '#fafafa' }}>
              {editingId === task._id ? (
                // Edit mode
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <input
                    type="text"
                    value={editData.subject}
                    onChange={(e) =>
                      setEditData({ ...editData, subject: e.target.value })
                    }
                    placeholder="Subject"
                    style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                  />
                  <input
                    type="text"
                    value={editData.description}
                    onChange={(e) =>
                      setEditData({ ...editData, description: e.target.value })
                    }
                    placeholder="Description"
                    style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                  />
                  <input
                    type="datetime-local"
                    value={editData.deadline}
                    onChange={(e) =>
                      setEditData({ ...editData, deadline: e.target.value })
                    }
                    style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                  />
                  <select
                    value={editData.priority}
                    onChange={(e) =>
                      setEditData({ ...editData, priority: e.target.value })
                    }
                    style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                  <div style={{ display: 'flex', gap: '5px' }}>
                    <button
                      onClick={() => handleSaveEdit(task._id)}
                      style={{ flex: 1, padding: '8px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                      disabled={loading}
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEdit}
                      style={{ flex: 1, padding: '8px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                      disabled={loading}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                // View mode
                <>
                  <div className="task-content">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                      <div>
                        <h4 style={{ margin: '0 0 5px 0' }}>{task.subject}</h4>
                        <span style={{ display: 'inline-block', padding: '3px 8px', borderRadius: '3px', fontSize: '12px', fontWeight: 'bold', backgroundColor: task.priority === 'high' ? '#ffcccc' : task.priority === 'medium' ? '#fff4cc' : '#ccf', color: '#333' }}>
                          {task.priority.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    {task.description && <p style={{ margin: '5px 0', color: '#666' }}>{task.description}</p>}
                    <p style={{ margin: '8px 0', fontSize: '13px', color: '#666' }}>
                      📅 {new Date(task.deadline).toLocaleString()}
                    </p>
                  </div>

                  <div className="task-controls" style={{ display: 'flex', gap: '8px', marginTop: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <select
                      value={task.status}
                      onChange={(e) => handleStatusChange(task._id, e.target.value)}
                      disabled={loading}
                      style={{ padding: '6px 10px', border: '1px solid #ccc', borderRadius: '4px', backgroundColor: task.status === 'completed' ? '#d4edda' : task.status === 'in-progress' ? '#fff3cd' : '#e7e7e7' }}
                    >
                      <option value="pending">⏳ Pending</option>
                      <option value="in-progress">🔄 In Progress</option>
                      <option value="completed">✅ Completed</option>
                    </select>
                    <button
                      onClick={() => startEdit(task)}
                      style={{ padding: '6px 12px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                      disabled={loading}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDeleteTask(task._id)}
                      style={{ padding: '6px 12px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                      disabled={loading}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
