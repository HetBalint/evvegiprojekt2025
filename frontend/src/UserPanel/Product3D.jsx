import React, { useEffect, useState } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import { useGLTF, Environment, OrbitControls } from "@react-three/drei";
import { RGBELoader } from "three-stdlib";
import * as THREE from "three";
import axios from "axios";

function Model({ url }) {
    const { scene } = useGLTF(url);
    
    scene.traverse((child) => {
        if (child.isMesh) {
            if (child.name.toLowerCase().includes("diamond")) {
                child.material = new THREE.MeshPhysicalMaterial({
                    metalness: 1,
                    roughness: 0,
                    transmission: 1,
                    thickness: 2,
                    envMapIntensity: 2,
                    clearcoat: 1,
                    reflectivity: 1
                });
            }
        }
    });
    
    return <primitive object={scene} scale={1.5} />;
}

function Product3D({ productId }) {
    const [modelUrl, setModelUrl] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:8081/termek/${productId}/3d`)
            .then(response => {
                if (response.data && response.data.haromD) {
                    const fileName = response.data.haromD;
                    const url = fileName.startsWith("http") ? fileName : `http://localhost:8081/3D/${fileName}`;
                    setModelUrl(url);
                }
            })
            .catch(error => console.error("❌ Hiba a 3D fájl betöltésekor:", error));
    }, [productId]);

    const texture = useLoader(RGBELoader, "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/peppermint_powerplant_2_1k.hdr");
    texture.mapping = THREE.EquirectangularReflectionMapping;

    return (
        <div className="termek-3d-container" style={{ width: "100%", height: "600px", overflow: "hidden", position: "relative" }}>
            <h3>3D Megtekintés</h3>
            {modelUrl ? (
                <Canvas shadows camera={{ position: [0, 0, 10], fov: 35 }} style={{ width: "100%", height: "100%" }}>
                    <ambientLight intensity={0.5} />
                    <Environment map={texture} />
                    <OrbitControls />
                    <Model url={modelUrl} />
                </Canvas>
            ) : (
                <p>Ehhez a termékhez nincs 3D modell.</p>
            )}
        </div>
    );
}

export default Product3D;