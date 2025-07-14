import { Canvas } from "@react-three/fiber";
import { Suspense } from 'react'
import { OrbitControls } from '@react-three/drei'
import Model from './Model'

function App() {

  return <div id="canvas-container">
    <Canvas
      camera={{
      position: [0, 1, 5],  // adjust height if needed
      fov: 100               // this is the key part to reduce distortion
    }}
    >
      <ambientLight intensity={0.5} />
        <directionalLight position={[2, 5, 2]} intensity={1} />
        <Suspense fallback={null}>
          <Model scale={0.5} />
        </Suspense>
        <OrbitControls />
    </Canvas>
  </div>
}

export default App
