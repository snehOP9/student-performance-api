import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, Line, Sparkles } from '@react-three/drei'
import { Group, MathUtils } from 'three'
import { SceneShell } from './SceneShell'

type NodePosition = [number, number, number]

function NeuralCluster() {
  const groupRef = useRef<Group>(null)

  const nodes = useMemo<NodePosition[]>(
    () =>
      Array.from({ length: 24 }, (_, index) => {
        const side = index < 12 ? -1 : 1
        const localIndex = index % 12
        const angle = (localIndex / 12) * Math.PI * 2
        const radius = 1.05 + Math.sin(localIndex * 1.65) * 0.24

        return [
          side * 1.12 + Math.cos(angle) * radius * 0.72,
          Math.sin(angle * 1.4) * 0.92,
          Math.sin(angle) * radius,
        ] satisfies NodePosition
      }),
    [],
  )

  const bridgePairs = useMemo(
    () =>
      nodes.flatMap((node, index) => {
        const withinLobePair = nodes[(index + 3) % nodes.length]
        const crossLobePair = nodes[(index + 12) % nodes.length]
        return [
          [node, withinLobePair] as const,
          index % 2 === 0 ? ([node, crossLobePair] as const) : null,
        ].filter(Boolean) as Array<readonly [NodePosition, NodePosition]>
      }),
    [nodes],
  )

  const satellites = useMemo<NodePosition[]>(
    () => [
      [-2.8, -1.05, -0.45],
      [2.7, -1.15, 0.5],
      [-2.35, 1.32, 0.18],
      [2.15, 1.18, -0.2],
    ],
    [],
  )

  useFrame((state) => {
    if (!groupRef.current) return

    const elapsed = state.clock.getElapsedTime()
    groupRef.current.rotation.x = MathUtils.lerp(
      groupRef.current.rotation.x,
      state.pointer.y * 0.28,
      0.05,
    )
    groupRef.current.rotation.y = MathUtils.lerp(
      groupRef.current.rotation.y,
      state.pointer.x * 0.45 + elapsed * 0.12,
      0.05,
    )
    groupRef.current.position.y = MathUtils.lerp(
      groupRef.current.position.y,
      -0.18 + Math.sin(elapsed * 1.15) * 0.05,
      0.06,
    )
  })

  return (
    <group ref={groupRef} scale={1.28}>
      <Float speed={2.1} rotationIntensity={0.32} floatIntensity={0.45}>
        <mesh scale={[1.18, 1.1, 1.18]}>
          <icosahedronGeometry args={[1.2, 1]} />
          <meshStandardMaterial
            color="#6fd7ff"
            emissive="#5b8cff"
            emissiveIntensity={1.15}
            roughness={0.18}
            metalness={0.55}
            transparent
            opacity={0.96}
          />
        </mesh>
      </Float>

      <mesh position={[-0.44, 0.02, 0]} scale={[1.18, 1.38, 1.05]}>
        <sphereGeometry args={[0.78, 32, 32]} />
        <meshStandardMaterial
          color="#93c5fd"
          emissive="#38bdf8"
          emissiveIntensity={0.65}
          transparent
          opacity={0.42}
          roughness={0.14}
          metalness={0.4}
        />
      </mesh>
      <mesh position={[0.44, 0.02, 0]} scale={[1.18, 1.38, 1.05]}>
        <sphereGeometry args={[0.78, 32, 32]} />
        <meshStandardMaterial
          color="#c4b5fd"
          emissive="#8b5cf6"
          emissiveIntensity={0.62}
          transparent
          opacity={0.34}
          roughness={0.14}
          metalness={0.4}
        />
      </mesh>

      <mesh rotation={[0.48, 0.12, 0.3]}>
        <torusGeometry args={[2.35, 0.045, 32, 240]} />
        <meshBasicMaterial color="#67e8f9" transparent opacity={0.42} />
      </mesh>
      <mesh rotation={[-0.62, 0.42, 1.08]}>
        <torusGeometry args={[2.82, 0.035, 32, 240]} />
        <meshBasicMaterial color="#a78bfa" transparent opacity={0.28} />
      </mesh>
      <mesh rotation={[0.12, -0.34, -0.8]}>
        <torusGeometry args={[3.14, 0.025, 32, 240]} />
        <meshBasicMaterial color="#22d3ee" transparent opacity={0.16} />
      </mesh>

      {bridgePairs.map(([start, end], index) => (
        <Line
          key={`${start.join('-')}-${index}`}
          points={[start, end]}
          color={index % 3 === 0 ? '#67e8f9' : '#c4b5fd'}
          transparent
          opacity={index % 2 === 0 ? 0.26 : 0.18}
          lineWidth={1}
        />
      ))}

      {nodes.map((position, index) => (
        <Float
          key={`${position.join('-')}-${index}`}
          speed={1.45 + index * 0.02}
          rotationIntensity={0.16}
          floatIntensity={0.45}
        >
          <mesh position={position}>
            <sphereGeometry args={[0.1 + (index % 4) * 0.014, 20, 20]} />
            <meshStandardMaterial
              color={index % 2 === 0 ? '#7dd3fc' : '#ddd6fe'}
              emissive={index % 2 === 0 ? '#22d3ee' : '#8b5cf6'}
              emissiveIntensity={1.15}
              roughness={0.12}
              metalness={0.22}
            />
          </mesh>
        </Float>
      ))}

      {satellites.map((position, index) => (
        <Float key={`${position.join('-')}-satellite`} speed={1.2 + index * 0.12} floatIntensity={0.55}>
          <mesh position={position}>
            <sphereGeometry args={[0.12, 18, 18]} />
            <meshStandardMaterial
              color={index % 2 === 0 ? '#67e8f9' : '#a78bfa'}
              emissive={index % 2 === 0 ? '#22d3ee' : '#8b5cf6'}
              emissiveIntensity={1.05}
            />
          </mesh>
        </Float>
      ))}

      <Sparkles
        count={180}
        size={4.2}
        speed={0.42}
        opacity={0.92}
        color="#e0f2fe"
        scale={[10.5, 7.2, 7.2]}
      />
    </group>
  )
}

export function NeuralHeroScene({ className }: { className?: string }) {
  return (
    <SceneShell className={className} cameraPosition={[0, 0.02, 5.2]} fov={40}>
      <ambientLight intensity={0.85} />
      <directionalLight position={[4, 4, 4]} intensity={1.8} color="#67e8f9" />
      <directionalLight position={[-4, -2, 3]} intensity={1.35} color="#a78bfa" />
      <pointLight position={[0, 0, 3]} intensity={2.8} color="#38bdf8" />
      <pointLight position={[0, -2.5, 2]} intensity={1.3} color="#22d3ee" />
      <NeuralCluster />
    </SceneShell>
  )
}
