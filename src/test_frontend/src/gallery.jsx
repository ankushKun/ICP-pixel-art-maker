import React from "react";
import { test_backend } from "../../declarations/test_backend";

export default function Gallery() {
    const [art, setArt] = React.useState("");
    const [artClean, setArtClean] = React.useState();

    React.useEffect(() => {
        async function getArt() {
            const art = await test_backend.getKeyValuePair();
            const a = art.split(")(")
            const b = a.map(val => val.replace("(", "").replace(")", "").split(","))
            console.log(b)
            setArt(art);
            setArtClean(b);
        }
        getArt();
    }, [])

    return <div style={{ margin: 5 }}>
        <h1>Gallery</h1>
        <div className="col" style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: 5 }}>
            {art.length > 0 && artClean && artClean.map((val, i) => {
                return <div key={i} >
                    <img src={val[1] + "," + val[2]} style={{ width: 400, height: 400 }} />
                    <div>{val[0].substring(0, 40)}...</div>
                </div>
            })}
        </div>
    </div>
}