const Task = require('../models/Task');
const WeeklyPlan = require('../models/WeeklyPlan');

class ProgressService {
  async getProgressStats(userId) {
    const tasks = await Task.find({ userId });

    if (tasks.length === 0) {
      return {
        total: 0,
        completed: 0,
        inProgress: 0,
        pending: 0,
        completionRate: 0,
        byPriority: {
          high: { total: 0, completed: 0 },
          medium: { total: 0, completed: 0 },
          low: { total: 0, completed: 0 }
        },
        bySubject: {}
      };
    }

    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'completed').length;
    const inProgress = tasks.filter(t => t.status === 'in-progress').length;
    const pending = tasks.filter(t => t.status === 'pending').length;

    const byPriority = {
      high: {
        total: tasks.filter(t => t.priority === 'high').length,
        completed: tasks.filter(t => t.priority === 'high' && t.status === 'completed').length
      },
      medium: {
        total: tasks.filter(t => t.priority === 'medium').length,
        completed: tasks.filter(t => t.priority === 'medium' && t.status === 'completed').length
      },
      low: {
        total: tasks.filter(t => t.priority === 'low').length,
        completed: tasks.filter(t => t.priority === 'low' && t.status === 'completed').length
      }
    };

    const bySubject = {};
    tasks.forEach(task => {
      if (!bySubject[task.title]) {
        bySubject[task.title] = { total: 0, completed: 0 };
      }
      bySubject[task.title].total += 1;
      if (task.status === 'completed') {
        bySubject[task.title].completed += 1;
      }
    });

    return {
      total,
      completed,
      inProgress,
      pending,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
      byPriority,
      bySubject
    };
  }

  async getWeeklyProgress(userId, weekStartDate) {
    const weekStart = new Date(weekStartDate);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);

    const tasks = await Task.find({
      userId,
      deadline: { $gte: weekStart, $lte: weekEnd }
    }).populate('planId', 'subjects goals');

    const dailyStats = {};
    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart);
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      dailyStats[dateStr] = {
        total: 0,
        completed: 0,
        pending: 0,
        inProgress: 0
      };
    }

    tasks.forEach(task => {
      const dateStr = task.deadline.toISOString().split('T')[0];
      if (dailyStats[dateStr]) {
        dailyStats[dateStr].total += 1;
        dailyStats[dateStr][task.status] =
          (dailyStats[dateStr][task.status] || 0) + 1;
      }
    });

    return {
      weekStartDate: weekStart,
      weekEndDate: weekEnd,
      totalTasks: tasks.length,
      dailyStats,
      tasks
    };
  }

  async getSubjectAnalytics(userId) {
    const tasks = await Task.find({ userId });

    const subjectData = {};

    tasks.forEach(task => {
      if (!subjectData[task.subject]) {
        subjectData[task.subject] = {
          name: task.subject,
          total: 0,
          completed: 0,
          pending: 0,
          inProgress: 0,
          byPriority: {
            high: 0,
            medium: 0,
            low: 0
          }
        };
      }

      subjectData[task.subject].total += 1;
      subjectData[task.subject][task.status] += 1;
      subjectData[task.subject].byPriority[task.priority] += 1;
    });

    return Object.values(subjectData);
  }

  async getTrendData(userId, daysBack = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysBack);

    const tasks = await Task.find({
      userId,
      completedAt: { $gte: startDate }
    }).sort({ completedAt: 1 });

    const trendData = {};

    const currentDate = new Date(startDate);
    for (let i = 0; i <= daysBack; i++) {
      const dateStr = currentDate.toISOString().split('T')[0];
      trendData[dateStr] = 0;
      currentDate.setDate(currentDate.getDate() + 1);
    }

    tasks.forEach(task => {
      const dateStr = task.completedAt.toISOString().split('T')[0];
      if (trendData.hasOwnProperty(dateStr)) {
        trendData[dateStr] += 1;
      }
    });

    return Object.entries(trendData).map(([date, count]) => ({
      date,
      completed: count
    }));
  }
}

module.exports = new ProgressService();
