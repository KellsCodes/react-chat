import './App.css';
import { useEffect, useState } from "react" 
import io from "socket.io-client";


let socket;
const CONNECTION_PORT = "localhost:8080/"

function App() {
  // before login
  const [loggedIn, setLoggedIn] = useState(false);
  const [room, setRoom] = useState("")
  const [userName, setUserName] = useState("")

  // after login
  const [message, setMessage] = useState("")
  const [messageLists, setMessageLists] = useState([])

  useEffect(() => {
    socket = io(CONNECTION_PORT, {transports: ['websocket', 'polling', 'flashsocket']});
  }, [CONNECTION_PORT])

  useEffect(() => {
    socket.on("receive_message", (data) => {
      // console.log(data)
      setMessageLists([...messageLists, data])
    })
  })

  const connectToRoom = () => {
    // console.log(room)
    setLoggedIn(true)
    socket.emit("join_room", room)
  }

  // send message
  const sendMessage = () => {
    const msg = {
      room,
      content: {
      message,
      author: userName
      }
    }
    socket.emit("send_message", msg);
    setMessageLists([...messageLists, msg.content])
    setMessage("")
  }

  return (
    <div className="App">
      {!loggedIn ? (
        <div className="login">
          <div className="inputs">
            <input type="text" placeholder="Name..." onChange={(e) => setUserName(e.target.value)} />
            <input type="text" placeholder="Room..." onChange={(e) => setRoom(e.target.value)} />
          </div>

          <button onClick={connectToRoom}>Enter Chat</button>
        </div>
      ) : (
        <div className="chatContainer">
          <div className="messages">
            {messageLists.map((value, key) => {
              return <h1 key={key}>{value.author}: {value.message}</h1>
            })}
          </div>
          <div className="messageInputs">
            <input type="text" placeholder="message" onChange={(e) => setMessage(e.target.value)} />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
      
    </div>
  );
}

export default App;
