"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import type { MotionValue } from "framer-motion";
import * as THREE from "three";

import { latLngToVector3 } from "@/lib/geo";

type GlobeCanvasProps = {
  mode: "full" | "lite";
  progress: MotionValue<number>;
};

const SUN_DIRECTION = new THREE.Vector3(5, 3, 5);

// A few regions that softly glow (warm amber) and rotate with the globe.
const GLOW_REGIONS: Array<{ lat: number; lng: number; color: string; scale: number }> = [
  { lat: 39, lng: -98, color: "#ffd27a", scale: 0.26 }, // North America
  { lat: -14, lng: -55, color: "#ffb84d", scale: 0.22 }, // South America
  { lat: 50, lng: 10, color: "#ffdf9a", scale: 0.2 }, // Europe
  { lat: 6, lng: 21, color: "#ffc457", scale: 0.24 }, // Africa
  { lat: 24, lng: 80, color: "#ffce6b", scale: 0.22 }, // South Asia
  { lat: 36, lng: 113, color: "#ffd584", scale: 0.24 }, // East Asia
  { lat: -25, lng: 134, color: "#ffbe5c", scale: 0.18 }, // Australia
];

function makeGlowTexture() {
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, "rgba(255,255,255,1)");
  gradient.addColorStop(0.35, "rgba(255,255,255,0.55)");
  gradient.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function GlowRegion({
  position,
  color,
  scale,
  phase,
  texture,
}: {
  position: [number, number, number];
  color: string;
  scale: number;
  phase: number;
  texture: THREE.Texture;
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const material = ref.current.material as THREE.MeshBasicMaterial;
    material.opacity = 0.4 + 0.32 * Math.sin(state.clock.elapsedTime * 1.4 + phase);
  });

  return (
    <mesh
      ref={ref}
      position={position}
      scale={scale}
      onUpdate={(self) => self.lookAt(0, 0, 0)}
    >
      <circleGeometry args={[1, 32]} />
      <meshBasicMaterial
        map={texture}
        color={color}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        side={THREE.DoubleSide}
        toneMapped={false}
      />
    </mesh>
  );
}

function Atmosphere() {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        side: THREE.BackSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
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

  const glowTexture = useMemo(() => makeGlowTexture(), []);

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

      {GLOW_REGIONS.map((region, index) => (
        <GlowRegion
          key={`${region.lat}-${region.lng}`}
          position={latLngToVector3(region.lat, region.lng, 1.012)}
          color={region.color}
          scale={region.scale}
          phase={index * 1.1}
          texture={glowTexture}
        />
      ))}
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
