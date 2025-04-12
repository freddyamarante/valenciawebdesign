'use client'

import { clsx } from 'clsx'
import { useRef, useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { Canvas, extend, useFrame, useThree } from '@react-three/fiber'
import { vertexShader, fragmentShader } from '@/utils/shaders/shaders'
import colors from 'nice-color-palettes'

extend({
  ShaderMaterial: THREE.ShaderMaterial
})

const pallete = ["#c1b398", "#605951", "#fbeec2", "#61a6ab", "#accec0"].map(color => {
  const threeColor = new THREE.Color(color);
  threeColor.offsetHSL(0, 0, 0.1); // Slightly increase lightness
  return threeColor;
});

function Sketch() {
  const meshRef = useRef<THREE.Mesh>(null)
  const materialRef = useRef<THREE.ShaderMaterial>(null)
  const { size } = useThree()

  const uniforms = useMemo(() => ({
    time: { value: 0 },
    uColor: { value: pallete },
    resolution: { value: new THREE.Vector4(size.width, size.height, 1, 1) },
  }), [])

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = clock.getElapsedTime() * 0.01;
    }
  });

  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = 0;
    }

    console.log(pallete.map(color => `#${color.getHexString()}`))
  }, []);


  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[2, 2, 300, 300]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  )
}

export function GradientScene({ className, fov = 70 }: { className?: HTMLDivElement['className'], fov?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  return (
    <div className='w-full h-full'>
      <Canvas ref={canvasRef} camera={{ position: [0, 0, 0.2], fov: fov }} className={className} frameloop="always">
        <Sketch />
        <ambientLight intensity={0.5} />
        <directionalLight position={[0.5, 0, 0.866]} intensity={0.5} />
      </Canvas>
    </div>
  )
}

export function GradientBackground() {
  return (
    <div className="relative mx-auto max-w-7xl">
      <div
        className={clsx(
          'absolute -top-44 -right-60 h-60 w-[36rem] transform-gpu md:right-0',
          'bg-linear-115 from-[#fff1be] from-28% via-[#ee87cb] via-70% to-[#b060ff]',
          'rotate-[-10deg] rounded-full blur-3xl',
        )}
      />
    </div>
  )
}