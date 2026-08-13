"use client";

/* eslint-disable react/no-unknown-property -- R3F intrinsic props are TypeScript-checked. */

import { Float, Sparkles } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import {
  AdditiveBlending,
  Color,
  type Group,
  type LineBasicMaterial,
  type ShaderMaterial,
  Vector2,
} from "three";

export type NeuralThemeId =
  | "technology"
  | "reason"
  | "feeling"
  | "vulnerability";

export interface NeuralMotionRef {
  current: number;
}

export interface NeuralPointerRef {
  current: { x: number; y: number };
}

export interface NeuralFieldProps {
  activeTheme?: NeuralThemeId | null;
  compact?: boolean;
  integrationRef: NeuralMotionRef;
  pointerRef: NeuralPointerRef;
}

export type NeuralSceneProps = NeuralFieldProps;

const THEME_COLORS = ["#36d9ff", "#f2c66d", "#ff6b5f", "#d8a7ff"] as const;
const THREE_THEME_COLORS = THEME_COLORS.map((color) => new Color(color));
const THEME_INDEX: Record<NeuralThemeId, number> = {
  technology: 0,
  reason: 1,
  feeling: 2,
  vulnerability: 3,
};

const vertexShader = /* glsl */ `
  attribute vec3 aTarget;
  attribute vec3 aColor;
  attribute float aSeed;
  attribute float aSize;
  attribute float aTheme;

  uniform float uTime;
  uniform float uIntegration;
  uniform float uActiveTheme;
  uniform vec2 uPointer;

  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    float integration = smoothstep(0.0, 1.0, uIntegration);
    vec3 current = mix(position, aTarget, integration);
    float breath = sin(uTime * 1.15 + aSeed * 12.0 + length(aTarget) * 2.4) * 0.035;
    current += normalize(aTarget + vec3(0.0001)) * breath * integration;

    vec2 projected = current.xy / vec2(2.5, 2.0);
    float pointerCharge = exp(-distance(projected, uPointer) * 4.4);
    current.z += pointerCharge * 0.16 * integration;
    current.xy += uPointer * pointerCharge * 0.035;

    float selected = 1.0;
    if (uActiveTheme > -0.5) {
      selected = mix(0.28, 1.35, 1.0 - step(0.25, abs(aTheme - uActiveTheme)));
    }

    vec4 viewPosition = modelViewMatrix * vec4(current, 1.0);
    gl_Position = projectionMatrix * viewPosition;
    gl_PointSize = max(1.2, aSize * selected * (28.0 / max(1.0, -viewPosition.z)));
    vColor = aColor * selected;
    vAlpha = (0.42 + integration * 0.42) * selected;
  }
`;

const fragmentShader = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vec2 point = gl_PointCoord - vec2(0.5);
    float distanceFromCenter = length(point);
    float core = smoothstep(0.5, 0.05, distanceFromCenter);
    float halo = smoothstep(0.5, 0.22, distanceFromCenter) * 0.45;
    if (distanceFromCenter > 0.5) discard;
    gl_FragColor = vec4(vColor, (core + halo) * vAlpha);
  }
