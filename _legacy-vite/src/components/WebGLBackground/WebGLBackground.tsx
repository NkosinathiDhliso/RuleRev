// @ts-nocheck
import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
// Importing the types ensures JSX intrinsic elements for Three are available to TS
import type { ThreeElements } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const NetworkNodes = () => {
  const nodesRef = useRef<THREE.Group>(null!);
  const connectionsRef = useRef<THREE.Group>(null!);
  const [interactions, setInteractions] = useState<Array<{ x: number; y: number; time: number; intensity: number }>>([]);
  const [scrollY, setScrollY] = useState(0);
  const { camera } = useThree();
  // Per-node click pulse values (decay over time via GSAP)
  const clickPulsesRef = useRef<Map<number, number>>(new Map());
  
  // Generate network nodes
  const nodes = useMemo(() => {
    const nodeArray = [];
    for (let i = 0; i < 25; i++) {
      nodeArray.push({
        id: i,
        x: (Math.random() - 0.5) * 20,
        y: (Math.random() - 0.5) * 15,
        z: (Math.random() - 0.5) * 8,
        size: 0.1 + Math.random() * 0.15,
        phase: Math.random() * Math.PI * 2,
        speed: 0.5 + Math.random() * 1.5
      });
    }
    return nodeArray;
  }, []);
  
  // Generate connections between nearby nodes
  const connections = useMemo(() => {
    const connectionArray = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const distance = Math.sqrt(
          Math.pow(nodes[i].x - nodes[j].x, 2) +
          Math.pow(nodes[i].y - nodes[j].y, 2) +
          Math.pow(nodes[i].z - nodes[j].z, 2)
        );
        if (distance < 8) {
          connectionArray.push({
            from: i,
            to: j,
            distance,
            opacity: Math.max(0, 1 - distance / 8)
          });
        }
      }
    }
    return connectionArray;
  }, [nodes]);
  
  const uniforms = useMemo(
    () => ({
      u_time: { value: 0 },
      u_interactions: { value: [] },
      u_interaction_count: { value: 0 },
    }),
    []
  );

  // Handle scroll for 3D camera movement
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle interactions to create network pulses and gentle click pulses on nodes
  useEffect(() => {
    const handleInteraction = (event: MouseEvent | TouchEvent) => {
      let x: number, y: number, intensity: number = 1.0;
      
      if (event.type === 'touchstart' || event.type === 'touchmove') {
        const touchEvent = event as TouchEvent;
        const touch = touchEvent.touches[0];
        x = (touch.clientX / window.innerWidth - 0.5) * 20;
        y = ((1 - touch.clientY / window.innerHeight) - 0.5) * 15;
        
        const force = (touch as any).force || 1;
        intensity = Math.min(force * 1.5, 2.0);
      } else {
        const mouseEvent = event as MouseEvent;
        x = (mouseEvent.clientX / window.innerWidth - 0.5) * 20;
        y = ((1 - mouseEvent.clientY / window.innerHeight) - 0.5) * 15;
        intensity = 1.2;
      }
      
      // Create network activation pulse (global)
      setInteractions(prev => [...prev, {
        x,
        y,
        time: 0,
        intensity
      }]);

      // Also create a gentle pulse if a node was "clicked"
      // Determine closest node in 2D plane
      let nearestIndex = -1;
      let nearestDist = Infinity;
      nodes.forEach((node, idx) => {
        const dx = node.x - x;
        const dy = node.y - y;
        const d2 = dx * dx + dy * dy;
        if (d2 < nearestDist) {
          nearestDist = d2;
          nearestIndex = idx;
        }
      });
      // Threshold based on node size and proximity
      if (nearestIndex >= 0 && nearestDist < 1.0) {
        const current = { value: 1 };
        // Update map on every gsap tick
        const update = () => {
          clickPulsesRef.current.set(nearestIndex, current.value);
        };
        update();
        gsap.to(current, {
          value: 0,
          duration: 0.8,
          ease: 'power2.out',
          onUpdate: update,
          onComplete: () => {
            clickPulsesRef.current.delete(nearestIndex);
          }
        });
      }
    };

    document.addEventListener('click', handleInteraction);
    document.addEventListener('touchstart', handleInteraction, { passive: true });

    return () => {
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
    };
  }, []);

  useFrame((state) => {
    const { clock } = state;
    const currentTime = clock.getElapsedTime();
    
    // Apply scroll-based 3D camera movement
    const scrollProgress = scrollY * 0.001; // Adjust sensitivity
    const scrollOffset = scrollProgress * 2;
    
    // Create dynamic camera movement based on scroll
    camera.position.x = Math.sin(scrollProgress * 0.5) * 3;
    camera.position.y = scrollOffset;
    camera.position.z = 15 + Math.cos(scrollProgress * 0.3) * 2;
    
    // Rotate camera slightly for more dynamic effect
    camera.rotation.x = scrollProgress * 0.1;
    camera.rotation.y = Math.sin(scrollProgress * 0.2) * 0.1;
    camera.rotation.z = Math.cos(scrollProgress * 0.15) * 0.05;
    
    // Animate nodes with parallax effect and rotation
    if (nodesRef.current) {
      nodesRef.current.children.forEach((nodeGroup: THREE.Object3D, index: number) => {
        const node = nodes[index];
        const pulse = Math.sin(currentTime * node.speed + node.phase) * 0.3 + 1;
        // Gentle click pulse factor (0..1)
        const clickPulse = clickPulsesRef.current.get(index) ?? 0;
        const clickScale = 1 + clickPulse * 0.35;
        nodeGroup.scale.setScalar(pulse * clickScale);
        
        // Add parallax movement based on scroll and depth
        const parallaxFactor = (node.z + 4) / 8; // Nodes closer to camera move more
        const rotationAngle = scrollProgress * 0.5; // Rotation based on scroll
        const cos = Math.cos(rotationAngle);
        const sin = Math.sin(rotationAngle);
        
        // Calculate base position with parallax
        const baseX = node.x + Math.sin(scrollProgress * 0.3 + index) * parallaxFactor;
        const baseY = node.y + Math.sin(currentTime * 0.5 + node.phase) * 0.2 + scrollOffset * parallaxFactor * 0.5;
        
        // Apply rotation to node positions
        nodeGroup.position.x = baseX * cos - baseY * sin;
        nodeGroup.position.y = baseX * sin + baseY * cos;
        nodeGroup.position.z = node.z + Math.cos(scrollProgress * 0.2 + index) * parallaxFactor * 0.5;
      });
    }
    
    // Animate connections with depth-based effects, dynamic geometry, and rotation
      if (connectionsRef.current && nodesRef.current) {
       connectionsRef.current.children.forEach((line: THREE.Object3D, index: number) => {
         const material = (line as THREE.Line).material as THREE.LineBasicMaterial;
         const geometry = (line as THREE.Line).geometry as THREE.BufferGeometry;
         const connection = connections[index];
         const fromNode = nodes[connection.from];
         const toNode = nodes[connection.to];
         
         // Get current node positions with parallax
         const fromNodeGroup = nodesRef.current.children[connection.from];
         const toNodeGroup = nodesRef.current.children[connection.to];
         
         // Apply rotation based on scroll
         const rotationAngle = scrollProgress * 0.5; // Adjust rotation speed
         const cos = Math.cos(rotationAngle);
         const sin = Math.sin(rotationAngle);
         
         // Apply rotation to connection points
         const fromPos = fromNodeGroup.position.clone();
         const toPos = toNodeGroup.position.clone();
         
         const rotatedFromX = fromPos.x * cos - fromPos.y * sin;
         const rotatedFromY = fromPos.x * sin + fromPos.y * cos;
         const rotatedToX = toPos.x * cos - toPos.y * sin;
         const rotatedToY = toPos.x * sin + toPos.y * cos;
         
         // Update line geometry with rotated positions
         const points = [
           new THREE.Vector3(rotatedFromX, rotatedFromY, fromPos.z),
           new THREE.Vector3(rotatedToX, rotatedToY, toPos.z)
         ];
         geometry.setFromPoints(points);
         
         // Calculate average depth for opacity variation
         const avgDepth = (fromNode.z + toNode.z) / 2;
         const depthFactor = (avgDepth + 4) / 8;
         
          const baseOpacity = connection.opacity;
         const pulse = Math.sin(currentTime * 2 + index * 0.5) * 0.3 + 0.7;
         const scrollEffect = 1 - Math.abs(scrollProgress * 0.1) % 1;
         
         material.opacity = baseOpacity * pulse * 0.6 * depthFactor * scrollEffect;
       });
     }
    
    // Update interactions
    const activeInteractions = interactions.map(interaction => ({
      ...interaction,
      time: interaction.time + 0.016
    })).filter(interaction => interaction.time < 4.0);
    
    if (activeInteractions.length !== interactions.length) {
      setInteractions(activeInteractions);
    }
    
    // Apply interaction effects to nearby nodes
    activeInteractions.forEach(interaction => {
      nodes.forEach((node, nodeIndex) => {
        const distance = Math.sqrt(
          Math.pow(node.x - interaction.x, 2) +
          Math.pow(node.y - interaction.y, 2)
        );
        
        if (distance < 5 && nodesRef.current) {
          const nodeGroup = nodesRef.current.children[nodeIndex];
          const effect = Math.max(0, 1 - distance / 5) * 
                        Math.exp(-interaction.time * 0.8) * 
                        interaction.intensity;
          
          const extraScale = 1 + effect * 0.5;
          const basePulse = Math.sin(currentTime * node.speed + node.phase) * 0.3 + 1;
          nodeGroup.scale.setScalar(basePulse * extraScale);
        }
      });
    });
  });

  return (
    <>
      {/* Network Nodes */}
      <group ref={nodesRef}>
        {nodes.map((node, index) => (
          <group key={node.id} position={[node.x, node.y, node.z]}>
            {/* Core node */}
            <mesh>
              <sphereGeometry args={[node.size, 16, 16]} />
              <meshBasicMaterial 
                color={new THREE.Color(0.0, 0.6, 0.8)} 
                transparent 
                opacity={0.9}
              />
            </mesh>
            {/* Outer glow */}
            <mesh>
              <sphereGeometry args={[node.size * 1.8, 16, 16]} />
              <meshBasicMaterial 
                color={new THREE.Color(0.12, 0.18, 0.33)} 
                transparent 
                opacity={0.3}
              />
            </mesh>
            {/* Inner bright core */}
            <mesh>
              <sphereGeometry args={[node.size * 0.4, 8, 8]} />
              <meshBasicMaterial 
                color={new THREE.Color(0.3, 0.5, 0.7)} 
                transparent 
                opacity={0.8}
              />
            </mesh>
          </group>
        ))}
      </group>
      
      {/* Network Connections */}
      <group ref={connectionsRef}>
        {connections.map((connection, index) => {
          const fromNode = nodes[connection.from];
          const toNode = nodes[connection.to];
          
          const points = [
            new THREE.Vector3(fromNode.x, fromNode.y, fromNode.z),
            new THREE.Vector3(toNode.x, toNode.y, toNode.z)
          ];
          
          const geometry = new THREE.BufferGeometry().setFromPoints(points);
          
          return (
            <line key={index} geometry={geometry}>
              <lineBasicMaterial 
                color={new THREE.Color(0.0, 0.6, 0.8)} 
                transparent 
                opacity={connection.opacity * 0.6}
              />
            </line>
          );
        })}
      </group>
    </>
  );
};

