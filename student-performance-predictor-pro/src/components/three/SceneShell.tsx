import { Suspense, type ReactNode } from 'react'
import { Canvas } from '@react-three/fiber'
import { cn } from '../../lib/utils'

type SceneShellProps = {
  children: ReactNode
  className?: string
  cameraPosition?: [number, number, number]
  fov?: number
}

export function SceneShell({
  children,
  className,
  cameraPosition = [0, 0, 6],
  fov = 45,
}: SceneShellProps) {
  return (
    <div
      className={cn(
        'group relative isolate h-full overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/70 shadow-[0_30px_120px_-45px_rgba(56,189,248,0.55)] backdrop-blur-2xl',
        className,
      )}
    >
      <Canvas
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        camera={{ position: cameraPosition, fov }}
      >
        <Suspense fallback={null}>{children}</Suspense>
      </Canvas>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.16),transparent_36%),radial-gradient(circle_at_bottom,rgba(139,92,246,0.14),transparent_42%)]" />
      <div className="pointer-events-none absolute inset-[1px] rounded-[calc(2rem-1px)] border border-white/6" />
    </div>
  )
}
