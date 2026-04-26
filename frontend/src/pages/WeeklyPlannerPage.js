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
  const [submitError, setSubmitError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const {
    plans,
    createPlan,
    getPlans,
    loading,
    error
  } = useContext(StudyContext);

  // Load plans on component mount
  useEffect(() => {
    getPlans();
  }, [getPlans]);

  // Find current plan when weekStartDate or plans change
  useEffect(() => {
    const findPlan = plans.find(p => {
      const start = new Date(p.weekStartDate).toISOString().split('T')[0];
      const end = new Date(p.weekEndDate).toISOString().split('T')[0];
      return weekStartDate >= start && weekStartDate <= end;
    });

    if (findPlan) {
      setCurrentPlan(findPlan);
    } else {
      setCurrentPlan(null);
    }
  }, [weekStartDate, plans]);

  const handleCreatePlan = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    setSuccessMsg(null);

    const subjectList = subjects.split(',').map(s => s.trim()).filter(s => s);
    const goalList = goals.split(',').map(g => g.trim()).filter(g => g);

    if (!subjectList.length) {
      setSubmitError('Please enter at least one subject');
      return;
    }

    try {
      const newPlan = await createPlan(weekStartDate, subjectList, goalList);
      console.log('Plan created:', newPlan);
      setSubjects('');
      setGoals('');
      setSuccessMsg('Plan created successfully!');
      
      // Refresh plans to ensure we have latest
      await getPlans();
      
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to create plan';
      console.error('Failed to create plan:', err);
      setSubmitError(errorMsg);
    }
  };

  return (
    <div className="container">
      <h1>Weekly Planner</h1>

      <div className="planner-section">
        {submitError && <div className="error-message" style={{color: 'red', padding: '10px', marginBottom: '10px'}}>{submitError}</div>}
        {successMsg && <div className="success-message" style={{color: 'green', padding: '10px', marginBottom: '10px'}}>{successMsg}</div>}
        {error && <div className="error-message" style={{color: 'red', padding: '10px', marginBottom: '10px'}}>{error}</div>}
        
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