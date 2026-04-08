import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, Sparkles } from '@react-three/drei'
import { Group } from 'three'
import { SceneShell } from './SceneShell'

function resolveRiskColor(risk: number) {
  if (risk >= 65) return '#fb7185'
  if (risk >= 40) return '#facc15'
  return '#34d399'
}

function RiskRing({ risk }: { risk: number }) {
  const groupRef = useRef<Group>(null)
  const color = resolveRiskColor(risk)
  const glow = useMemo(() => Math.max(0.8, risk / 55), [risk])

  useFrame((state) => {
    if (!groupRef.current) return
    const elapsed = state.clock.getElapsedTime()
    groupRef.current.rotation.z = elapsed * 0.12
    groupRef.current.rotation.x = Math.sin(elapsed * 0.4) * 0.08
  })

  return (
    <group ref={groupRef}>
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.45}>
        <group rotation={[0, 0, -Math.PI / 2]}>
          <mesh>
            <torusGeometry args={[1.7, 0.14, 42, 220]} />
            <meshStandardMaterial color="#0f172a" emissive="#0f172a" emissiveIntensity={0.35} />
          </mesh>
          <mesh>
            <torusGeometry args={[1.7, 0.14, 42, 220, (Math.PI * 2 * risk) / 100]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={glow}
              roughness={0.15}
              metalness={0.65}
            />
          </mesh>
        </group>
      </Float>

      {[0, 1, 2].map((index) => (
        <mesh
          key={index}
          rotation={[index * 0.55, index * 0.28, index * 0.42]}
          scale={1 + index * 0.1}
        >
          <torusGeometry args={[1.95 + index * 0.22, 0.025, 24, 180]} />
          <meshBasicMaterial color={color} transparent opacity={0.22 - index * 0.04} />
        </mesh>
      ))}

      <mesh>
        <sphereGeometry args={[0.48, 32, 32]} />
        <meshStandardMaterial color="#dbeafe" emissive={color} emissiveIntensity={0.55} metalness={0.35} roughness={0.25} />
      </mesh>

      <Sparkles
        count={80}
        size={3.6}
        speed={0.5}
        opacity={0.9}
        color={color}
        scale={[5.5, 5.5, 5.5]}
      />
    </group>
  )
}

export function RiskGaugeScene({ risk }: { risk: number }) {
  return (
    <SceneShell className="min-h-[22rem]" cameraPosition={[0, 0, 5.8]} fov={40}>
      <ambientLight intensity={0.8} />
      <directionalLight position={[4, 4, 4]} intensity={1.5} color="#ffffff" />
      <pointLight position={[0, 0, 3]} intensity={3.2} color={resolveRiskColor(risk)} />
      <RiskRing risk={risk} />
    </SceneShell>
  )
}