export const WebGLBackground: React.FC = () => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: -1,
      pointerEvents: 'none'
    }}>
      <Canvas
        camera={{ position: [0, 0, 18], fov: 75 }}
        style={{ width: '100%', height: '100%' }}
        dpr={[1, 1.5]}
        gl={{ powerPreference: 'low-power', antialias: true }}
        onCreated={({ gl }) => {
          try {
            const ctx = gl.getContext();
            const canvas = ctx && (ctx.canvas as HTMLCanvasElement);
            if (!canvas) return;
            const handleLost = (e: Event) => {
              e.preventDefault();
              // Optionally hide canvas or trigger a lightweight UI fallback here
              // console.warn('WebGL context lost');
            };
            const handleRestored = () => {
              // R3F will re-render on next frame; avoid heavy work here
              // console.info('WebGL context restored');
            };
            canvas.addEventListener('webglcontextlost', handleLost as EventListener, false);
            canvas.addEventListener('webglcontextrestored', handleRestored as EventListener, false);
          } catch {
            // No-op: best-effort guard for environments without expected APIs
          }
        }}
      >
        <AnimatedScene />
      </Canvas>
    </div>
  );
};

const ParticleField: React.FC = () => {
  const pointsRef = useRef<THREE.Points>(null!);
  const particleCount = 1200;
  const positions = useMemo(() => {
    const arr = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      arr[i3 + 0] = (Math.random() - 0.5) * 40;
      arr[i3 + 1] = (Math.random() - 0.5) * 30;
      arr[i3 + 2] = (Math.random() - 0.5) * 20;
    }
    return arr;
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (pointsRef.current) {
      pointsRef.current.rotation.y = t * 0.02;
      pointsRef.current.rotation.x = Math.sin(t * 0.1) * 0.05;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color={new THREE.Color(0.6, 0.9, 1.0)}
        transparent
        opacity={0.6}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
};

const AnimatedScene: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null!);
  const { camera } = useThree();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.set(groupRef.current.rotation, { x: -0.1, y: -0.2 });
      gsap.set(camera.position, { z: 22, x: 0.2, y: 0.1 });

      const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });
      intro
        .to(camera.position, { z: 18, duration: 1.2 })
        .to(groupRef.current.rotation, { y: 0.15, x: -0.05, duration: 1.0 }, '<0.2');

      gsap.to(groupRef.current.rotation, {
        y: '+=1',
        x: '+=0.25',
        scrollTrigger: {
          trigger: document.body,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
        },
      });
      gsap.to(camera.position, {
        z: 16,
        x: 0.4,
        y: 0.2,
        scrollTrigger: {
          trigger: document.body,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
        },
      });

      const quickX = gsap.quickTo(groupRef.current.rotation, 'x', { duration: 0.6, ease: 'power2.out' });
      const quickY = gsap.quickTo(groupRef.current.rotation, 'y', { duration: 0.6, ease: 'power2.out' });
      const onMove = (e: MouseEvent) => {
        const nx = (e.clientY / window.innerHeight - 0.5) * -0.3;
        const ny = (e.clientX / window.innerWidth - 0.5) * 0.5;
        quickX(nx);
        quickY(ny);
      };
      window.addEventListener('mousemove', onMove, { passive: true });

      return () => {
        window.removeEventListener('mousemove', onMove);
      };
    });
    return () => ctx.revert();
  }, [camera]);

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.45} />
      <pointLight position={[10, 10, 10]} intensity={0.7} />
      <pointLight position={[-10, -10, 5]} intensity={0.35} color={new THREE.Color(0.2, 0.3, 0.5)} />
      <ParticleField />
      <NetworkNodes />
    </group>
  );
};