import io from 'socket.io-client';
import { useEffect, useState } from 'react';

const App = () => {
  const [socket, setSocket] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState('');

  useEffect(() => {
    const socket = io('http://localhost:8000');
    setSocket(socket);

    socket.on('removeTask', (taskId) => {
      removeTask(taskId);
    });
    socket.on('addTask', (task) => {
      addTask(task);
    });
    socket.on('updateTask', (tasks) => {
      updateTasks(tasks);
    });
  });

  const removeTask = (taskId, isLocal) => {
    setTasks((tasks) => tasks.filter((task) => task.id !== taskId));
    if (isLocal) {
      socket.emit('removeTask', taskId);
    }
  };

  const addTask = (task) => {
    setTasks((tasks) => [...tasks, task]);
  };

  const updateTasks = (tasksData) => {
    setTasks(tasksData);
  };

  const submitForm = (e) => {
    e.preventDefault();
    addTask({ name: taskName });
  };

  return (
    <div className="App">
      <header>
        <h1>ToDoList.app</h1>
      </header>

      <section className="tasks-section" id="tasks-section">
        <h2>Tasks</h2>

        <ul className="task-section_list" id="task-list">
          {tasks.map((task) => (
            <li className="task" key={task.id}>
              {task.name}
              <button
                className="btn btn-red"
                onClick={() => removeTask(task.id, true)}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>

        <form id="add-task-form" onSubmit={(e) => submitForm(e)}>
          <input
            className="text-input"
            autoComplete="off"
            type="text"
            placeholder="Type your description"
            id="task-name"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
          />
          <button className="btn" type="submit">
            Add button
          </button>
        </form>
      </section>
    </div>
  );
};

export default App;
