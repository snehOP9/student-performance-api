import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, Grid, Line, Sparkles } from '@react-three/drei'
import { Group, MathUtils } from 'three'
import { SceneShell } from './SceneShell'

type AnalyticsPillarsSceneProps = {
  values: number[]
}

const analyticsPalette = ['#38bdf8', '#7dd3fc', '#c084fc', '#22d3ee', '#818cf8']

function Pillars({ values }: AnalyticsPillarsSceneProps) {
  const groupRef = useRef<Group>(null)
  const count = values.length
  const spacing = useMemo(() => {
    if (count <= 1) return 0
    // Keep all pillars visible even with 7+ points.
    return Math.min(0.9, 3.8 / (count - 1))
  }, [count])

  const pillarWidth = useMemo(
    () => Math.max(0.22, Math.min(0.42, spacing * 0.58 || 0.42)),
    [spacing],
  )

  const points = useMemo(
    () =>
      values.map((value, index) => {
        const height = MathUtils.clamp(value / 26, 1.15, 3.7)
        const x = (index - (values.length - 1) / 2) * spacing
        return { x, height, color: analyticsPalette[index % analyticsPalette.length] }
      }),
    [spacing, values],
  )

  useFrame((state) => {
    if (!groupRef.current) return
    const targetYaw = state.pointer.x * 0.22
    const targetPitch = state.pointer.y * 0.08

    groupRef.current.rotation.y = MathUtils.lerp(
      groupRef.current.rotation.y,
      targetYaw,
      0.06,
    )
    groupRef.current.rotation.x = MathUtils.lerp(
      groupRef.current.rotation.x,
      targetPitch,
      0.06,
    )
  })

  return (
    <group ref={groupRef}>
      {points.map((point, index) => (
        <Float key={`${point.x}-${point.height}`} speed={1.4 + index * 0.1} floatIntensity={0.25}>
          <mesh position={[point.x, point.height / 2 - 1.05, 0]}>
            <boxGeometry args={[pillarWidth, point.height, pillarWidth]} />
            <meshStandardMaterial
              color={point.color}
              emissive={point.color}
              emissiveIntensity={0.95}
              roughness={0.18}
              metalness={0.55}
            />
          </mesh>
        </Float>
      ))}

      <Line
        points={points.map((point) => [point.x, point.height - 1.05, 0])}
        color="#cbd5f5"
        transparent
        opacity={0.45}
        lineWidth={1.1}
      />
    </group>
  )
}

export function AnalyticsPillarsScene({ values }: AnalyticsPillarsSceneProps) {
  return (
    <SceneShell className="min-h-[20rem]" cameraPosition={[0, 0.6, 7.4]} fov={44}>
      <ambientLight intensity={0.65} />
      <directionalLight position={[4, 5, 4]} intensity={1.35} color="#67e8f9" />
      <directionalLight position={[-3, 2, 3]} intensity={0.85} color="#a78bfa" />
      <Grid
        position={[0, -1.5, -1]}
        cellSize={0.55}
        sectionSize={2.2}
        fadeDistance={14}
        infiniteGrid
        cellColor="#163255"
        sectionColor="#26486f"
      />
      <Pillars values={values} />
      <Sparkles count={60} size={3} speed={0.35} opacity={0.5} color="#dbeafe" scale={[8, 5, 4]} />
    </SceneShell>
  )
}
