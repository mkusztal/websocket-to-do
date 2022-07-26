import io from 'socket.io-client';
import { useEffect, useState } from 'react';
import shortid from 'shortid';

const App = () => {
  const [socket, setSocket] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState('');

  useEffect(() => {
    const socket = io('http://localhost:8000');
    setSocket(socket);

    socket.on('updateTask', (tasks) => {
      updateTasks(tasks);
    });

    socket.on('addTask', (task) => {
      addTask(task);
    });

    socket.on('removeTask', (taskId) => {
      removeTask(taskId);
    });
  }, []);

  const removeTask = (taskId, isLocal) => {
    setTasks((tasks) => tasks.filter((task) => task.id !== taskId));
    if (isLocal) {
      socket.emit('removeTask', taskId);
    }
  };

  const updateTasks = (tasksData) => {
    setTasks(tasksData);
  };

  const addTask = (task) => {
    setTasks((tasks) => [...tasks, task]);
    setTaskName('');
  };

  const submitForm = (e) => {
    e.preventDefault();
    addTask({ name: taskName, id: shortid() });
    socket.emit('addTask', { name: taskName, id: shortid() });
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
