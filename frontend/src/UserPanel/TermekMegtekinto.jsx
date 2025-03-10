import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Canvas, useLoader } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, useGLTF } from "@react-three/drei";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import * as THREE from "three";
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

function ObjModel({ url }) {
    const obj = useLoader(OBJLoader, url);
    obj.traverse((child) => {
        if (child.isMesh) {
            child.material = new THREE.MeshStandardMaterial({
                metalness: 0.5,
                roughness: 0.2,
                color: child.material.color,
                envMapIntensity: 1,
            });
        }
    });
    return <primitive object={obj} scale={1.5} position={[0, -1, 0]} castShadow receiveShadow />;
}

function GlbModel({ url }) {
    const { scene } = useGLTF(url);
    scene.traverse((child) => {
        if (child.isMesh) {
            child.material.metalness = 0.7;
            child.material.roughness = 0.2;
            child.material.envMapIntensity = 0.2;
        }
    });
    return <primitive object={scene} scale={0.5} position={[0, -1, 0]} castShadow receiveShadow />;
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
                    <Canvas shadows>
                        <PerspectiveCamera makeDefault position={[4, 2, 5]} fov={50} />
                        <ambientLight intensity={0.9} />
                        <directionalLight position={[5, 5, 5]} intensity={2} castShadow />
                        <spotLight position={[10, 10, 10]} angle={0.3} penumbra={1} intensity={1.5} castShadow />
                        <pointLight position={[-5, -5, -5]} intensity={0.5} />
                        <Model url={modelUrl} />
                        <OrbitControls />
                    </Canvas>
                </div>
            )}
        </div>
    );
}

export default TermekMegtekinto;
