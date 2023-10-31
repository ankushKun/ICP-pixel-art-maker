import React from "react";
import { AuthClient } from "@dfinity/auth-client";
import { test_backend } from "../../declarations/test_backend";
import "../assets/main.css"

export default function App() {
    const [userKey, setUserKey] = React.useState("");
    const [pixels, setPixels] = React.useState([]);
    const [mouseDown, setMouseDown] = React.useState(false);
    const [selectedColor, setSelectedColor] = React.useState("red");
    const [gridSize, setGridSize] = React.useState(25);

    React.useEffect(() => {
        const t = []
        for (let i = 0; i < gridSize; i++) {
            const row = []
            for (let j = 0; j < gridSize; j++)
                row.push({ color: "none" })
            t.push(row)
        }
        setPixels(t)
    }, [])

    async function doGreet() {
        const greeting = await test_backend.greet("INPUT STR");
    }

    React.useEffect(() => {
        const userKey = sessionStorage.getItem("dfx-identity");
        if (userKey) {
            setUserKey(userKey);
        }
    }, [])

    async function connect() {
        const authClient = await AuthClient.create();
        function handleAuthenticated(authClient) {
            console.log(authClient)
            const pubKey = authClient._chain.publicKey
            // convert pubKey array buffer to string
            const pubKeyStr = Array.from(new Uint8Array(pubKey)).map(val => val.toString(16).padStart(2, '0')).join('');
            setUserKey(pubKeyStr);
            sessionStorage.setItem("dfx-identity", pubKeyStr);
        }
        authClient.login({
            // 1 day
            maxTimeToLive: BigInt(1 * 24 * 60 * 60 * 1000 * 1000 * 1000),
            onSuccess: async () => { handleAuthenticated(authClient) },
        });
    }

    async function disconnect() {
        const authClient = await AuthClient.create();
        authClient.logout();
        setUserKey("");
        sessionStorage.removeItem("dfx-identity");
    }

    const Pixel = ({ x, y, color }) => {
        return <div className="pixel" style={{ backgroundColor: color }}
            onMouseOver={() => {
                if (mouseDown) {
                    setPixels(prev => {
                        const t = [...prev]
                        t[y][x].color = selectedColor
                        return t
                    })
                }
            }}
        ></div>
    }

    const ColorButton = ({ color }) => {
        return <div className="color" style={{ backgroundColor: color }}
            onClick={() => {
                setSelectedColor(color)
                console.log("color set:", color)
            }}
        ></div>
    }

    return (
        <div>
            <nav>
                {userKey?.substring(0, 5)}...{userKey.substring(userKey.length - 5, userKey.length)}
                {userKey == "" ? <button onClick={connect}>connect</button> : <button onClick={disconnect}>disconnect</button>}
            </nav>
            {/* GRID */}
            <div className="row">
                <div className="col" style={{ border: "1px black solid" }} onMouseDown={() => setMouseDown(true)} onMouseUp={() => setMouseDown(false)}>
                    {pixels.map((row, y) => {
                        return (
                            <div className="row">
                                {row.map((pixel, x) => {
                                    return <Pixel x={x} y={y} color={pixel.color} />
                                })}
                            </div>
                        )
                    })}
                </div>
                <div className="col" style={{ marginLeft: "25px" }}>
                    <div className="row" style={{ marginBottom: "10px" }}>
                        <ColorButton color="red" />
                        <ColorButton color="green" />
                        <ColorButton color="blue" />
                        <ColorButton color="yellow" />
                        <ColorButton color="black" />
                        <ColorButton color="white" />
                    </div>
                    <div>
                        <button onClick={() => {
                            setPixels(prev => {
                                const t = [...prev]
                                for (let i = 0; i < gridSize; i++) {
                                    for (let j = 0; j < gridSize; j++) {
                                        t[i][j].color = "none"
                                    }
                                }
                                return t
                            })
                        }}>clear</button>
                        <button onClick={() => {

                        }}>Save to ICP</button>
                    </div>
                </div>
            </div>
        </div>
    );
}