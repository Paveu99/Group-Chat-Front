import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const App: React.FC = () => {
    const [messages, setMessages] = useState<string[]>([]);
    const [input, setInput] = useState<string>('');
    const ws = useRef<WebSocket | null>(null);

    useEffect(() => {
        const connect = () => {
            ws.current = new WebSocket('ws://localhost:3001');

            ws.current.onopen = () => {
                console.log('Connected to WebSocket server');
                setMessages((prevMessages) => [...prevMessages, 'Connected to WebSocket server']);
            };

            ws.current.onmessage = (event) => {
                console.log('Received:', event.data);
                setMessages((prevMessages) => [...prevMessages, `Received: ${event.data}`]);
            };

            ws.current.onclose = () => {
                console.log('Disconnected from WebSocket server');
                setMessages((prevMessages) => [...prevMessages, 'Disconnected from WebSocket server. Reconnecting...']);
                setTimeout(connect, 1000); // Attempt to reconnect every second
            };

            ws.current.onerror = (error) => {
                console.error('WebSocket error:', error);
                setMessages((prevMessages) => [...prevMessages, `WebSocket error: ${error}`]);
            };
        };

        connect();

        return () => {
            ws.current?.close();
        };
    }, []);

    const sendMessage = () => {
        if (ws.current?.readyState === WebSocket.OPEN) {
            console.log('Sending:', input);
            ws.current.send(input);
            setMessages((prevMessages) => [...prevMessages, `Sending: ${input}`]);
            setInput('');
        } else {
            console.log('WebSocket is not open. Cannot send message.');
            setMessages((prevMessages) => [...prevMessages, 'WebSocket is not open. Cannot send message.']);
        }
    };

    return (
        <div className="App">
            <h1>WebSocket Test</h1>
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter a message"
            />
            <button onClick={sendMessage}>Send Message</button>
            <div>
                {messages.map((message, index) => (
                    <p key={index}>{message}</p>
                ))}
            </div>
        </div>
    );
};

export default App;
