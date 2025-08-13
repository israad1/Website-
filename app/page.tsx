"use client"

import { Canvas } from "@react-three/fiber"
import { Suspense, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import Scene from "@/components/Scene"

export default function HomePage() {
  const [activePortal, setActivePortal] = useState<string | null>(null)

  const portalContent = {
    About: {
      title: "About Me",
      content:
        "I'm a passionate developer who loves creating immersive digital experiences. With expertise in React, Three.js, and modern web technologies, I bring ideas to life through code and creativity.",
    },
    Projects: {
      title: "My Projects",
      content:
        "Explore my collection of interactive web applications, 3D experiences, and innovative solutions. Each project represents a unique challenge solved with cutting-edge technology and thoughtful design.",
    },
    Contact: {
      title: "Get In Touch",
      content:
        "Ready to collaborate? I'd love to hear about your next project. Whether it's a complex web application or an immersive 3D experience, let's create something amazing together.",
    },
  }

  return (
    <div className="w-full h-screen relative overflow-hidden">
      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 5, 10], fov: 60 }}
        className="w-full h-full"
        gl={{ antialias: true, alpha: false }}
      >
        <Suspense fallback={null}>
          <Scene onPortalClick={setActivePortal} />
        </Suspense>
      </Canvas>

      {/* Loading Screen */}
      <div className="absolute inset-0 bg-gradient-to-b from-orange-200 to-purple-300 flex items-center justify-center pointer-events-none opacity-0 animate-fade-out">
        <div className="text-2xl font-bold text-white">Loading Valley...</div>
      </div>

      {/* Portal Overlays */}
      <AnimatePresence>
        {activePortal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setActivePortal(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 max-w-md w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-white">
                  {portalContent[activePortal as keyof typeof portalContent].title}
                </h2>
                <button
                  onClick={() => setActivePortal(null)}
                  className="text-white/70 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
                >
                  <X size={20} />
                </button>
              </div>
              <p className="text-white/90 leading-relaxed">
                {portalContent[activePortal as keyof typeof portalContent].content}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* UI Instructions */}
      <div className="absolute bottom-4 left-4 text-white/70 text-sm">
        <p>Click and drag to explore • Scroll to zoom</p>
      </div>
    </div>
  )
}
