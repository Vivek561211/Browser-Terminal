const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const pty = require('node-pty');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', socket => {
  const shell = process.platform === 'win32' ? 'powershell.exe' : 'bash';

  const term = pty.spawn(shell, [], {
    name: 'xterm-color',
    cols: 80,
    rows: 24,
    cwd: process.env.HOME,
    env: process.env
  });

  term.onData(data => socket.emit('output', data));
  socket.on('input', data => term.write(data));
  socket.on('disconnect', () => term.kill());
});

server.listen(3000, () => {
  console.log('✅ Terminal running at http://localhost:3000');
});
