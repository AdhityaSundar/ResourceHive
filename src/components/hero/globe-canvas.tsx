"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import type { MotionValue } from "framer-motion";
import * as THREE from "three";

type GlobeCanvasProps = {
  mode: "full" | "lite";
  progress: MotionValue<number>;
};

const SUN_DIRECTION = new THREE.Vector3(5, 3, 5);

function Atmosphere() {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        side: THREE.BackSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        // Warm amber rim glow to sit on the honey backdrop.
        uniforms: { uColor: { value: new THREE.Color("#f4be4e") } },
        vertexShader: `
          varying vec3 vNormal;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          varying vec3 vNormal;
          uniform vec3 uColor;
          void main() {
            float intensity = pow(0.72 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.2);
            gl_FragColor = vec4(uColor, 1.0) * intensity;
          }
        `,
      }),
    [],
  );

  return (
    <mesh scale={1.16} material={material}>
      <sphereGeometry args={[1, 48, 48]} />
    </mesh>
  );
}

function Earth({ mode, progress }: GlobeCanvasProps) {
  const groupRef = useRef<THREE.Group>(null);
  const cloudRef = useRef<THREE.Mesh>(null);
  const prevProgress = useRef(0);

  const [dayMap, normalMap, specMap, cloudMap] = useLoader(THREE.TextureLoader, [
    "/textures/earth_atmos_2048.jpg",
    "/textures/earth_normal_2048.jpg",
    "/textures/earth_specular_2048.jpg",
    "/textures/earth_clouds_1024.png",
  ]);

  useEffect(() => {
    dayMap.colorSpace = THREE.SRGBColorSpace;
    dayMap.anisotropy = 4;
  }, [dayMap]);

  const segments = mode === "lite" ? 36 : 72;

  useFrame((_, delta) => {
    const group = groupRef.current;
    if (!group) return;

    const p = progress.get();
    const dProgress = p - prevProgress.current;
    prevProgress.current = p;

    const dt = Math.min(delta, 0.05);

    // Idle spin + scroll coupling ("scrolling turns the world"). Always rotating.
    group.rotateY(dt * 0.06 + dProgress * 4.2);
    group.rotation.x = 0.16 * Math.sin(performance.now() * 0.00004);

    if (cloudRef.current) cloudRef.current.rotation.y += dt * 0.012;
  });

  return (
    <group ref={groupRef}>
      <mesh>
        <sphereGeometry args={[1, segments, segments]} />
        <meshStandardMaterial
          map={dayMap}
          normalMap={mode === "full" ? normalMap : undefined}
          roughnessMap={specMap}
          roughness={0.86}
          metalness={0.1}
        />
      </mesh>

      {mode === "full" ? (
        <mesh ref={cloudRef}>
          <sphereGeometry args={[1.012, segments, segments]} />
          <meshStandardMaterial map={cloudMap} transparent opacity={0.38} depthWrite={false} />
        </mesh>
      ) : null}
    </group>
  );
}

export function GlobeCanvas(props: GlobeCanvasProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 3], fov: 42 }}
      dpr={props.mode === "full" ? [1, 2] : [1, 1.3]}
      gl={{ alpha: true, antialias: props.mode === "full" }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.7} />
      <directionalLight position={SUN_DIRECTION} intensity={1.5} />
      <Atmosphere />
      <Suspense fallback={null}>
        <Earth {...props} />
      </Suspense>
    </Canvas>
  );
}
