import React, { useState, useContext, useEffect } from 'react';
import { StudyContext } from '../context/StudyContext';
import ProgressChart from '../components/ProgressChart';
import '../styles/progress.css';

export default function ProgressReportPage() {
  const [timeRange, setTimeRange] = useState(30);
  const {
    progressStats,
    subjectAnalytics,
    trendData,
    getProgressStats,
    getSubjectAnalytics,
    getTrendData,
    loading
  } = useContext(StudyContext);

  useEffect(() => {
    getProgressStats();
    getSubjectAnalytics();
    getTrendData(timeRange);
  }, [timeRange]);

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="container">
      <h1>Progress Report</h1>

      <div className="time-range-selector">
        <button
          className={timeRange === 7 ? 'active' : ''}
          onClick={() => setTimeRange(7)}
        >
          Last 7 Days
        </button>
        <button
          className={timeRange === 30 ? 'active' : ''}
          onClick={() => setTimeRange(30)}
        >
          Last 30 Days
        </button>
        <button
          className={timeRange === 90 ? 'active' : ''}
          onClick={() => setTimeRange(90)}
        >
          Last 90 Days
        </button>
      </div>

      {progressStats && (
        <div className="report-section">
          <h2>Overall Statistics</h2>
          <div className="stats-grid">
            <div className="stat-box">
              <h3>Completion Rate</h3>
              <p className="big-number">{progressStats.completionRate}%</p>
            </div>
            <div className="stat-box">
              <h3>Tasks Completed</h3>
              <p className="big-number">{progressStats.completed}</p>
            </div>
            <div className="stat-box">
              <h3>Tasks Pending</h3>
              <p className="big-number">{progressStats.pending}</p>
            </div>
            <div className="stat-box">
              <h3>Tasks in Progress</h3>
              <p className="big-number">{progressStats.inProgress}</p>
            </div>
          </div>
        </div>
      )}

      {trendData && trendData.length > 0 && (
        <div className="report-section">
          <h2>Completion Trend</h2>
          <ProgressChart data={trendData} />
        </div>
      )}

      {subjectAnalytics && subjectAnalytics.length > 0 && (
        <div className="report-section">
          <h2>Subject-wise Performance</h2>
          <div className="subject-analytics">
            {subjectAnalytics.map((subject, idx) => (
              <div key={idx} className="subject-card">
                <h3>{subject.name}</h3>
                <p>Completed: {subject.completed} / {subject.total}</p>
                <div className="priority-breakdown">
                  <span>High: {subject.byPriority.high}</span>
                  <span>Medium: {subject.byPriority.medium}</span>
                  <span>Low: {subject.byPriority.low}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
