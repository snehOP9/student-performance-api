import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Grid, Sparkles } from '@react-three/drei'
import { Group, MathUtils } from 'three'

function AmbientField() {
  const groupRef = useRef<Group>(null)

  const orbs = useMemo(
    () =>
      Array.from({ length: 8 }, (_, index) => ({
        position: [
          (index - 3.5) * 1.1,
          Math.sin(index * 1.4) * 0.75,
          -1.4 + Math.cos(index * 0.8),
        ] as [number, number, number],
        scale: 0.22 + (index % 3) * 0.08,
        color: index % 2 === 0 ? '#38bdf8' : '#8b5cf6',
      })),
    [],
  )

  useFrame((state) => {
    if (!groupRef.current) return
    const elapsed = state.clock.getElapsedTime()
    groupRef.current.rotation.y = MathUtils.lerp(groupRef.current.rotation.y, elapsed * 0.08, 0.03)
    groupRef.current.position.y = Math.sin(elapsed * 0.65) * 0.1
  })

  return (
    <group ref={groupRef}>
      {orbs.map((orb, index) => (
        <mesh key={`${orb.position.join('-')}-${index}`} position={orb.position} scale={orb.scale}>
          <sphereGeometry args={[1, 24, 24]} />
          <meshStandardMaterial
            color={orb.color}
            emissive={orb.color}
            emissiveIntensity={1.2}
            transparent
            opacity={0.68}
            roughness={0.1}
            metalness={0.45}
          />
        </mesh>
      ))}
    </group>
  )
}

export function DashboardAmbientScene() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-20 opacity-85">
      <Canvas dpr={[1, 2]} camera={{ position: [0, 1.2, 8], fov: 48 }}>
        <ambientLight intensity={0.45} />
        <directionalLight position={[5, 6, 4]} intensity={0.95} color="#67e8f9" />
        <directionalLight position={[-4, 4, 2]} intensity={0.75} color="#8b5cf6" />
        <Grid
          position={[0, -1.8, -2]}
          infiniteGrid
          fadeDistance={22}
          fadeStrength={1.9}
          cellSize={0.45}
          cellThickness={0.45}
          sectionSize={2.4}
          sectionThickness={1.2}
          cellColor="#0f2740"
          sectionColor="#173b63"
        />
        <AmbientField />
        <Sparkles count={80} size={3.5} speed={0.25} opacity={0.35} color="#cbd5f5" scale={[12, 8, 8]} />
      </Canvas>
    </div>
  )
}
