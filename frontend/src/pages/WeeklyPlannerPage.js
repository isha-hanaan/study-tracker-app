import React, { useState, useContext, useEffect } from 'react';
import { StudyContext } from '../context/StudyContext';
import TaskTrackerPanel from '../components/TaskTrackerPanel';
import '../styles/planner.css';

export default function WeeklyPlannerPage() {
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState(
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

  // 🔥 auto calculate end date (7 days)
  const calculateEndDate = (start) => {
    const date = new Date(start);
    date.setDate(date.getDate() + 6);
    return date.toISOString().split('T')[0];
  };

  useEffect(() => {
    const findPlan = plans.find(p => {
      const start = new Date(p.startDate).toISOString().split('T')[0];
      const end = new Date(p.endDate).toISOString().split('T')[0];
      return startDate >= start && startDate <= end;
    });

    if (findPlan) {
      setCurrentPlan(findPlan);
    }
  }, [startDate, plans]);

  const handleCreatePlan = async (e) => {
    e.preventDefault();

    const subjectList = subjects.split(',').map(s => s.trim()).filter(Boolean);
    const goalList = goals.split(',').map(g => g.trim()).filter(Boolean);

    const planData = {
      title,
      startDate,
      endDate: calculateEndDate(startDate),
      subjects: subjectList,
      goals: goalList
    };

    console.log('Sending:', planData);

    try {
      await createPlan(planData);
      getTasks();
      setTitle('');
      setSubjects('');
      setGoals('');
    } catch (err) {
      console.error('Failed to create plan:', err.response?.data);
    }
  };

  return (
    <div className="container">
      <h1>Weekly Planner</h1>

      <div className="planner-section">
        <div className="plan-form">
          <h2>Create Week Plan</h2>

          <form onSubmit={handleCreatePlan}>
            {/* 🔥 TITLE */}
            <div className="form-group">
              <label>Plan Title</label>
              <input
                type="text"
                placeholder="Week 1 Study Plan"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            {/* 🔥 START DATE */}
            <div className="form-group">
              <label>Week Starting</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>

            {/* SUBJECTS */}
            <div className="form-group">
              <label>Subjects</label>
              <input
                type="text"
                placeholder="Math, Physics"
                value={subjects}
                onChange={(e) => setSubjects(e.target.value)}
              />
            </div>

            {/* GOALS */}
            <div className="form-group">
              <label>Goals</label>
              <input
                type="text"
                placeholder="Finish Chapter 3"
                value={goals}
                onChange={(e) => setGoals(e.target.value)}
              />
            </div>

            <button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Plan'}
            </button>
          </form>
        </div>

        {currentPlan && (
          <div className="plan-info">
            <h3>Current Plan</h3>

            <p>
              <strong>{currentPlan.title}</strong>
            </p>

            <p>
              {new Date(currentPlan.startDate).toLocaleDateString()} -{' '}
              {new Date(currentPlan.endDate).toLocaleDateString()}
            </p>

            <TaskTrackerPanel planId={currentPlan._id} />
          </div>
        )}
      </div>
    </div>
  );
}