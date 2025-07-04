import { useState, useRef } from 'react';

export default function TaskList({ tasks, onUpdate, onDelete }) {
  const [editingTask, setEditingTask] = useState(null);
  const titleRef = useRef(null);
  const descriptionRef = useRef(null);

  const handleToggleComplete = (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    onUpdate({
      ...task,
      completed: !task.completed
    });
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    // Focus the title input when edit mode starts
    setTimeout(() => titleRef.current?.focus(), 100);
  };

  const handleSave = (updatedTask) => {
    const updated = {
      ...updatedTask,
      title: titleRef.current.value.trim() || updatedTask.title,
      description: descriptionRef.current.value.trim() || updatedTask.description
    };
    onUpdate(updated);
    setEditingTask(null);
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
  };

  const handleDelete = (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      onDelete(taskId);
    }
  };

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <div
          key={task.id}
          className={`task-item ${task.completed ? 'completed' : ''}`}
        >
          <div className="task-content">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => handleToggleComplete(task.id)}
              className="task-checkbox"
            />
            <div className="task-details">
              {editingTask?.id === task.id ? (
                <div className="edit-form">
                  <input
                    ref={titleRef}
                    type="text"
                    value={editingTask.title}
                    onChange={(e) => setEditingTask({
                      ...editingTask,
                      title: e.target.value
                    })}
                    placeholder="Task title"
                  />
                  <textarea
                    ref={descriptionRef}
                    value={editingTask.description}
                    onChange={(e) => setEditingTask({
                      ...editingTask,
                      description: e.target.value
                    })}
                    placeholder="Task description (optional)"
                  />
                  <div className="edit-buttons">
                    <button onClick={() => handleSave(editingTask)} className="save-button">
                      Save
                    </button>
                    <button onClick={handleCancelEdit} className="cancel-button">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h3>{task.title}</h3>
                  {task.description && <p>{task.description}</p>}
                  <small>
                    Created: {new Date(task.createdAt).toLocaleString()}
                  </small>
                </>
              )}
            </div>
          </div>
          <div className="task-actions">
            {editingTask?.id !== task.id && (
              <>
                <button onClick={() => handleEdit(task)} className="edit-button">
                  Edit
                </button>
                <button onClick={() => handleDelete(task.id)} className="delete-button">
                  Delete
                </button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
