import React, { useState, useContext, useEffect } from 'react';
import { StudyContext } from '../context/StudyContext';
import TaskTrackerPanel from '../components/TaskTrackerPanel';
import '../styles/planner.css';

export default function WeeklyPlannerPage() {
  const [weekStartDate, setWeekStartDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [subjects, setSubjects] = useState('');
  const [goals, setGoals] = useState('');
  const [currentPlan, setCurrentPlan] = useState(null);

  const {
    plans,
    createPlan,
    getTasks,
    loading
  } = useContext(StudyContext);

  useEffect(() => {
    const findPlan = plans.find(p => {
      const start = new Date(p.weekStartDate).toISOString().split('T')[0];
      const end = new Date(p.weekEndDate).toISOString().split('T')[0];
      return weekStartDate >= start && weekStartDate <= end;
    });

    if (findPlan) {
      setCurrentPlan(findPlan);
    }
  }, [weekStartDate, plans]);

  const handleCreatePlan = async (e) => {
    e.preventDefault();

    const subjectList = subjects.split(',').map(s => s.trim()).filter(s => s);
    const goalList = goals.split(',').map(g => g.trim()).filter(g => g);

    try {
      await createPlan(weekStartDate, subjectList, goalList);
      setSubjects('');
      setGoals('');
    } catch (err) {
      console.error('Failed to create plan:', err);
    }
  };

  return (
    <div className="container">
      <h1>Weekly Planner</h1>

      <div className="planner-section">
        <div className="plan-form">
          <h2>Create Week Plan</h2>
          <form onSubmit={handleCreatePlan}>
            <div className="form-group">
              <label htmlFor="weekStart">Week Starting</label>
              <input
                id="weekStart"
                type="date"
                value={weekStartDate}
                onChange={(e) => setWeekStartDate(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="subjects">Subjects (comma-separated)</label>
              <input
                id="subjects"
                type="text"
                placeholder="Math, Physics, English"
                value={subjects}
                onChange={(e) => setSubjects(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="goals">Goals (comma-separated)</label>
              <input
                id="goals"
                type="text"
                placeholder="Complete Chapter 5, Practice problems"
                value={goals}
                onChange={(e) => setGoals(e.target.value)}
                disabled={loading}
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Creating...' : 'Create Plan'}
            </button>
          </form>
        </div>

        {currentPlan && (
          <div className="plan-info">
            <h3>Current Plan</h3>
            <p>
              <strong>Week:</strong>{' '}
              {new Date(currentPlan.weekStartDate).toLocaleDateString()} -{' '}
              {new Date(currentPlan.weekEndDate).toLocaleDateString()}
            </p>
            <div>
              <strong>Subjects:</strong>
              <ul>
                {currentPlan.subjects.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
            <div>
              <strong>Goals:</strong>
              <ul>
                {currentPlan.goals.map((g, i) => (
                  <li key={i}>{g}</li>
                ))}
              </ul>
            </div>

            <TaskTrackerPanel planId={currentPlan._id} />
          </div>
        )}
      </div>
    </div>
  );
}