import { useState, useEffect } from 'react';
import TaskList from '../TaskList/TaskList';
import TaskForm from '../TaskForm/TaskForm';

export default function Dashboard({ onLogout, username }) {
  console.log('Dashboard mounted. Props:', { onLogout, username });
  const [tasks, setTasks] = useState(() => {
    try {
      const raw = localStorage.getItem('tasks');
      let savedTasks = [];
      if (raw) {
        savedTasks = JSON.parse(raw);
        if (!Array.isArray(savedTasks)) {
          console.warn('Malformed tasks in localStorage (init), resetting...');
          savedTasks = [];
        }
      }
      console.log('Loaded tasks from localStorage (init):', savedTasks);
      return savedTasks;
    } catch (e) {
      console.error('Error loading tasks from localStorage (init):', e);
      return [];
    }
  });
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    try {
      localStorage.setItem('tasks', JSON.stringify(tasks));
      console.log('Saved tasks to localStorage:', tasks);
    } catch (e) {
      console.error('Error saving tasks to localStorage:', e);
    }
  }, [tasks]);

  const addTask = (task) => {
    const newTask = {
      ...task,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      completed: false
    };
    setTasks([...tasks, newTask]);
  };

  const updateTask = (updatedTask) => {
    setTasks(tasks.map(task => 
      task.id === updatedTask.id ? updatedTask : task
    ));
  };

  const deleteTask = (taskId) => {
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    setTasks(updatedTasks);
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'completed') return task.completed;
    return !task.completed;
  });

  const taskCounts = {
    all: tasks.length,
    completed: tasks.filter(t => t.completed).length,
    pending: tasks.filter(t => !t.completed).length
  };

  return (
    <div className="dashboard">
      <header>
        <h1>Task Dashboard</h1>
        <div className="filter-buttons">
          {['all', 'completed', 'pending'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={filter === status ? 'active' : ''}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
              <span>({taskCounts[status]})</span>
            </button>
          ))}
        </div>
      </header>
      <div className="dashboard-content">
        <TaskForm onSubmit={addTask} />
        <TaskList
          tasks={filteredTasks}
          onUpdate={updateTask}
          onDelete={deleteTask}
        />
      </div>
      <div className="user-info">
        <p>Welcome, {username}!</p>
      </div>
      <button
        className="logout-button"
        onClick={onLogout}
      >
        Logout
      </button>
    </div>
  );
}
