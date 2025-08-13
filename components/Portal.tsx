"use client"

import { useRef, useState, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import { Html } from "@react-three/drei"
import * as THREE from "three"
import { motion } from "framer-motion"

interface PortalProps {
  position: [number, number, number]
  label: string
  color: string
  onClick: () => void
}

export default function Portal({ position, label, color, onClick }: PortalProps) {
  const groupRef = useRef<THREE.Group>(null)
  const ringRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)

  const ringMaterial = useMemo(() => {
    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(color),
      transparent: true,
      opacity: 0.8,
      roughness: 0.1,
      metalness: 0.1,
    })
    material.emissive = new THREE.Color(color)
    material.emissiveIntensity = 0.3
    return material
  }, [color])

  const glowMaterial = useMemo(() => {
    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(color),
      transparent: true,
      opacity: 0.2,
      side: THREE.DoubleSide,
    })
    material.emissive = new THREE.Color(color)
    material.emissiveIntensity = 0.1
    return material
  }, [color])

  const particleMaterial = useMemo(() => {
    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(color),
      transparent: true,
      opacity: 0.6,
      roughness: 0.1,
      metalness: 0.1,
    })
    material.emissive = new THREE.Color(color)
    material.emissiveIntensity = 0.5
    return material
  }, [color])

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.5
    }

    if (ringRef.current) {
      ringRef.current.rotation.z = state.clock.elapsedTime * 2
      ringRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 3) * 0.1)
    }
  })

  return (
    <group position={position}>
      {/* Portal Ring */}
      <group ref={groupRef}>
        <mesh
          ref={ringRef}
          material={ringMaterial}
          onClick={onClick}
          onPointerEnter={() => setHovered(true)}
          onPointerLeave={() => setHovered(false)}
        >
          <torusGeometry args={[1.5, 0.1, 8, 32]} />
        </mesh>

        {/* Inner glow */}
        <mesh material={glowMaterial}>
          <circleGeometry args={[1.4]} />
        </mesh>

        {/* Particles around portal */}
        {Array.from({ length: 8 }).map((_, i) => (
          <mesh
            key={i}
            position={[Math.cos((i / 8) * Math.PI * 2) * 2, Math.sin((i / 8) * Math.PI * 2) * 2, 0]}
            material={particleMaterial}
          >
            <sphereGeometry args={[0.05]} />
          </mesh>
        ))}
      </group>

      {/* Label */}
      <Html position={[0, -2.5, 0]} center distanceFactor={10} occlude>
        <motion.div
          className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-4 py-2 cursor-pointer select-none"
          whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.15)" }}
          whileTap={{ scale: 0.95 }}
          onClick={onClick}
          style={{
            boxShadow: `0 8px 32px ${color}40`,
          }}
        >
          <span className="text-white font-medium text-lg">{label}</span>
        </motion.div>
      </Html>
    </group>
  )
}
