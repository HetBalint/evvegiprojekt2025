import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Canvas, useLoader } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import "./TermekMegtekinto.css";

function Model({ url }) {
    const fileExtension = url.split(".").pop().toLowerCase();

    if (fileExtension === "obj") {
        return <ObjModel url={url} />;
    } else if (fileExtension === "gltf" || fileExtension === "glb") {
        return <GlbModel url={url} />;
    } else {
        console.error("❌ Nem támogatott fájlformátum:", url);
        return <p>Hiba: Nem támogatott fájltípus</p>;
    }
}

// 🔹 OBJ fájl betöltése
function ObjModel({ url }) {
    const obj = useLoader(OBJLoader, url);
    return <primitive object={obj} scale={1} />;
}

function GlbModel({ url }) {
    const loader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();

    dracoLoader.setDecoderPath("https://www.gstatic.com/draco/v1/decoders/");
    dracoLoader.setDecoderConfig({ type: "js" });
    loader.setDRACOLoader(dracoLoader);

    // 🔹 Helyes használat: A `scene`-t elmentjük egy változóba
    const { scene } = useLoader(GLTFLoader, url, (loader) => {
        loader.setDRACOLoader(dracoLoader);
    });

    return <primitive object={scene} scale={1} />;
}


function TermekMegtekinto() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [modelUrl, setModelUrl] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:8081/termek/${id}`)
            .then(res => {
                if (res.data.length > 0) {
                    setProduct(res.data[0]);
                }
            })
            .catch(err => console.error("Hiba a termék lekérdezésekor:", err));

        axios.get(`http://localhost:8081/termek/${id}/3d`)
            .then(res => {
                if (res.data.haromD) {
                    const url = res.data.haromD.startsWith("http") ? res.data.haromD : `http://localhost:8081/3D/${res.data.haromD}`;
                    setModelUrl(url);
                }
            })
            .catch(err => console.error("Hiba a 3D modell lekérdezésekor:", err));
    }, [id]);

    const handleAddToCart = () => {
        if (!product) return;

        axios.post("http://localhost:8081/kosar/termek", {
            termekId: product.termekID,
            nev: product.termekNev,
            ar: product.ar,
            meret: product.meret,
            anyag: product.anyag || "N/A",
            kep: product.kep,
            mennyiseg: 1
        }, { withCredentials: true })
        .then((res) => console.log("Termék hozzáadva a kosárhoz:", res.data))
        .catch((err) => console.error("Hiba a termék kosárba helyezésekor:", err));
    };

    if (!product) {
        return <div className="loading-container"><h3>Termék betöltése...</h3></div>;
    }

    return (
        <div className="termek-container">
            <div className="termek-tartalom">
                <img className="termek-kep-box"
                    src={`http://localhost:8081/kepek/${product.kep}`} 
                    alt={product.termekNev} 
                />
                
                <div className="termek-info-box">
                    <h2 className="termek-nev">{product.termekNev}</h2>
                    <h5 className="termek-ar"> {product.ar} Ft</h5>
                    <p className="termek-meret">
                    <strong>Méret:</strong> {product.kategoriaNev === "gyűrű" ? ` (${product.meret} mm)` : `(${product.meret} cm)`}</p>
                    <p className="termek-keszlet"> {product.keszlet > 0 ? `Raktáron (${product.keszlet} db)` : "Nincs raktáron"}</p>
                    <p className="termek-leiras"> {product.leiras}</p>
                    
                    <button className="kosarba-gomb" disabled={product.keszlet <= 0} onClick={handleAddToCart}>Kosárba</button>
                </div>
            </div>

            {modelUrl && (
                <div className="model-container">
                    <h3>Termék 3D nézete</h3>
                    <Canvas>
                    <ambientLight intensity={2} />
    <directionalLight position={[5, 10, 5]} intensity={4} />
    <spotLight position={[15, 10, 5]} angle={0.5} penumbra={1} intensity={2} />
    <pointLight position={[-10, -10, -10]} intensity={1} />
    <Model url={modelUrl} />
    <OrbitControls />
</Canvas>

                </div>
            )}
        </div>
    );
}

export default TermekMegtekinto;