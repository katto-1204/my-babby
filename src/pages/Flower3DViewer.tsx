import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import FloatingHearts from '@/components/valentine/FloatingHearts';
import { useSound } from '@/hooks/useSound';

const Flower3DViewer = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const flowerRef = useRef<THREE.Group | null>(null);
  const animationIdRef = useRef<number | null>(null);
  const [selectedFlower, setSelectedFlower] = useState('tulip');
  const [isRotating, setIsRotating] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { playSound } = useSound();

  const flowers = [
    { id: 'tulip', name: 'Tulip', color: 0xff6b9d },
    { id: 'daisy', name: 'Daisy', color: 0xffd93d },
    { id: 'lily', name: 'Lily', color: 0xff9ff3 },
    { id: 'clover', name: '4-Leaf Clover', color: 0x4a7c59 },
  ];

  const createTulip = () => {
    const group = new THREE.Group();
    
    // Tulip cup shape (closed petals)
    const cupGeometry = new THREE.ConeGeometry(0.8, 1.2, 6);
    const cupMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xff6b9d,
      side: THREE.DoubleSide 
    });
    const cup = new THREE.Mesh(cupGeometry, cupMaterial);
    cup.rotation.x = Math.PI;
    cup.position.y = 0.5;
    group.add(cup);

    // Stem
    const stemGeometry = new THREE.CylinderGeometry(0.06, 0.06, 2, 8);
    const stemMaterial = new THREE.MeshStandardMaterial({ color: 0x4a7c59 });
    const stem = new THREE.Mesh(stemGeometry, stemMaterial);
    stem.position.y = -1.5;
    group.add(stem);

    // Leaves
    const leafGeometry = new THREE.SphereGeometry(0.4, 8, 8);
    leafGeometry.scale(0.4, 1.2, 0.1);
    const leafMaterial = new THREE.MeshStandardMaterial({ color: 0x5a8c69 });
    
    const leaf1 = new THREE.Mesh(leafGeometry, leafMaterial);
    leaf1.position.set(-0.4, -0.7, 0);
    leaf1.rotation.z = Math.PI / 4;
    group.add(leaf1);

    return group;
  };

  const createDaisy = () => {
    const group = new THREE.Group();
    
    // Center
    const centerGeometry = new THREE.SphereGeometry(0.4, 16, 16);
    const centerMaterial = new THREE.MeshStandardMaterial({ color: 0xffd700 });
    const center = new THREE.Mesh(centerGeometry, centerMaterial);
    center.position.y = 0.5;
    group.add(center);

    // White petals (many small petals)
    const petalGeometry = new THREE.SphereGeometry(0.3, 8, 8);
    petalGeometry.scale(0.5, 1.5, 0.2);
    const petalMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xffffff,
      side: THREE.DoubleSide 
    });

    for (let i = 0; i < 12; i++) {
      const petal = new THREE.Mesh(petalGeometry, petalMaterial);
      const angle = (i / 12) * Math.PI * 2;
      petal.position.x = Math.cos(angle) * 0.7;
      petal.position.z = Math.sin(angle) * 0.7;
      petal.position.y = 0.5;
      petal.rotation.z = angle;
      group.add(petal);
    }

    // Stem
    const stemGeometry = new THREE.CylinderGeometry(0.05, 0.05, 2, 8);
    const stemMaterial = new THREE.MeshStandardMaterial({ color: 0x4a7c59 });
    const stem = new THREE.Mesh(stemGeometry, stemMaterial);
    stem.position.y = -1.5;
    group.add(stem);

    return group;
  };

  const createLily = () => {
    const group = new THREE.Group();
    
    // Lily has 6 large petals that curve outward
    const petalGeometry = new THREE.SphereGeometry(0.5, 12, 12);
    petalGeometry.scale(0.6, 1.8, 0.3);
    const petalMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xff9ff3,
      side: THREE.DoubleSide 
    });

    for (let i = 0; i < 6; i++) {
      const petal = new THREE.Mesh(petalGeometry, petalMaterial);
      const angle = (i / 6) * Math.PI * 2;
      petal.position.x = Math.cos(angle) * 0.3;
      petal.position.z = Math.sin(angle) * 0.3;
      petal.position.y = 0.8;
      petal.rotation.y = angle;
      petal.rotation.x = -Math.PI / 6;
      group.add(petal);
    }

    // Center stamen
    const stamenGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.8, 8);
    const stamenMaterial = new THREE.MeshStandardMaterial({ color: 0xffd700 });
    const stamen = new THREE.Mesh(stamenGeometry, stamenMaterial);
    stamen.position.y = 0.5;
    group.add(stamen);

    // Stem
    const stemGeometry = new THREE.CylinderGeometry(0.05, 0.05, 2.5, 8);
    const stemMaterial = new THREE.MeshStandardMaterial({ color: 0x4a7c59 });
    const stem = new THREE.Mesh(stemGeometry, stemMaterial);
    stem.position.y = -1.75;
    group.add(stem);

    // Leaves
    const leafGeometry = new THREE.SphereGeometry(0.3, 8, 8);
    leafGeometry.scale(0.3, 1, 0.1);
    const leafMaterial = new THREE.MeshStandardMaterial({ color: 0x5a8c69 });
    
    const leaf1 = new THREE.Mesh(leafGeometry, leafMaterial);
    leaf1.position.set(-0.3, -1, 0);
    leaf1.rotation.z = Math.PI / 4;
    group.add(leaf1);

    const leaf2 = new THREE.Mesh(leafGeometry, leafMaterial);
    leaf2.position.set(0.3, -1, 0);
    leaf2.rotation.z = -Math.PI / 4;
    group.add(leaf2);

    return group;
  };

  const createClover = () => {
    const group = new THREE.Group();
    
    // 4 heart-shaped leaves
    const leafGeometry = new THREE.SphereGeometry(0.4, 8, 8);
    leafGeometry.scale(0.8, 1.2, 0.2);
    const leafMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x4a7c59,
      side: THREE.DoubleSide 
    });

    const positions = [
      { x: 0, z: 0.5, rot: 0 },      // Top
      { x: 0.5, z: 0, rot: Math.PI / 2 }, // Right
      { x: 0, z: -0.5, rot: Math.PI },    // Bottom
      { x: -0.5, z: 0, rot: -Math.PI / 2 }, // Left
    ];

    positions.forEach(({ x, z, rot }) => {
      const leaf = new THREE.Mesh(leafGeometry, leafMaterial);
      leaf.position.set(x, 0.3, z);
      leaf.rotation.y = rot;
      group.add(leaf);
    });

    // Center
    const centerGeometry = new THREE.SphereGeometry(0.15, 8, 8);
    const centerMaterial = new THREE.MeshStandardMaterial({ color: 0x3a6c49 });
    const center = new THREE.Mesh(centerGeometry, centerMaterial);
    center.position.y = 0.3;
    group.add(center);

    // Stem
    const stemGeometry = new THREE.CylinderGeometry(0.04, 0.04, 1.5, 8);
    const stemMaterial = new THREE.MeshStandardMaterial({ color: 0x4a7c59 });
    const stem = new THREE.Mesh(stemGeometry, stemMaterial);
    stem.position.y = -1;
    group.add(stem);

    return group;
  };

  const createFlower = (flowerId: string) => {
    switch (flowerId) {
      case 'tulip':
        return createTulip();
      case 'daisy':
        return createDaisy();
      case 'lily':
        return createLily();
      case 'clover':
        return createClover();
      default:
        return createTulip();
    }
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf5f5f5);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 1, 4);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0xffffff, 0.5);
    pointLight.position.set(-5, 5, -5);
    scene.add(pointLight);

    const flower = createFlower(selectedFlower);
    flower.castShadow = true;
    scene.add(flower);
    flowerRef.current = flower;

    const groundGeometry = new THREE.PlaneGeometry(10, 10);
    const groundMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -2;
    ground.receiveShadow = true;
    scene.add(ground);

    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);

      if (flowerRef.current && isRotating) {
        flowerRef.current.rotation.y += 0.01;
      }

      if (isDragging) {
        camera.position.x += (mousePosition.x * 2 - camera.position.x) * 0.1;
        camera.position.y += (mousePosition.y * 2 + 1 - camera.position.y) * 0.1;
        camera.lookAt(0, 0, 0);
      }

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!containerRef.current || !camera || !renderer) return;
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      setMousePosition({ x, y });
    };

    const handleMouseDown = () => setIsDragging(true);
    const handleMouseUp = () => setIsDragging(false);

    containerRef.current.addEventListener('mousemove', handleMouseMove);
    containerRef.current.addEventListener('mousedown', handleMouseDown);
    containerRef.current.addEventListener('mouseup', handleMouseUp);
    containerRef.current.addEventListener('mouseleave', handleMouseUp);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (containerRef.current) {
        containerRef.current.removeEventListener('mousemove', handleMouseMove);
        containerRef.current.removeEventListener('mousedown', handleMouseDown);
        containerRef.current.removeEventListener('mouseup', handleMouseUp);
        containerRef.current.removeEventListener('mouseleave', handleMouseUp);
      }
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (renderer) {
        renderer.dispose();
      }
    };
  }, []);

  useEffect(() => {
    if (!sceneRef.current || !flowerRef.current) return;

    sceneRef.current.remove(flowerRef.current);
    const newFlower = createFlower(selectedFlower);
    newFlower.castShadow = true;
    sceneRef.current.add(newFlower);
    flowerRef.current = newFlower;
  }, [selectedFlower]);

  return (
    <div className="min-h-screen gradient-romantic relative">
      <FloatingHearts count={12} />
      
      <div className="container max-w-5xl mx-auto px-4 py-12">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl md:text-5xl font-heavy text-primary mb-4">
            3D Flower Viewer
          </h1>
          <p className="text-muted-foreground font-serif-italic">
            Explore beautiful flowers in 3D - Click and drag to rotate!
          </p>
        </motion.div>

        <motion.div
          className="flex flex-wrap justify-center gap-4 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {flowers.map((flower) => (
            <button
              key={flower.id}
              onClick={() => {
                setSelectedFlower(flower.id);
                playSound('sparkle');
              }}
              className={`px-6 py-3 rounded-lg transition-all ${
                selectedFlower === flower.id
                  ? 'bg-primary text-white scale-105'
                  : 'bg-white/50 text-muted-foreground hover:bg-white/80'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {flower.name}
            </button>
          ))}
        </motion.div>

        <motion.div
          ref={containerRef}
          className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-elevated mb-8 min-h-[500px] flex items-center justify-center relative overflow-hidden"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          {!containerRef.current && (
            <div className="text-muted-foreground">Loading 3D viewer...</div>
          )}
        </motion.div>

        <motion.div
          className="flex justify-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <button
            onClick={() => {
              setIsRotating(!isRotating);
              playSound('buttonClick');
            }}
            className="px-6 py-3 bg-primary/10 text-primary rounded-lg hover:bg-primary/20"
          >
            {isRotating ? 'Pause' : 'Play'} Rotation
          </button>
          <button
            onClick={() => {
              if (cameraRef.current) {
                cameraRef.current.position.set(0, 1, 4);
                cameraRef.current.lookAt(0, 0, 0);
              }
              if (flowerRef.current) {
                flowerRef.current.rotation.y = 0;
              }
              playSound('buttonClick');
            }}
            className="px-6 py-3 bg-primary/10 text-primary rounded-lg hover:bg-primary/20"
          >
            Reset View
          </button>
        </motion.div>

        <motion.p
          className="text-center text-muted-foreground mt-8 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          💡 Tip: Click and drag to rotate the camera around the flower
        </motion.p>
      </div>
    </div>
  );
};

export default Flower3DViewer;
