import React from "react";
import { test_backend } from "../../declarations/test_backend";

export default function App() {
    const [name, setName] = React.useState('');
    const [message, setMessage] = React.useState('...');

    async function doGreet() {
        const greeting = await test_backend.greet(name);
        setMessage(greeting);
    }

    return (
        <div>
            <input placeholder="ok" onChange={(e) => setName(e.target.value)} />
            <button onClick={doGreet}>ok</button>
            <div>{message}</div>
        </div>
    );
}