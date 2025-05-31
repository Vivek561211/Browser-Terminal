const term = new Terminal({ cursorBlink: true });
term.open(document.getElementById('terminal'));
term.focus();

const socket = io();
socket.on('output', data => term.write(data));
term.onData(data => socket.emit('input', data));
