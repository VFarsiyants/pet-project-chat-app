class WebSocketBaseService {
  static instance = null;
  callbacks = {}

  static getInstance() {
    if (!WebSocketBaseService.instance) {
      WebSocketBaseService.instance = new WebSocketBaseService()
    }
    return WebSocketBaseService.instance
  }

  constructor() {
    this.socketRef = null;
    this.selfClosed = false;
  }

  connect(socket_path) {
    const webSocketPort = import.meta.env.MODE == 'development'
      ? ':8000'
      : ''
    const apiHost = import.meta.env.VITE_HOST
      ? import.meta.env.VITE_HOST
      : 'localhost'
    const token = localStorage.getItem('token');
    const path = `ws://${apiHost}${webSocketPort}/ws/${socket_path}/?access=${token}`;
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
      if (!this.selfClosed) {
          console.log('websocket is closed, trying to reconnect');
          this.connect(socket_path);
        } else {
          this.selfClosed = false;
          console.log('websocket is closed');
        }
    }
  }

  disconnect() {
    if (this?.socketRef) {
      this.selfClosed = true;
      this.socketRef.close(4000, 'closed by user');
    }
  }

  socketNewMessage(data) {
    const parsedData = JSON.parse(data);
    const command = parsedData.command;
    if (Object.keys(this.callbacks).length === 0) {
      return;
    }
    if (command) {
      this.callbacks[command](parsedData.data);
    } else {
      console.error('Unknown socket message format')
    }
  }

  addCallbacks(callbacks) {
    for (const [name, callback] of Object.entries(callbacks)) {
      this.callbacks[name] = callback
    }
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

class WebSocketChatService extends WebSocketBaseService {
  static getInstance() {
    if (!WebSocketChatService.instance) {
      WebSocketChatService.instance = new WebSocketChatService()
    }
    return WebSocketChatService.instance
  }
  fetchMessages(username) {
    this.sendMessage({
      command: 'fetch_messages',
      username: username
    })
  }

  newChatMessage(message) {
    this.sendMessage({
      command: 'new_message',
      from: message.from,
      message: message.content,
    })
  }
}

export const WebSocketChatInstance = WebSocketChatService.getInstance();
export const WebSocketContactsInstance = WebSocketBaseService.getInstance();
