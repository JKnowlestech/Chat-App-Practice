import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const Chat = () => {
    //messages, username, input, approve

    const [approve, setApprove] = useState(false)
    const [username, setUserName] = useState("")
    const [input, setInput] = useState("")

    const [messages, setMessages] = useState([])

    const [socket] = useState(() => io(":8000"));

    useEffect(() => {
        console.log("Is this running?");
        // socket.on("Welcome", (data) => console.log(data));
        socket.on("post chat", (msg) => {
            setMessages(prevMsgState => [...prevMsgState, msg]);
        })
        return () => socket.removeAllListeners();
    }, [socket]);

    const usernameHandler = (e) => {
        e.preventDefault();
        if(username) {
            setApprove(true)
        }
    }

    const submitHandler = (e) => {
        e.preventDefult();
        socket.emit("chat", {username: username, content: input})
        setInput("")
    }


    return (
        <div>
            <h1>This is my Socket Chat APP</h1>
            {
                !approve ?
                <form onSubmit={usernameHandler}>
                <label>Enter a username</label>
                <input type="text" className='form-control' onChange={(e) => setUserName(e.target.value) } value={username}/>
                <button className='btn btn-danger'>Enter</button>
                </form> : 
                <div className='chat-input'>
                <form onSubmit={submitHandler}>
                <input type="text" className='form-control' onChange={(e) => setInput(e.target.value) } value={input}/>
                <button className='btn btn-outline-primary'>Talk</button>
                </form>
                    <div className='chats'>
                        <div className='card text-center'>
                            <div className='card-header'>
                                Chat App:
                            </div>
                            <div className='card-body'>
                                {
                                    messages.map((msg, i) => (<p key= {i}>{msg.username}: {msg.content}</p>))
                                }
                            </div>
                            <div className='card-footer'>
                                Socket.io App
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}

export default Chat