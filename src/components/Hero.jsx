import { Canvas } from "@react-three/fiber";
import { Suspense, useState } from "react";
import { OrbitControls, OrthographicCamera } from "@react-three/drei";
import Model from "../Model";

const Hero = () => {
  const [selectedInfo, setSelectedInfo] = useState("Click on an object to see info");
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative h-screen w-screen text-white">
      {/* Overlay Text */}
      <div className="absolute top-10 left-1/2 transform -translate-x-1/2 z-10 text-center pointer-events-none">
        <h1 className="text-6xl pb-5">ABOUT ME</h1>
        <h1 className="text-3xl font-bold">SELECT AN OBJECT FROM THE ROOM TO LEARN MORE!</h1>
      </div>

      {/* Close Button */}
      {isFocused && (
        <button
          className="absolute top-4 left-4 z-20 bg-transparent text-white px-4 py-2"
          onClick={() => setIsFocused(false)}
        >
          Close
        </button>
      )}

      {/* Canvas */}
      <div className="h-full w-full">
        <Canvas>
          <OrthographicCamera makeDefault position={[-10, 5, 10]} zoom={150} />
          <ambientLight intensity={1.5} />
          <directionalLight position={[10, 10, 5]} intensity={10} />
          <Suspense fallback={null}>
            <Model
              scale={5}
              position={[0, -2, 0]}
              onSelect={setSelectedInfo}
              isFocused={isFocused}   // pass down controlled focus state
              setFocus={setIsFocused} // pass setter to child
            />
          </Suspense>
          <OrbitControls
            enabled={!isFocused} // Disable controls when focused
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
