class WebSocketService {
  static instance = null;
  callbacks = {}

  static getInstance() {
    if (!WebSocketService.instance) {
        WebSocketService.instance = new WebSocketService()
    }
    return WebSocketService.instance
  }

  constructor() {
    this.socketRef = null;
  }

  connect(socket_path, id) {
    const token = localStorage.getItem('token');
    const path = `ws://127.0.0.1:8000/ws/${socket_path}/${id}/?access=${token}`;
    this.socketRef = new WebSocket(path)
    this.socketRef.onopen = () => {
        console.log('websocket open');
    }
    this.socketRef.onmessage = e => {
        this.socketNewMessage(e.data);
    }
    this.socketRef.onerror = e => {
        console.log(e);
    }
    this.socketRef.onclose = () => {
        console.log('websocket is closed');
        this.connect(socket_path, id);
    }
  }

  socketNewMessage(data) {
    const parsedData = JSON.parse(data);
    const command = parsedData.command;
    if (Object.keys(this.callbacks).length === 0) {
      return;
    }
    if (command == 'messages') {
      console.log('messages update');
      this.callbacks[command](parsedData.messages);
    }
    if (command == 'new_message') {
      this.callbacks[command](parsedData.message);
      console.log('new message');
    }
  }

  fetchMessages(username) {
    this.sendMessage({
      command: 'fetch_messages',
      username: username
    })
  }

  newChatMessage(message) {
    console.log('newchat in socket')
    this.sendMessage({
      command: 'new_message',
      from: message.from,
      message: message.content,
    })
  }

  addCallbacks(messagesCallback, newMessageCallback) {
    this.callbacks['messages'] = messagesCallback;
    this.callbacks['new_message'] = newMessageCallback;
  }

  state() {
    return this.socketRef.readyState;
  }

  sendMessage(data) {
    try {
      this.socketRef.send(JSON.stringify({ ...data }))
    } catch (err) {
      console.log(err.message)
    }
  }

  waitForSocketConnection(callback) {
    const recursion = this.waitForSocketConnection;
    setTimeout(() => {
      if (this.state() === 1) {
        console.log('connection is secure')
        if (callback != null) {
          callback();
        }
        return;
      } else {
        console.log('waiting for connection...');
        recursion.bind(this)(callback);
      }
    }, 1);
  }
}

const WebSocketInstance = WebSocketService.getInstance();

export default WebSocketInstance;