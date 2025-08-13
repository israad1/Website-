"use client"

import { useRef } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import { OrbitControls, Sky } from "@react-three/drei"
import type * as THREE from "three"
import Terrain from "./Terrain"
import Water from "./Water"
import Fireflies from "./Fireflies"
import Portal from "./Portal"

interface SceneProps {
  onPortalClick: (portal: string) => void
}

export default function Scene({ onPortalClick }: SceneProps) {
  const { camera } = useThree()

  // Set up lighting
  const ambientLight = useRef<THREE.AmbientLight>(null)
  const directionalLight = useRef<THREE.DirectionalLight>(null)

  useFrame((state) => {
    // Gentle camera movement for immersion
    if (camera) {
      camera.position.y += Math.sin(state.clock.elapsedTime * 0.5) * 0.002
    }
  })

  return (
    <>
      {/* Lighting */}
      <ambientLight ref={ambientLight} intensity={0.4} color="#ffa500" />
      <directionalLight
        ref={directionalLight}
        position={[10, 10, 5]}
        intensity={1.2}
        color="#ffaa44"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[0, 5, 0]} intensity={0.3} color="#ff6b35" />

      {/* Sky */}
      <Sky distance={450000} sunPosition={[10, 5, 0]} inclination={0.49} azimuth={0.25} turbidity={10} rayleigh={2} />

      {/* Terrain */}
      <Terrain />

      {/* Water */}
      <Water />

      {/* Fireflies */}
      <Fireflies count={20} />

      {/* Portal Gates */}
      <Portal position={[-8, 1, -5]} label="About" color="#4ade80" onClick={() => onPortalClick("About")} />
      <Portal position={[0, 1, -8]} label="Projects" color="#3b82f6" onClick={() => onPortalClick("Projects")} />
      <Portal position={[8, 1, -5]} label="Contact" color="#f59e0b" onClick={() => onPortalClick("Contact")} />

      {/* Camera Controls */}
      <OrbitControls
        enablePan={false}
        enableZoom={true}
        enableRotate={true}
        minDistance={5}
        maxDistance={25}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2.2}
        autoRotate={false}
        autoRotateSpeed={0.5}
      />
    </>
  )
}
