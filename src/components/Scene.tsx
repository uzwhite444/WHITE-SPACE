import { Canvas, useFrame } from '@react-three/fiber';
import { Suspense, useRef } from 'react';
import { Environment, PerspectiveCamera, Stars as DreiStars } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { Planet } from './Planet';
import { Nebula } from './Nebula';
import { Asteroids } from './Asteroids';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';

gsap.registerPlugin(ScrollTrigger);

function CinematicCamera({ cameraRef }: { cameraRef: React.RefObject<THREE.PerspectiveCamera | null> }) {
  useFrame((state) => {
    if (!cameraRef.current) return;
    // Subtle continuous floating effect
    const t = state.clock.getElapsedTime();
    cameraRef.current.position.y += Math.sin(t * 0.5) * 0.002;
    cameraRef.current.position.x += Math.cos(t * 0.3) * 0.002;
  });
  return null;
}

export function Scene() {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const groupRef = useRef<THREE.Group>(null);
  
  // Refs for parallax elements
  const starsRef = useRef<THREE.Group>(null);
  const nebulaRef = useRef<THREE.Group>(null);
  const asteroidsRef = useRef<THREE.Group>(null);
  
  // Refs for planets
  const planet1 = useRef<THREE.Group>(null);
  const planet1Rings = useRef<THREE.Group>(null);
  const planet2 = useRef<THREE.Group>(null);
  const planet3 = useRef<THREE.Group>(null);
  const planet4 = useRef<THREE.Group>(null);
  const planet5 = useRef<THREE.Group>(null);
  const planet6 = useRef<THREE.Group>(null);

  useGSAP(() => {
    if (!cameraRef.current || !groupRef.current) return;

    const cameraPos = cameraRef.current.position;
    const cameraRot = cameraRef.current.rotation;

    // Defer until #scroll-container exists in the DOM (rendered by HtmlOverlay)
    const init = () => {
      if (!document.querySelector('#scroll-container')) {
        setTimeout(init, 100);
        return;
      }

      // Timeline for camera movement based on scroll
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: '#scroll-container',
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.5,
        },
      });

      // Move camera forward through space
      tl.to(cameraPos, { z: -60, x: 5, y: -2, ease: 'power2.inOut' }, 0);

      // Rotate camera slightly for a cinematic feel
      tl.to(cameraRot, {
        y: Math.PI * 0.15,
        z: Math.PI * 0.05,
        x: -Math.PI * 0.05,
        ease: 'power2.inOut',
      }, 0);

      // Stars parallax
      if (starsRef.current) {
        tl.to(starsRef.current.position, { z: 20, ease: 'none' }, 0);
      }

      // Nebula parallax
      if (nebulaRef.current) {
        tl.to(nebulaRef.current.position, { z: 30, ease: 'none' }, 0);
      }

      // Asteroids parallax
      if (asteroidsRef.current) {
        tl.to(asteroidsRef.current.position, { z: 40, ease: 'none' }, 0);
      }

      // Planets parallax (different speeds)
      if (planet1.current) tl.to(planet1.current.position, { z: "+=15", y: "+=2", ease: 'none' }, 0);
      if (planet2.current) tl.to(planet2.current.position, { z: "+=20", x: "-=5", ease: 'none' }, 0);
      if (planet3.current) tl.to(planet3.current.position, { z: "+=25", y: "+=5", ease: 'none' }, 0);
      if (planet4.current) tl.to(planet4.current.position, { z: "+=30", x: "+=5", ease: 'none' }, 0);
      if (planet5.current) tl.to(planet5.current.position, { z: "+=40", y: "+=10", ease: 'none' }, 0);
      if (planet6.current) tl.to(planet6.current.position, { z: "+=45", x: "+=10", ease: 'none' }, 0);
    };

    init();
  }, { dependencies: [] });

  return (
    <div className="fixed inset-0 z-0 pointer-events-none bg-space-900">
      <Canvas dpr={[1, 2]}>
        <fog attach="fog" args={['#02040a', 10, 80]} />
        <PerspectiveCamera ref={cameraRef} makeDefault position={[0, 0, 10]} fov={60} />
        <CinematicCamera cameraRef={cameraRef} />
        
        <ambientLight intensity={0.1} />
        <directionalLight position={[10, 20, 5]} intensity={2} color="#ffffff" />
        <pointLight position={[-10, -10, -5]} intensity={1.5} color="#00f0ff" distance={50} />
        <pointLight position={[10, 0, -20]} intensity={2} color="#b026ff" distance={60} />
        
        <Suspense fallback={null}>
          <group ref={groupRef}>
            <group ref={starsRef}>
              <DreiStars radius={100} depth={50} count={7000} factor={5} saturation={0.5} fade speed={1.5} />
            </group>
            
            <group ref={asteroidsRef}>
              <Asteroids />
            </group>

            {/* Hero Planet */}
            <Planet ref={planet1} position={[3, 0, -5]} scale={2.5} color="#0a1220" wireframeColor="#00f0ff" speed={0.002} type="jupiter" hasRings seed={1} />
            
            {/* About Space Planets */}
            <Planet ref={planet2} position={[-8, -5, -15]} scale={1.5} color="#150d26" wireframeColor="#b026ff" speed={0.005} type="earth" seed={2} />
            <Planet ref={planet3} position={[10, 5, -25]} scale={3} color="#050c17" wireframeColor="#00f0ff" speed={0.001} type="mars" seed={3} />
            
            {/* Planet Exploration */}
            <Planet ref={planet4} position={[6, -2, -40]} scale={4} color="#000000" wireframeColor="#ffffff" speed={0.003} type="gas" hasRings seed={4} />
            
            {/* Deep Space / Galaxy */}
            <Planet ref={planet5} position={[-15, 10, -60]} scale={8} color="#010205" wireframeColor="#b026ff" speed={0.001} type="volcanic" seed={5} />
            <Planet ref={planet6} position={[15, -10, -70]} scale={5} color="#010205" wireframeColor="#00f0ff" speed={0.002} type="terrestrial" seed={6} />
            
            <group ref={nebulaRef}>
              <Nebula />
            </group>
          </group>
          
          <EffectComposer>
            <Bloom luminanceThreshold={0.2} mipmapBlur intensity={1.5} luminanceSmoothing={0.9} />
            <Vignette eskil={false} offset={0.1} darkness={1.1} />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  );
}
