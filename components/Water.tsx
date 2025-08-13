"use client"

import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

export default function Water() {
  const meshRef = useRef<THREE.Mesh>(null)

  // Water shader material
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        color: { value: new THREE.Color("#1e40af") },
        opacity: { value: 0.8 },
      },
      vertexShader: `
        uniform float time;
        varying vec2 vUv;
        varying vec3 vPosition;
        
        void main() {
          vUv = uv;
          vPosition = position;
          
          vec3 pos = position;
          pos.z += sin(pos.x * 2.0 + time) * 0.1;
          pos.z += sin(pos.y * 1.5 + time * 1.2) * 0.05;
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec3 color;
        uniform float opacity;
        varying vec2 vUv;
        varying vec3 vPosition;
        
        void main() {
          vec2 uv = vUv;
          
          // Create ripple effect
          float ripple = sin(length(uv - 0.5) * 10.0 - time * 2.0) * 0.1;
          
          // Add some shimmer
          float shimmer = sin(uv.x * 20.0 + time) * sin(uv.y * 20.0 + time) * 0.1;
          
          vec3 finalColor = color + vec3(ripple + shimmer);
          
          gl_FragColor = vec4(finalColor, opacity);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
    })
  }, [])

  useFrame((state) => {
    if (material.uniforms) {
      material.uniforms.time.value = state.clock.elapsedTime
    }
  })

  return (
    <mesh ref={meshRef} material={material} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.8, 0]}>
      <planeGeometry args={[20, 20, 32, 32]} />
    </mesh>
  )
}
