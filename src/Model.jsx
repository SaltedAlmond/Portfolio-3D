import { useGLTF } from "@react-three/drei";
import { useEffect } from "react";

export default function Model({ onClick, ...props }) {
  const { scene } = useGLTF("/models/Room.glb");

  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.userData.originalColor = child.material.color.clone();

        // Setup pointer event handlers
        child.onPointerDown = (e) => {
          e.stopPropagation(); // Prevent bubbling to canvas
          onClick(`Clicked on ${child.name || "volleyball"}`);
        };
        child.onPointerOver = () => {
          child.material.color.set("orange"); // Highlight on hover
          document.body.style.cursor = "pointer";
        };
        child.onPointerOut = () => {
          child.material.color.copy(child.userData.originalColor); // Reset color
          document.body.style.cursor = "auto";
        };
      }
    });
  }, [scene, onClick]);

  return <primitive object={scene} {...props} />;
}
