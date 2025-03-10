import React, { useEffect, useState } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import { useGLTF, MeshRefractionMaterial, AccumulativeShadows, RandomizedLight, Html, Environment, Center, PresentationControls } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { RGBELoader } from "three-stdlib";
import { HexColorPicker } from "react-colorful";
import * as THREE from "three";
import axios from "axios";

// 🔹 Gyűrű komponens
function Ring({ map, url, ...props }) {
    const [color, setColor] = useState("white");
    const { scene, nodes, materials } = useGLTF(url);

    return (
        <group {...props} dispose={null}>
            {/* Gyémánt anyag fénytöréssel */}
            <mesh geometry={nodes.diamonds.geometry}>
                <MeshRefractionMaterial envMap={map} aberrationStrength={0.02} toneMapped={false} />
            </mesh>

            {/* Gyűrű fő anyaga színváltoztatással */}
            <mesh castShadow receiveShadow geometry={nodes.ring.geometry} material={materials.ring} material-color={color} material-envMapIntensity={4} />

            {/* Színválasztó UI */}
            <Html position={[0.25, 0.1, 2.75]} scale={0.15} rotation={[Math.PI / 2, 0, 0]} transform>
                <HexColorPicker className="picker" color={color} onChange={setColor} />
            </Html>
        </group>
    );
}

// 🔹 3D megjelenítő
function Product3D({ productId }) {
    const [modelUrl, setModelUrl] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:8081/termek/${productId}`)
            .then(response => {
                if (response.data.length > 0 && response.data[0].haromD) {
                    setModelUrl(`http://localhost:8081/3D/${response.data[0].haromD}`);
                }
            })
            .catch(error => console.error("❌ Hiba a 3D fájl betöltésekor:", error));
    }, [productId]);

    const texture = useLoader(RGBELoader, "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/peppermint_powerplant_2_1k.hdr");
    texture.mapping = THREE.EquirectangularReflectionMapping;

    return (
        <div className="termek-3d-container">
            <h3>3D Megtekintés</h3>
            {modelUrl ? (
                <Canvas shadows camera={{ position: [0, 0, 15], fov: 35, near: 1, far: 30 }}>
                    <color attach="background" args={["#f0f0f0"]} />
                    <ambientLight />
                    <Environment map={texture} />

                    <PresentationControls
                        global
                        config={{ mass: 1, tension: 250, friction: 25 }}
                        snap={{ mass: 2, tension: 250, friction: 50 }}
                        zoom={1.25}
                        rotation={[0.5, 0.5, 0]}
                        polar={[-Math.PI / 5, Math.PI / 4]}
                        azimuth={[-Math.PI / 1.75, Math.PI / 4]}
                    >
                        <group position={[0, -3, 0]}>
                            <Center top>
                                <Ring map={texture} url={modelUrl} rotation={[-Math.PI / 2.05, 0, 0]} scale={3} />
                            </Center>

                            {/* Árnyékok hozzáadása */}
                            <AccumulativeShadows temporal frames={100} alphaTest={0.95} opacity={1} scale={20}>
                                <RandomizedLight amount={8} radius={10} ambient={0.5} position={[0, 10, -2.5]} bias={0.001} size={3} />
                            </AccumulativeShadows>
                        </group>
                    </PresentationControls>

                    {/* Bloom effektus */}
                    <EffectComposer>
                        <Bloom luminanceThreshold={1} intensity={0.85} levels={9} mipmapBlur />
                    </EffectComposer>
                </Canvas>
            ) : (
                <p>Ehhez a termékhez nincs 3D modell.</p>
            )}
        </div>
    );
}

export default Product3D;
