import { useGLTF } from '@react-three/drei'
import { useEffect } from 'react'

useGLTF.preload('/models/Room.glb')

export default function Model({ onClick, ...props }) {
  const gltf = useGLTF('/models/Room.glb')

  // Assign click handlers to meshes
  useEffect(() => {
    gltf.scene.traverse((child) => {
      if (child.isMesh) {
        child.userData.info = `Info about ${child.name}` // add info
        child.onClick = (e) => {
          e.stopPropagation()
          if (onClick) onClick(child.userData.info)
        }
      }
    })
  }, [gltf, onClick])

  return <primitive object={gltf.scene} {...props} />
}