`;

interface FieldData {
  origins: Float32Array;
  targets: Float32Array;
  colors: Float32Array;
  seeds: Float32Array;
  sizes: Float32Array;
  themes: Float32Array;
  lines: Float32Array;
}

function seededRandom(seed: number): () => number {
  let value = seed >>> 0;
  return () => {
    value += 0x6d2b79f5;
    let next = value;
    next = Math.imul(next ^ (next >>> 15), next | 1);
    next ^= next + Math.imul(next ^ (next >>> 7), next | 61);
    return ((next ^ (next >>> 14)) >>> 0) / 4294967296;
  };
}

function createField(pointCount: number, lineCount: number): FieldData {
  const random = seededRandom(0x50454452);
  const origins = new Float32Array(pointCount * 3);
  const targets = new Float32Array(pointCount * 3);
  const colors = new Float32Array(pointCount * 3);
  const seeds = new Float32Array(pointCount);
  const sizes = new Float32Array(pointCount);
  const themes = new Float32Array(pointCount);
  const anchors = [
    [-3.4, 1.72],
    [3.4, 1.72],
    [-3.4, -1.58],
    [3.4, -1.58],
  ] as const;

  for (let index = 0; index < pointCount; index += 1) {
    const offset = index * 3;
    const theme = index % THEME_COLORS.length;
    const side = random() < 0.5 ? -1 : 1;
    const azimuth = random() * Math.PI * 2;
    const polar = Math.acos(2 * random() - 1);
    const sinPolar = Math.sin(polar);
    const fold =
      1 +
      Math.sin(azimuth * 7 + polar * 3.2) * 0.075 +
      Math.sin(azimuth * 3.1 - polar * 8.4) * 0.035;
    const targetX = side * 0.49 + sinPolar * Math.cos(azimuth) * 0.86 * fold;
    const targetY = Math.cos(polar) * 1.08 * fold + Math.sin(azimuth * 2) * 0.035;
    const targetZ = sinPolar * Math.sin(azimuth) * 0.72 * fold;

    targets[offset] = targetX;
    targets[offset + 1] = targetY;
    targets[offset + 2] = targetZ;

    const streamProgress = random();
    const spread = (1 - streamProgress) * 0.28 + 0.035;
    const anchor = anchors[theme];
    const bend = Math.sin(streamProgress * Math.PI);
    origins[offset] = anchor[0] * (1 - streamProgress) + targetX * streamProgress * 0.18;
    origins[offset] += (random() - 0.5) * spread + bend * (theme < 2 ? 0.3 : -0.3);
    origins[offset + 1] = anchor[1] * (1 - streamProgress) + targetY * streamProgress * 0.18;
    origins[offset + 1] += (random() - 0.5) * spread + Math.sin(streamProgress * Math.PI * 2) * 0.12;
    origins[offset + 2] = (random() - 0.5) * 0.7 * (1 - streamProgress) + bend * 0.22;

    const color = THREE_THEME_COLORS[theme];
    colors[offset] = color.r;
    colors[offset + 1] = color.g;
    colors[offset + 2] = color.b;
    seeds[index] = random();
    sizes[index] = 0.72 + random() * 1.12;
    themes[index] = theme;
  }

  const lines = new Float32Array(lineCount * 6);
  for (let segment = 0; segment < lineCount; segment += 1) {
    const first = Math.floor(random() * pointCount);
    let second = (first + 1) % pointCount;
    let bestDistance = Number.POSITIVE_INFINITY;

    for (let attempt = 0; attempt < 14; attempt += 1) {
      const candidate = Math.floor(random() * pointCount);
      const dx = targets[first * 3] - targets[candidate * 3];
      const dy = targets[first * 3 + 1] - targets[candidate * 3 + 1];
      const dz = targets[first * 3 + 2] - targets[candidate * 3 + 2];
      const distance = dx * dx + dy * dy + dz * dz;
      if (distance < bestDistance) {
        bestDistance = distance;
        second = candidate;
      }
    }

    const lineOffset = segment * 6;
    lines.set(targets.subarray(first * 3, first * 3 + 3), lineOffset);
    lines.set(targets.subarray(second * 3, second * 3 + 3), lineOffset + 3);
  }

  return { origins, targets, colors, seeds, sizes, themes, lines };
}

export function NeuralField({
  activeTheme = null,
  compact = false,
  integrationRef,
  pointerRef,
}: NeuralFieldProps) {
  const pointCount = compact ? 800 : 2200;
  const lineCount = compact ? 96 : 220;
  const field = useMemo(
    () => createField(pointCount, lineCount),
    [lineCount, pointCount],
  );
  const group = useRef<Group>(null);
  const pointMaterial = useRef<ShaderMaterial>(null);
  const lineMaterial = useRef<LineBasicMaterial>(null);
  const easedPointer = useRef(new Vector2());
  const pointerTarget = useRef(new Vector2());
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uIntegration: { value: 0 },
      uActiveTheme: { value: -1 },
      uPointer: { value: new Vector2() },
    }),
    [],
  );

  useFrame((state, delta) => {
    pointerTarget.current.set(pointerRef.current.x, pointerRef.current.y);
    easedPointer.current.lerp(pointerTarget.current, 1 - Math.exp(-delta * 7.5));
    const integration = Math.min(1, Math.max(0, integrationRef.current));

    if (pointMaterial.current) {
      pointMaterial.current.uniforms.uTime.value = state.clock.elapsedTime;
      pointMaterial.current.uniforms.uIntegration.value = integration;
      pointMaterial.current.uniforms.uActiveTheme.value = activeTheme
        ? THEME_INDEX[activeTheme]
        : -1;
      pointMaterial.current.uniforms.uPointer.value.copy(easedPointer.current);
    }
    if (lineMaterial.current) {
      lineMaterial.current.opacity = 0.035 + integration * 0.17;
    }
    if (group.current) {
      group.current.rotation.y +=
        (easedPointer.current.x * 0.065 - group.current.rotation.y) *
        (1 - Math.exp(-delta * 4.5));
      group.current.rotation.x +=
        (-easedPointer.current.y * 0.045 - group.current.rotation.x) *
        (1 - Math.exp(-delta * 4.5));
    }
  });

  return (
    <Float speed={0.72} rotationIntensity={0.025} floatIntensity={0.09}>
      <group ref={group} scale={compact ? 0.88 : 1}>
        <points frustumCulled={false}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[field.origins, 3]} />
            <bufferAttribute attach="attributes-aTarget" args={[field.targets, 3]} />
            <bufferAttribute attach="attributes-aColor" args={[field.colors, 3]} />
            <bufferAttribute attach="attributes-aSeed" args={[field.seeds, 1]} />
            <bufferAttribute attach="attributes-aSize" args={[field.sizes, 1]} />
            <bufferAttribute attach="attributes-aTheme" args={[field.themes, 1]} />
          </bufferGeometry>
          <shaderMaterial
            ref={pointMaterial}
            uniforms={uniforms}
            vertexShader={vertexShader}
            fragmentShader={fragmentShader}
            transparent
            depthWrite={false}
            blending={AdditiveBlending}
          />
        </points>

        <lineSegments frustumCulled={false}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[field.lines, 3]} />
          </bufferGeometry>
          <lineBasicMaterial
            ref={lineMaterial}
            color="#dcecff"
            transparent
            opacity={0.035}
            depthWrite={false}
            blending={AdditiveBlending}
          />
        </lineSegments>

        <Sparkles
          count={compact ? 14 : 28}
          scale={[3.6, 2.7, 1.7]}
          size={compact ? 1.4 : 1.8}
          speed={0.12}
          color="#f1ede4"
          opacity={0.28}
        />
      </group>
    </Float>
  );
}

export function NeuralScene(props: NeuralSceneProps) {
  const compact = props.compact ?? false;

  return (
    <Canvas
      aria-hidden="true"
      camera={{ position: [0, 0, 4.4], fov: 44 }}
      dpr={compact ? 1 : [1, 1.5]}
      gl={{ alpha: true, antialias: false, powerPreference: "high-performance" }}
    >
      <NeuralField {...props} compact={compact} />
    </Canvas>
  );
}
