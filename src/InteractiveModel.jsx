import { useThree, useFrame } from "@react-three/fiber";
import { useRef, useState, useEffect } from "react";
import * as THREE from "three";

export default function InteractiveModel({ scene, onSelect, isFocused, setFocus }) {
  const raycaster = useRef(new THREE.Raycaster());
  const hovered = useRef(null);
  const originalScales = useRef(new Map());
  const { camera, pointer } = useThree();

  const selectedObject = useRef(null);
  const originalPosition = useRef(new THREE.Vector3());
  const originalQuaternion = useRef(new THREE.Quaternion());

  // New state: are we returning to original position?
  const [isReturning, setIsReturning] = useState(false);

  useEffect(() => {
    if (!isFocused && selectedObject.current) {
      setIsReturning(true); // Start return animation when focus lost
    }
  }, [isFocused]);

  useFrame(() => {
    raycaster.current.setFromCamera(pointer, camera);
    const intersects = raycaster.current.intersectObjects(scene.children, true);
    const obj = intersects.find((i) =>
      i.object.name.toUpperCase().includes("MAJORA")
    )?.object;

    scene.traverse((child) => {
      if (child.isMesh) {
        if (!originalScales.current.has(child)) {
          originalScales.current.set(child, child.scale.clone());
        }
        const original = originalScales.current.get(child);
        const targetScale = obj === child
          ? original.clone().multiplyScalar(1.2)
          : original;

        child.scale.lerp(targetScale, 0.1);
      }
    });

    hovered.current = obj || null;

    // Center object for user viewing
    if (isFocused && selectedObject.current && !isReturning) {
      const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
      const targetWorldPosition = camera.position.clone().add(forward.multiplyScalar(2));

      selectedObject.current.parent.updateMatrixWorld();
      const localTarget = selectedObject.current.parent.worldToLocal(targetWorldPosition.clone());

      selectedObject.current.position.lerp(localTarget, 0.1);
      selectedObject.current.quaternion.slerp(camera.quaternion, 0.1);
    } 
    
    // Return object to Room position
    if (isReturning && selectedObject.current) {
      // Lerp back to original position & rotation
      selectedObject.current.position.lerp(originalPosition.current, 0.1);
      selectedObject.current.quaternion.slerp(originalQuaternion.current, 0.1);

      const posDist = selectedObject.current.position.distanceTo(originalPosition.current);
      const quatAngle = selectedObject.current.quaternion.angleTo(originalQuaternion.current);

      // Only clear after sufficiently close
      if (posDist < 0.001 && quatAngle < 0.001) {
        selectedObject.current.position.copy(originalPosition.current);
        selectedObject.current.quaternion.copy(originalQuaternion.current);
        selectedObject.current = null;
        setIsReturning(false);
        setFocus(false);
      }
    }
  });

  return (
    <primitive
      object={scene}
      onClick={(e) => {
        e.stopPropagation();
        if (hovered.current && !isFocused) { // only allow selecting if not already focused
          selectedObject.current = hovered.current;
          originalPosition.current.copy(hovered.current.position);
          originalQuaternion.current.copy(hovered.current.quaternion);
          setFocus(true);
          onSelect(`You clicked on: ${hovered.current.name}`);
        }
      }}
    />
  );
}
