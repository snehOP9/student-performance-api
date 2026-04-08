import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Group } from 'three'
import { SceneShell } from './SceneShell'

function OrbitLoader() {
  const groupRef = useRef<Group>(null)

  useFrame((state) => {
    if (!groupRef.current) return
    const elapsed = state.clock.getElapsedTime()
    groupRef.current.rotation.z = elapsed * 1.8
    groupRef.current.rotation.x = Math.sin(elapsed * 1.4) * 0.25
  })

  return (
    <group ref={groupRef}>
      <mesh>
        <torusGeometry args={[1.1, 0.05, 24, 160]} />
        <meshBasicMaterial color="#38bdf8" />
      </mesh>
      <mesh rotation={[0.8, 0.4, 1.2]}>
        <torusGeometry args={[1.45, 0.035, 24, 160]} />
        <meshBasicMaterial color="#c084fc" transparent opacity={0.55} />
      </mesh>
      <mesh position={[1.1, 0, 0]}>
        <sphereGeometry args={[0.12, 18, 18]} />
        <meshStandardMaterial color="#dbeafe" emissive="#38bdf8" emissiveIntensity={1.4} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.26, 18, 18]} />
        <meshStandardMaterial color="#dbeafe" emissive="#22d3ee" emissiveIntensity={0.6} />
      </mesh>
    </group>
  )
}

export function OrbitLoaderScene({ className }: { className?: string }) {
  return (
    <SceneShell className={className} cameraPosition={[0, 0, 4.2]} fov={38}>
      <ambientLight intensity={0.75} />
      <pointLight position={[0, 0, 3]} intensity={2.5} color="#38bdf8" />
      <OrbitLoader />
    </SceneShell>
  )
}
