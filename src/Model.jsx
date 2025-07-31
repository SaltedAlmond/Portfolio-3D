import { useGLTF } from '@react-three/drei';
import InteractiveModel from './InteractiveModel';

export default function Model({ onSelect, isFocused, setFocus, ...props }) {
  const { scene } = useGLTF('/models/Room.glb');
  return (
    <group {...props}>
      <InteractiveModel
        scene={scene}
        onSelect={onSelect}
        isFocused={isFocused}
        setFocus={setFocus}
      />
    </group>
  );
}
