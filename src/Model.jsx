import { useGLTF } from '@react-three/drei'
import InteractiveModel from './InteractiveModel'

export default function Model({ onSelect, ...props }) {
  const { scene } = useGLTF('/models/Room.glb')
  return (
    <group {...props}>
      <InteractiveModel scene={scene} onSelect={onSelect} />
    </group>
  )
}
