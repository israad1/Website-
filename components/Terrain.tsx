"use client"

import { useRef, useMemo } from "react"
import * as THREE from "three"

export default function Terrain() {
  const meshRef = useRef<THREE.Mesh>(null)

  // Generate terrain geometry with noise
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(40, 40, 64, 64)
    const positions = geo.attributes.position.array as Float32Array

    // Apply noise to create terrain
    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i]
      const z = positions[i + 2]

      // Multiple octaves of noise for realistic terrain
      let height = 0
      height += Math.sin(x * 0.1) * 0.5
      height += Math.sin(z * 0.1) * 0.5
      height += Math.sin(x * 0.05 + z * 0.05) * 1
      height += Math.sin(x * 0.02) * 2
      height += Math.sin(z * 0.02) * 2
      height += Math.random() * 0.1 // Subtle noise

      positions[i + 1] = height
    }

    geo.computeVertexNormals()
    return geo
  }, [])

  // Create material with gradient colors
  const material = useMemo(() => {
    return new THREE.MeshLambertMaterial({
      color: "#4a5d23",
      wireframe: false,
    })
  }, [])

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      material={material}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -2, 0]}
      receiveShadow
    />
  )
}
