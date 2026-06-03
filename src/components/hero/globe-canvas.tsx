"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import type { MotionValue } from "framer-motion";
import * as THREE from "three";

import { distanceKm, latLngToVector3, type GlobeMarker } from "@/lib/geo";

export type UserPos = { lat: number; lng: number } | null;

type GlobeCanvasProps = {
  mode: "full" | "lite";
  markers: GlobeMarker[];
  progress: MotionValue<number>;
  userPos: UserPos;
  onSelectCity: (href: string) => void;
};

const SUN_DIRECTION = new THREE.Vector3(5, 3, 5);

function Marker({
  marker,
  emphasized,
  isUser,
  onSelectCity,
}: {
  marker: GlobeMarker;
  emphasized: boolean;
  isUser: boolean;
  onSelectCity: (href: string) => void;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const position = useMemo(
    () => latLngToVector3(marker.lat, marker.lng, 1.02),
    [marker.lat, marker.lng],
  );
  const color = isUser ? "#0e7c86" : "#efa417";

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    const base = emphasized || isUser ? 1.5 : 1;
    ref.current.scale.setScalar(base * (1 + 0.2 * Math.sin(t * 3 + marker.lat)));
  });

  return (
    <group position={position}>
      {/* soft glow halo */}
      <mesh scale={emphasized || isUser ? 0.06 : 0.045}>
        <sphereGeometry args={[1, 12, 12]} />
        <meshBasicMaterial color={color} transparent opacity={0.18} depthWrite={false} />
      </mesh>
      <mesh
        ref={ref}
        onClick={(event) => {
          event.stopPropagation();
          onSelectCity(marker.href);
        }}
        onPointerOver={(event) => {
          event.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = "auto";
        }}
      >
        <sphereGeometry args={[0.02, 14, 14]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
      {hovered ? (
        <Html center distanceFactor={6} style={{ pointerEvents: "none" }}>
          <div className="-translate-y-8 whitespace-nowrap rounded-full border border-white/15 bg-[#07212a]/90 px-3 py-1 text-xs font-semibold text-white shadow-lg backdrop-blur">
            {isUser ? "You are here" : `${marker.label} · ${marker.count} resources`}
          </div>
        </Html>
      ) : null}
    </group>
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
        uniforms: { uColor: { value: new THREE.Color("#5fb8bc") } },
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

function Earth({ mode, markers, progress, userPos, onSelectCity }: GlobeCanvasProps) {
  const groupRef = useRef<THREE.Group>(null);
  const cloudRef = useRef<THREE.Mesh>(null);
  const prevProgress = useRef(0);
  const centering = useRef(false);

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

  const targetQuat = useMemo(() => {
    if (!userPos) return null;
    const dir = new THREE.Vector3(...latLngToVector3(userPos.lat, userPos.lng, 1)).normalize();
    return new THREE.Quaternion().setFromUnitVectors(dir, new THREE.Vector3(0, 0, 1));
  }, [userPos]);

  useEffect(() => {
    if (userPos) centering.current = true;
  }, [userPos]);

  useFrame((_, delta) => {
    const group = groupRef.current;
    if (!group) return;

    const p = progress.get();
    const dProgress = p - prevProgress.current;
    prevProgress.current = p;

    const dt = Math.min(delta, 0.05);

    if (centering.current && targetQuat) {
      // Smooth fly-to centering on the user's location.
      group.quaternion.slerp(targetQuat, Math.min(dt * 2, 1));
      if (group.quaternion.angleTo(targetQuat) < 0.03) centering.current = false;
    } else {
      // Idle spin + scroll coupling ("scrolling turns the world"). Always rotating.
      group.rotateY(dt * 0.06 + dProgress * 4.2);
      if (!userPos) {
        group.rotation.x = 0.16 * Math.sin(performance.now() * 0.00004);
      }
    }

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
          <meshStandardMaterial
            map={cloudMap}
            transparent
            opacity={0.38}
            depthWrite={false}
          />
        </mesh>
      ) : null}

      {markers.map((marker) => {
        const emphasized = userPos
          ? distanceKm(userPos, { lat: marker.lat, lng: marker.lng }) < 450
          : false;
        return (
          <Marker
            key={marker.city}
            marker={marker}
            emphasized={emphasized}
            isUser={false}
            onSelectCity={onSelectCity}
          />
        );
      })}

      {userPos ? (
        <Marker
          marker={{
            city: "you",
            label: "You are here",
            lat: userPos.lat,
            lng: userPos.lng,
            count: 0,
            href: "/resources",
          }}
          emphasized
          isUser
          onSelectCity={onSelectCity}
        />
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
      <ambientLight intensity={0.65} />
      <directionalLight position={SUN_DIRECTION} intensity={1.5} />
      <Atmosphere />
      <Suspense fallback={null}>
        <Earth {...props} />
      </Suspense>
    </Canvas>
  );
}
