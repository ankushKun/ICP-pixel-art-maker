import React from "react";
import { AuthClient } from "@dfinity/auth-client";
import { test_backend } from "../../declarations/test_backend";
import html2canvas from "html2canvas";
import "../assets/main.css"
import Gallery from "./gallery";

export default function App() {
    const [userKey, setUserKey] = React.useState("");
    const [pixels, setPixels] = React.useState([]);
    const [mouseDown, setMouseDown] = React.useState(false);
    const [selectedColor, setSelectedColor] = React.useState("red");
    const [gridSize, setGridSize] = React.useState(25);
    const [art64, setArt64] = React.useState("");
    const [showGallery, setShowGallery] = React.useState(false);

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

    async function addArt(data) {
        const id = await test_backend.setArt(userKey, data);
        console.log(id);
        alert("Congrats! Your Pixel Art has been saved to the ICP blockchain! Checkout Gallery to see it!")
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
                <div style={{ marginRight: "auto", fontWeight: "bold", fontSize: 25 }}>ICPixel</div>
                {userKey?.substring(0, 5)}...{userKey.substring(userKey.length - 5, userKey.length)}
                {userKey == "" ? <button onClick={connect}>connect</button> : <button onClick={disconnect}>disconnect</button>}
            </nav>
            {/* GRID */}
            {showGallery ? <div>
                <button onClick={() => setShowGallery(false)}>back</button>
                <Gallery />
            </div> : <div className="row">
                <div className="col" id="artwork" style={{ border: "1px black solid" }} onMouseDown={() => setMouseDown(true)} onMouseUp={() => setMouseDown(false)}>
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
                            if (userKey == "") {
                                alert("connect to ICP first")
                                return
                            }
                            html2canvas(document.querySelector("#artwork")).then(canvas => {
                                const canv = document.body.appendChild(canvas)
                                canv.style.display = "none"
                                const dataURL = canvas.toDataURL()
                                console.log(dataURL)
                                setArt64(dataURL)
                                addArt(dataURL)
                            });
                        }}>Save to ICP</button><br />
                        <button disabled title="COMING SOON">mint</button>
                        <button onClick={() => setShowGallery(true)}>visit gallery</button>
                    </div>
                </div>
            </div>}
        </div>
    );
}