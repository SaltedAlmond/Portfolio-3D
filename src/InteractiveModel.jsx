import { useThree, useFrame } from "@react-three/fiber"
import { useRef } from "react"
import * as THREE from "three"

export default function InteractiveModel({ scene, onSelect }) {
  const raycaster = useRef(new THREE.Raycaster())
  const hovered = useRef(null)
  const originalScales = useRef(new Map())
  const { camera, pointer } = useThree()

  useFrame(() => {
    raycaster.current.setFromCamera(pointer, camera)
    const intersects = raycaster.current.intersectObjects(scene.children, true)

    const obj = intersects.find(i => i.object.name.toUpperCase().includes("MAJORA"))?.object

    scene.traverse((child) => {
      if (child.isMesh) {
        if (!originalScales.current.has(child)) {
          originalScales.current.set(child, child.scale.clone())
        }

        const original = originalScales.current.get(child)
        const targetScale = (obj === child) ? original.clone().multiplyScalar(1.2) : original

        child.scale.lerp(targetScale, 0.1)
      }
    })

    hovered.current = obj || null
  })

  return (
    <primitive
      object={scene}
      onClick={(e) => {
        e.stopPropagation()
        if (hovered.current) {
          onSelect(`You clicked on: ${hovered.current.name}`)
        }
      }}
    />
  )
}
