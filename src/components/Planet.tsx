import { forwardRef, useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface PlanetProps {
  position: [number, number, number];
  scale?: number;
  color?: string;
  wireframeColor?: string;
  speed?: number;
  hasRings?: boolean;
  type?: 'gas' | 'terrestrial' | 'ice' | 'volcanic' | 'earth' | 'mars' | 'jupiter';
  seed?: number;
}

const simplexNoise = `
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
float snoise(vec3 v) {
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 =   v - i + dot(i, C.xxx) ;
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );
  vec3 x1 = x0 - i1 + 1.0 * C.xxx;
  vec3 x2 = x0 - i2 + 2.0 * C.xxx;
  vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;
  i = mod289(i);
  vec4 p = permute( permute( permute(
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
  float n_ = 1.0/7.0;
  vec3  ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z *ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );
  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;
  vec4 m = max(0.5 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 105.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
}
`;



export const Planet = forwardRef<THREE.Group, PlanetProps>(({
  position,
  scale = 1,
  color = '#1a2b4c',
  wireframeColor = '#00f0ff',
  speed = 0.005,
  hasRings = false,
  type = 'terrestrial',
  seed = Math.random() * 100,
}, ref) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);
  const ringsRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uColor1: { value: new THREE.Color(color) },
    uColor2: { value: new THREE.Color(wireframeColor) },
    uSeed: { value: seed },
    uType: { value: type === 'gas' ? 0 : type === 'terrestrial' ? 1 : type === 'ice' ? 2 : 3 }
  }), [color, wireframeColor, type, seed]);

  const cloudUniforms = useMemo(() => ({
    uTime: { value: 0 },
    uSeed: { value: seed + 100 },
  }), [seed]);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += speed;
    }
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += speed * 1.2;
      cloudsRef.current.rotation.x += speed * 0.2;
    }
    if (ringsRef.current) {
      ringsRef.current.rotation.z += speed * 0.5;
    }
    uniforms.uTime.value = state.clock.elapsedTime;
    cloudUniforms.uTime.value = state.clock.elapsedTime;
  });

  const onBeforeCompile = useMemo(() => (shader: THREE.WebGLProgramParametersWithUniforms) => {
    shader.uniforms.uTime = uniforms.uTime;
    shader.uniforms.uColor1 = uniforms.uColor1;
    shader.uniforms.uColor2 = uniforms.uColor2;
    shader.uniforms.uSeed = uniforms.uSeed;
    shader.uniforms.uType = uniforms.uType;

    shader.vertexShader = shader.vertexShader.replace(
      '#include <common>',
      `
      #include <common>
      varying vec3 vPos;
      `
    ).replace(
      '#include <begin_vertex>',
      `
      #include <begin_vertex>
      vPos = position;
      `
    );

    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <common>',
      `
      #include <common>
      uniform float uTime;
      uniform vec3 uColor1;
      uniform vec3 uColor2;
      uniform float uSeed;
      uniform int uType;
      varying vec3 vPos;
      ${simplexNoise}
      `
    ).replace(
      '#include <color_fragment>',
      `
      #include <color_fragment>
      
      vec3 pos = vPos * 2.0 + uSeed;
      float n = 0.0;
      
      if (uType == 0) { // Gas
        n = snoise(vec3(pos.x, pos.y * 3.0, pos.z) + uTime * 0.02);
        n += 0.5 * snoise(vec3(pos.x * 2.0, pos.y * 6.0, pos.z * 2.0));
        n += 0.25 * snoise(vec3(pos.x * 4.0, pos.y * 12.0, pos.z * 4.0));
      } else if (uType == 1) { // Terrestrial
        n = snoise(pos * 1.5);
        n += 0.5 * snoise(pos * 3.0);
        n += 0.25 * snoise(pos * 6.0);
        n += 0.125 * snoise(pos * 12.0);
      } else if (uType == 2) { // Ice
        n = snoise(pos * 2.0);
        n = 1.0 - abs(n);
        n += 0.5 * snoise(pos * 4.0);
      } else { // Volcanic
        n = snoise(pos * 2.0 + uTime * 0.05);
        n += 0.5 * snoise(pos * 4.0 - uTime * 0.05);
        n = abs(n);
      }
      
      n = n * 0.5 + 0.5; // map to 0-1
      
      // Add some turbulence
      float t = snoise(pos * 10.0) * 0.1;
      n = clamp(n + t, 0.0, 1.0);
      
      vec3 finalColor = mix(uColor2, uColor1, n);
      diffuseColor = vec4(finalColor, diffuseColor.a);
      `
    );
  }, [uniforms]);

  const onBeforeCompileClouds = useMemo(() => (shader: THREE.WebGLProgramParametersWithUniforms) => {
    shader.uniforms.uTime = cloudUniforms.uTime;
    shader.uniforms.uSeed = cloudUniforms.uSeed;

    shader.vertexShader = shader.vertexShader.replace(
      '#include <common>',
      `
      #include <common>
      varying vec3 vPos;
      `
    ).replace(
      '#include <begin_vertex>',
      `
      #include <begin_vertex>
      vPos = position;
      `
    );

    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <common>',
      `
      #include <common>
      uniform float uTime;
      uniform float uSeed;
      varying vec3 vPos;
      ${simplexNoise}
      `
    ).replace(
      '#include <color_fragment>',
      `
      #include <color_fragment>
      
      vec3 pos = vPos * 3.0 + uSeed;
      float n = snoise(pos + uTime * 0.02);
      n += 0.5 * snoise(pos * 2.0 - uTime * 0.01);
      n += 0.25 * snoise(pos * 4.0);
      
      n = smoothstep(0.1, 0.9, n); // Sharpen clouds
      
      diffuseColor = vec4(1.0, 1.0, 1.0, n * 0.6);
      `
    );
  }, [cloudUniforms]);

  const fresnelMaterial = useMemo(() => {
    const uniforms = {
      color1: { value: new THREE.Color(wireframeColor) },
      color2: { value: new THREE.Color('#000000') },
      fresnelBias: { value: 0.1 },
      fresnelScale: { value: 1.0 },
      fresnelPower: { value: 4.0 },
    };

    const vertexShader = `
      uniform float fresnelBias;
      uniform float fresnelScale;
      uniform float fresnelPower;
      
      varying float vReflectionFactor;
      
      void main() {
        vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
        vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
        
        vec3 worldNormal = normalize( mat3( modelMatrix[0].xyz, modelMatrix[1].xyz, modelMatrix[2].xyz ) * normal );
        
        vec3 I = worldPosition.xyz - cameraPosition;
        
        vReflectionFactor = fresnelBias + fresnelScale * pow( 1.0 + dot( normalize( I ), worldNormal ), fresnelPower );
        
        gl_Position = projectionMatrix * mvPosition;
      }
    `;

    const fragmentShader = `
      uniform vec3 color1;
      uniform vec3 color2;
      
      varying float vReflectionFactor;
      
      void main() {
        float f = clamp( vReflectionFactor, 0.0, 1.0 );
        gl_FragColor = vec4(mix(color2, color1, vec3(f)), f);
      }
    `;

    return new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
  }, [wireframeColor]);

  const ringsMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uColor: { value: new THREE.Color(wireframeColor) },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        varying vec2 vUv;
        ${simplexNoise}
        void main() {
          // vUv.x goes around the ring, vUv.y goes from inner to outer radius
          float n = snoise(vec3(vUv.y * 20.0, 0.0, 0.0));
          n += 0.5 * snoise(vec3(vUv.y * 40.0, 0.0, 0.0));
          n = n * 0.5 + 0.5;
          
          // Fade edges
          float edge = smoothstep(0.0, 0.1, vUv.y) * smoothstep(1.0, 0.9, vUv.y);
          
          gl_FragColor = vec4(uColor, n * edge * 0.8);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
  }, [wireframeColor]);

  return (
    <group ref={ref} position={position} scale={scale}>
      {/* Solid Core with Procedural Texture */}
      {(
        <>
          <mesh ref={meshRef}>
            <sphereGeometry args={[1, 64, 64]} />
            <meshStandardMaterial
              color="#ffffff"
              roughness={type === 'ice' ? 0.2 : type === 'gas' ? 0.5 : 0.8}
              metalness={type === 'ice' ? 0.5 : 0.1}
              onBeforeCompile={onBeforeCompile}
            />
          </mesh>

          {/* Clouds Layer (only for non-gas planets) */}
          {type !== 'gas' && type !== 'ice' && (
            <mesh ref={cloudsRef} scale={1.01}>
              <sphereGeometry args={[1, 64, 64]} />
              <meshStandardMaterial
                transparent
                opacity={1}
                depthWrite={false}
                onBeforeCompile={onBeforeCompileClouds}
              />
            </mesh>
          )}
        </>
      )}

      {/* Optional Rings */}
      {hasRings && (
        <mesh ref={ringsRef} rotation={[Math.PI / 2.5, 0, 0]}>
          <ringGeometry args={[1.4, 2.4, 128]} />
          <primitive object={ringsMaterial} attach="material" />
        </mesh>
      )}

      {/* Glow / Atmosphere */}
      <mesh ref={atmosphereRef} scale={1.2} material={fresnelMaterial}>
        <sphereGeometry args={[1, 64, 64]} />
      </mesh>
    </group>
  );
});
