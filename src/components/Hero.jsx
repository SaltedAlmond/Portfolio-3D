import { Canvas } from "@react-three/fiber";
import { Suspense, useState } from "react";
import { OrbitControls, OrthographicCamera } from "@react-three/drei";
import Model from "../Model";

const Hero = () => {
  const [selectedInfo, setSelectedInfo] = useState("Click on an object to see info");

  return (
    <div className="relative h-screen w-screen text-white">
      
      {/* Text overlay: absolutely positioned */}
      <div className="absolute top-10 left-1/2 transform -translate-x-1/2 z-10 text-center pointer-events-none">
        <h1 className="text-6xl pb-5">ABOUT ME</h1>
        <h1 className="text-3xl font-bold">SELECT AN OBJECT FROM THE ROOM TO LEARN MORE!</h1>
        <p className="text-white mt-2">{selectedInfo}</p>
      </div>

      {/* Canvas fills the container */}
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
            />
          </Suspense>
          <OrbitControls
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
