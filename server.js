const express = require('express');
const path = require('path');
const socket = require('socket.io');

const app = express();
let tasks = [];

// middleware
app.use(express.static(path.join(__dirname, '/client/')));

app.use((req, res) => {
  res.status(404).send('404 not found...');
});

const server = app.listen(process.env.PORT || 8000, () => {
  console.log('Server is running on port: 8000');
});

const io = socket(server);

io.on('connection', (socket) => {
  socket.broadcast.emit('updateData', tasks);

  socket.on('addTask', (task) => {
    tasks.push(task);
    socket.broadcast.emit('addTask', task);
  });

  socket.on('removeTask', (taskId) => {
    tasks = tasks.filter((task) => task.id !== taskId);
    socket.broadcast.emit('removeTask', taskId);
  });
});
