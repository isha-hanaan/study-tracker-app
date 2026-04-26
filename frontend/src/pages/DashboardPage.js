import React, { useEffect, useContext } from 'react';
import { StudyContext } from '../context/StudyContext';
import '../styles/dashboard.css';

export default function DashboardPage() {
  const { progressStats, getProgressStats, loading } = useContext(StudyContext);

  useEffect(() => {
    getProgressStats();
  }, [getProgressStats]);

  if (loading) return <div className="loading">Loading...</div>;

  if (!progressStats) {
    return <div className="container"><p>No data available</p></div>;
  }

  return (
    <div className="container">
      <h1>Dashboard</h1>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Tasks</h3>
          <p className="stat-number">{progressStats.total}</p>
        </div>

        <div className="stat-card">
          <h3>Completed</h3>
          <p className="stat-number">{progressStats.completed}</p>
        </div>

        <div className="stat-card">
          <h3>In Progress</h3>
          <p className="stat-number">{progressStats.inProgress}</p>
        </div>

        <div className="stat-card">
          <h3>Pending</h3>
          <p className="stat-number">{progressStats.pending}</p>
        </div>

        <div className="stat-card wide">
          <h3>Completion Rate</h3>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${progressStats.completionRate}%` }}
            ></div>
          </div>
          <p>{progressStats.completionRate}%</p>
        </div>
      </div>

      <div className="priority-section">
        <h2>Tasks by Priority</h2>
        <div className="priority-grid">
          {['high', 'medium', 'low'].map(priority => (
            <div key={priority} className={`priority-card priority-${priority}`}>
              <h3>{priority.charAt(0).toUpperCase() + priority.slice(1)}</h3>
              <p>
                {progressStats.byPriority[priority].completed} /{' '}
                {progressStats.byPriority[priority].total}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="subject-section">
        <h2>Tasks by Subject</h2>
        <div className="subject-list">
          {Object.entries(progressStats.bySubject).map(([subject, data]) => (
            <div key={subject} className="subject-item">
              <h4>{subject}</h4>
              <p>
                {data.completed} / {data.total} completed
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
