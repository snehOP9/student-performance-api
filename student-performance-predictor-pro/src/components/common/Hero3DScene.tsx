import { useEffect, useRef } from 'react'
import * as THREE from 'three'

function isLowPowerDevice() {
  if (typeof window === 'undefined') return false
  const narrowViewport = window.innerWidth < 900
  const lowCpu = navigator.hardwareConcurrency !== undefined && navigator.hardwareConcurrency <= 4
  return narrowViewport || lowCpu
}

export function Hero3DScene() {
  const mountRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const lowPower = isLowPowerDevice()

    const scene = new THREE.Scene()
    const width = mount.clientWidth
    const height = mount.clientHeight

    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 120)
    camera.position.set(0, 0.2, 5.4)

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: !lowPower })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, lowPower ? 1.25 : 2))
    mount.appendChild(renderer.domElement)

    scene.add(new THREE.AmbientLight('#dbeafe', 0.7))

    const keyLight = new THREE.DirectionalLight('#22d3ee', 1.0)
    keyLight.position.set(3, 2, 4)
    scene.add(keyLight)

    const rimLight = new THREE.DirectionalLight('#8b5cf6', 0.8)
    rimLight.position.set(-3, -2, -3)
    scene.add(rimLight)

    const group = new THREE.Group()
    scene.add(group)

    const core = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.1, 1),
      new THREE.MeshStandardMaterial({
        color: '#22d3ee',
        emissive: '#0ea5e9',
        emissiveIntensity: 0.25,
        metalness: 0.25,
        roughness: 0.3,
      }),
    )
    group.add(core)

    const wireShell = new THREE.LineSegments(
      new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(1.45, 1)),
      new THREE.LineBasicMaterial({ color: '#a78bfa', transparent: true, opacity: 0.5 }),
    )
    group.add(wireShell)

    const ringA = new THREE.Mesh(
      new THREE.TorusGeometry(2.0, 0.03, 18, 180),
      new THREE.MeshBasicMaterial({ color: '#22d3ee', transparent: true, opacity: 0.35 }),
    )
    ringA.rotation.x = Math.PI / 2
    group.add(ringA)

    const ringB = new THREE.Mesh(
      new THREE.TorusGeometry(2.35, 0.02, 16, 180),
      new THREE.MeshBasicMaterial({ color: '#8b5cf6', transparent: true, opacity: 0.28 }),
    )
    ringB.rotation.set(Math.PI / 3.2, 0, Math.PI / 5)
    group.add(ringB)

    const particleCount = lowPower ? 80 : 180
    const particleGeometry = new THREE.BufferGeometry()
    const positions = new Float32Array(particleCount * 3)

    for (let index = 0; index < particleCount * 3; index += 3) {
      const radius = 5.4 + Math.random() * 1.8
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)

      positions[index] = radius * Math.sin(phi) * Math.cos(theta)
      positions[index + 1] = radius * Math.sin(phi) * Math.sin(theta)
      positions[index + 2] = radius * Math.cos(phi)
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    const particles = new THREE.Points(
      particleGeometry,
      new THREE.PointsMaterial({
        color: '#e2e8f0',
        size: lowPower ? 0.03 : 0.04,
        transparent: true,
        opacity: 0.55,
      }),
    )
    scene.add(particles)

    const pointerTarget = { x: 0, y: 0 }
    const onPointerMove = (event: PointerEvent) => {
      const rect = mount.getBoundingClientRect()
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      const y = -((event.clientY - rect.top) / rect.height) * 2 + 1
      pointerTarget.x = x * 0.35
      pointerTarget.y = y * 0.25
    }

    mount.addEventListener('pointermove', onPointerMove)

    let raf = 0
    const clock = new THREE.Clock()

    const animate = () => {
      const elapsed = clock.getElapsedTime()

      if (!reducedMotion) {
        group.rotation.y += (pointerTarget.x + elapsed * 0.04 - group.rotation.y) * 0.04
        group.rotation.x += (pointerTarget.y - group.rotation.x) * 0.04
        core.rotation.y += 0.003
        core.rotation.x += 0.0012
        wireShell.rotation.x -= 0.002
        ringA.rotation.z += 0.0016
        ringB.rotation.x -= 0.0013
        particles.rotation.y = elapsed * 0.012
      }

      renderer.render(scene, camera)
      raf = requestAnimationFrame(animate)
    }

    animate()

    const onResize = () => {
      const nextWidth = mount.clientWidth
      const nextHeight = mount.clientHeight
      camera.aspect = nextWidth / nextHeight
      camera.updateProjectionMatrix()
      renderer.setSize(nextWidth, nextHeight)
    }

    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      mount.removeEventListener('pointermove', onPointerMove)

      particleGeometry.dispose()
      ;(particles.material as THREE.Material).dispose()
      core.geometry.dispose()
      ;(core.material as THREE.Material).dispose()
      wireShell.geometry.dispose()
      ;(wireShell.material as THREE.Material).dispose()
      ringA.geometry.dispose()
      ;(ringA.material as THREE.Material).dispose()
      ringB.geometry.dispose()
      ;(ringB.material as THREE.Material).dispose()
      renderer.dispose()

      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement)
      }
    }
  }, [])

  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl border border-white/10 bg-slate-900/40">
      <div className="pointer-events-none absolute left-3 top-3 z-10 rounded-full border border-cyan-300/30 bg-cyan-400/10 px-3 py-1 text-[11px] font-semibold text-cyan-200">
        Live 3D Intelligence Orbit
      </div>
      <div ref={mountRef} className="h-full w-full" aria-label="Interactive 3D risk scene" />
    </div>
  )
}
