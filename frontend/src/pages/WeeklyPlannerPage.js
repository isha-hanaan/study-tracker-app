import React, { useState, useContext, useEffect } from 'react';
import { StudyContext } from '../context/StudyContext';
import TaskTrackerPanel from '../components/TaskTrackerPanel';
import '../styles/planner.css';

export default function WeeklyPlannerPage() {
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState(
    new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
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
    loading
  } = useContext(StudyContext);

  useEffect(() => {
    getPlans();
  }, [getPlans]);

  useEffect(() => {
    const found = plans.find(p => {
      const start = new Date(p.weekStartDate).toISOString().split('T')[0];
      const end = new Date(p.weekEndDate).toISOString().split('T')[0];
      return startDate >= start && startDate <= end;
    });

    setCurrentPlan(found || null);
  }, [startDate, plans]);

  const handleCreatePlan = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    setSuccessMsg(null);

    const subjectList = subjects.split(',').map(s => s.trim()).filter(Boolean);
    const goalList = goals.split(',').map(g => g.trim()).filter(Boolean);

    if (!subjectList.length) {
      setSubmitError('Please enter at least one subject');
      return;
    }

    if (!goalList.length) {
      setSubmitError('Please enter at least one goal');
      return;
    }

    try {
      await createPlan({
        weekStartDate: startDate,
        weekEndDate: endDate,
        subjects: subjectList,
        goals: goalList,
        title: title ? title.trim() : undefined
      });

      setTitle('');
      setSubjects('');
      setGoals('');
      setSuccessMsg('Plan created!');

      await getPlans();
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to create plan';
      setSubmitError(errorMessage);
    }
  };

  return (
    <div className="container">
      <h1>📅 Weekly Planner</h1>

      {submitError && <p style={{ color: 'red' }}>{submitError}</p>}
      {successMsg && <p style={{ color: 'green' }}>{successMsg}</p>}

      <div className="planner-section">

        {/* LEFT */}
        <div className="plan-form">
          <h2>Create Plan</h2>

          <form onSubmit={handleCreatePlan}>
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />

            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />

            <input
              type="text"
              placeholder="Subjects (comma separated)"
              value={subjects}
              onChange={(e) => setSubjects(e.target.value)}
            />

            <input
              type="text"
              placeholder="Goals"
              value={goals}
              onChange={(e) => setGoals(e.target.value)}
            />

            <button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Plan'}
            </button>
          </form>
        </div>

        {/* RIGHT */}
        <div className="plan-info">
          <h3>Current Plan</h3>

          {currentPlan ? (
            <>
              {currentPlan.title && <p><strong>{currentPlan.title}</strong></p>}
              <p>
                {new Date(currentPlan.weekStartDate).toLocaleDateString()} - {new Date(currentPlan.weekEndDate).toLocaleDateString()}
              </p>

              <TaskTrackerPanel planId={currentPlan._id} />
            </>
          ) : (
            <p>No plan found</p>
          )}
        </div>

      </div>
    </div>
  );
}