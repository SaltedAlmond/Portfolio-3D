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

  const [isReturning, setIsReturning] = useState(false);

  useEffect(() => {
    if (!isFocused && selectedObject.current) {
      setIsReturning(true);
    }
  }, [isFocused]);

  useFrame(() => {
    raycaster.current.setFromCamera(pointer, camera);
    const intersects = raycaster.current.intersectObjects(scene.children, true);
    // Find first object with "Viewable" in the name (case-insensitive)
    const obj = intersects.find((i) =>
      i.object.name.toUpperCase().includes("VIEWABLE")
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

    if (isFocused && selectedObject.current && !isReturning) {
      // Center selected object in front of camera (optional animation)
      const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
      const targetWorldPosition = camera.position.clone().add(forward.multiplyScalar(2));

      selectedObject.current.parent.updateMatrixWorld();
      const localTarget = selectedObject.current.parent.worldToLocal(targetWorldPosition.clone());

      selectedObject.current.position.lerp(localTarget, 0.01);
      selectedObject.current.quaternion.slerp(camera.quaternion, 0.01);
    }

    if (isReturning && selectedObject.current) {
      selectedObject.current.position.lerp(originalPosition.current, 0.01);
      selectedObject.current.quaternion.slerp(originalQuaternion.current, 0.01);

      const posDist = selectedObject.current.position.distanceTo(originalPosition.current);
      const quatAngle = selectedObject.current.quaternion.angleTo(originalQuaternion.current);

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
        if (hovered.current && !isFocused) {
          selectedObject.current = hovered.current;
          originalPosition.current.copy(hovered.current.position);
          originalQuaternion.current.copy(hovered.current.quaternion);
          setFocus(true);

          // Pass up the mesh name for Sketchfab loading
          onSelect(hovered.current.name);
        }
      }}
    />
  );
}
