"use client"

import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

interface FirefliesProps {
  count: number
}

export default function Fireflies({ count }: FirefliesProps) {
  const pointsRef = useRef<THREE.Points>(null)

  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      const i3 = i * 3

      // Random positions in the valley
      positions[i3] = (Math.random() - 0.5) * 30
      positions[i3 + 1] = Math.random() * 8 + 1
      positions[i3 + 2] = (Math.random() - 0.5) * 30

      // Warm firefly colors
      colors[i3] = 1 // R
      colors[i3 + 1] = 0.8 + Math.random() * 0.2 // G
      colors[i3 + 2] = 0.3 + Math.random() * 0.2 // B
    }

    return { positions, colors }
  }, [count])

  const material = useMemo(() => {
    return new THREE.PointsMaterial({
      size: 0.15,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    })
  }, [])

  useFrame((state) => {
    if (pointsRef.current && pointsRef.current.geometry.attributes.position) {
      const positions = pointsRef.current.geometry.attributes.position.array as Float32Array

      for (let i = 0; i < count; i++) {
        const i3 = i * 3

        // Gentle floating motion
        positions[i3 + 1] += Math.sin(state.clock.elapsedTime + i) * 0.002
        positions[i3] += Math.sin(state.clock.elapsedTime * 0.5 + i) * 0.001
        positions[i3 + 2] += Math.cos(state.clock.elapsedTime * 0.3 + i) * 0.001
      }

      pointsRef.current.geometry.attributes.position.needsUpdate = true
    }
  })

  return (
    <points ref={pointsRef} material={material}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={count} array={colors} itemSize={3} />
      </bufferGeometry>
    </points>
  )
}
