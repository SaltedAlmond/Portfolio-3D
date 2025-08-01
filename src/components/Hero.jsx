import { Canvas } from "@react-three/fiber";
import { Suspense, useState } from "react";
import { OrbitControls, OrthographicCamera } from "@react-three/drei";
import Model from "../Model";
import SketchfabViewer from "./SketchfabViewer"; // We'll create this next

const sketchfabModelIds = {
  Majora_Viewable: "5614f50365a04db7b14f0512e445aead",
  // SwordViewable: "YOUR_SWORD_SKETCHFAB_MODEL_UID",
  // Add other mappings here based on mesh names
};

const Hero = () => {
  const [selectedMeshName, setSelectedMeshName] = useState(null);
  const isFocused = Boolean(selectedMeshName);

  // Extract Sketchfab UID from mapping based on selected mesh name
  const sketchfabModelUid = selectedMeshName
    ? sketchfabModelIds[selectedMeshName] // Use exact mesh name
    : null;

  return (
    <div className="relative h-screen w-screen text-white">
      {/* Overlay Text */}
      {!isFocused && (
        <div className="absolute top-10 left-1/2 transform -translate-x-1/2 z-10 text-center pointer-events-none">
          <h1 className="text-6xl pb-5">ABOUT ME</h1>
          <h1 className="text-3xl font-bold">
            SELECT AN OBJECT FROM THE ROOM TO LEARN MORE!
          </h1>
        </div>
      )}

      {/* Close Button */}
      {isFocused && (
        <button
          className="absolute top-4 left-4 z-40 bg-transparent text-white px-4 py-2"
          onClick={() => setSelectedMeshName(null)}
        >
          Close
        </button>
      )}

      {/* Sketchfab Viewer Overlay */}
      {isFocused && sketchfabModelUid && (
        <SketchfabViewer modelUid={sketchfabModelUid} />
      )}

      {/* 3D Room Canvas */}
      <div className="h-full w-full">
        <Canvas>
          <OrthographicCamera makeDefault position={[-10, 5, 10]} zoom={150} />
          <ambientLight intensity={1.5} />
          <directionalLight position={[10, 10, 5]} intensity={10} />
          <Suspense fallback={null}>
            <Model
              scale={5}
              position={[0, -2, 0]}
              onSelect={setSelectedMeshName}
              isFocused={isFocused}
              setFocus={(focus) => !focus && setSelectedMeshName(null)}
            />
          </Suspense>
          <OrbitControls
            enabled={!isFocused}
            enablePan={false}
            minZoom={80}
            maxZoom={200}
            minAzimuthAngle={-Math.PI / 2}
            maxAzimuthAngle={Math.PI * 2}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 2}
          />
        </Canvas>
      </div>
    </div>
  );
};

export default Hero;
