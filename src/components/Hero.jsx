
import { Canvas } from "@react-three/fiber";
import { Suspense, useState } from "react";
import { OrbitControls, OrthographicCamera } from "@react-three/drei";
import Model from "../Model";


const Hero = () => {
    const [selectedInfo, setSelectedInfo] = useState("Click on the room to see info");

    return (
        <div className="flex h-screen w-screen">
      {/* Left Panel: 3D */}
      <div className="w-1/2 h-full">
        <Canvas>
          <OrthographicCamera makeDefault position={[-10, 5, 10]} zoom={100} />
          <ambientLight intensity={1.5} />
          <directionalLight position={[10, 10, 5]} intensity={10} />
          <Suspense fallback={null}>
            <Model scale={5.5} position={[0, -2, 0]} onClick={setSelectedInfo} />
          </Suspense>
          <OrbitControls
            enablePan={false}
            minZoom={50}
            maxZoom={150}
            minAzimuthAngle={-Math.PI / 2}
            maxAzimuthAngle={Math.PI * 2}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 2}
          />
        </Canvas>
      </div>

      {/* Right Panel: Info */}
      <div className="w-1/2 h-full text-white flex flex-col justify-center items-center p-10">
        <h1 className="text-5xl font-bold mb-4">Room Info</h1>
        <p className="text-center">{selectedInfo}</p>
      </div>
    </div>
    );
};

export default Hero;