import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import { useSound } from '@/hooks/useSound';

interface Car {
  id: string;
  name: string;
  team: string;
  driver: string;
  color: string;
  hexColor: number;
}

const cars: Car[] = [
  { id: 'redbull', name: 'Red Bull', team: 'Red Bull Racing', driver: 'VER', color: '#1e41ff', hexColor: 0x1e41ff },
  { id: 'mercedes', name: 'Mercedes', team: 'Mercedes-AMG', driver: 'HAM', color: '#00d2be', hexColor: 0x00d2be },
  { id: 'ferrari', name: 'Ferrari', team: 'Scuderia Ferrari', driver: 'LEC', color: '#dc143c', hexColor: 0xdc143c },
  { id: 'mclaren', name: 'McLaren', team: 'McLaren F1', driver: 'NOR', color: '#ff8700', hexColor: 0xff8700 },
  { id: 'alpine', name: 'Alpine', team: 'Alpine F1', driver: 'OCO', color: '#0090ff', hexColor: 0x0090ff },
  { id: 'aston', name: 'Aston Martin', team: 'Aston Martin', driver: 'ALO', color: '#00665e', hexColor: 0x00665e },
];

const F1Racing = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const playerCarRef = useRef<THREE.Group | null>(null);
  const animationIdRef = useRef<number | null>(null);
  
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [isRacing, setIsRacing] = useState(false);
  const [raceFinished, setRaceFinished] = useState(false);
  const [speed, setSpeed] = useState(0);
  const [position, setPosition] = useState({ x: 0, z: 0 });
  const [keys, setKeys] = useState({ up: false, left: false, right: false });
  const [raceTime, setRaceTime] = useState(0);
  const [bestTime, setBestTime] = useState<number | null>(() => {
    const saved = localStorage.getItem('f1BestTime');
    return saved ? parseFloat(saved) : null;
  });
  const { playSound } = useSound();

  const createF1Car = (color: number): THREE.Group => {
    const group = new THREE.Group();

    // Main body
    const bodyGeometry = new THREE.BoxGeometry(0.8, 0.4, 1.6);
    const bodyMaterial = new THREE.MeshStandardMaterial({ color, metalness: 0.8, roughness: 0.2 });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 0.3;
    group.add(body);

    // Cockpit
    const cockpitGeometry = new THREE.BoxGeometry(0.5, 0.2, 0.6);
    const cockpitMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });
    const cockpit = new THREE.Mesh(cockpitGeometry, cockpitMaterial);
    cockpit.position.set(0, 0.5, 0.2);
    group.add(cockpit);

    // Front wing
    const frontWing = new THREE.Mesh(
      new THREE.BoxGeometry(1.2, 0.1, 0.3),
      bodyMaterial
    );
    frontWing.position.set(0, 0.1, 0.8);
    group.add(frontWing);

    // Rear wing
    const rearWing = new THREE.Mesh(
      new THREE.BoxGeometry(0.6, 0.3, 0.2),
      bodyMaterial
    );
    rearWing.position.set(0, 0.4, -0.8);
    group.add(rearWing);

    // Wheels
    const wheelGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.15, 16);
    const wheelMaterial = new THREE.MeshStandardMaterial({ color: 0x1a1a1a });
    const wheelPositions = [
      { x: -0.4, z: 0.5 },
      { x: 0.4, z: 0.5 },
      { x: -0.4, z: -0.5 },
      { x: 0.4, z: -0.5 },
    ];

    wheelPositions.forEach(({ x, z }) => {
      const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
      wheel.rotation.z = Math.PI / 2;
      wheel.position.set(x, 0.15, z);
      group.add(wheel);
    });

    return group;
  };

  useEffect(() => {
    if (!containerRef.current || !isRacing || !selectedCar) return;

    // Clear previous renderer
    if (rendererRef.current && containerRef.current.contains(rendererRef.current.domElement)) {
      containerRef.current.removeChild(rendererRef.current.domElement);
      rendererRef.current.dispose();
    }

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87ceeb);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 4, 8);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    const sunLight = new THREE.DirectionalLight(0xffffff, 1.0);
    sunLight.position.set(10, 20, 10);
    scene.add(sunLight);

    // Track
    const trackGeometry = new THREE.PlaneGeometry(20, 200);
    const trackMaterial = new THREE.MeshStandardMaterial({ color: 0x2a2a2a });
    const track = new THREE.Mesh(trackGeometry, trackMaterial);
    track.rotation.x = -Math.PI / 2;
    track.position.y = -0.5;
    scene.add(track);

    // Track markings
    for (let i = -100; i < 100; i += 4) {
      const line = new THREE.Mesh(
        new THREE.PlaneGeometry(0.3, 2),
        new THREE.MeshStandardMaterial({ color: 0xffff00 })
      );
      line.rotation.x = -Math.PI / 2;
      line.position.set(0, -0.49, i);
      scene.add(line);
    }

    // Ground
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(1000, 1000),
      new THREE.MeshStandardMaterial({ color: 0x90ee90 })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -1;
    scene.add(ground);

    // Create player car
    const playerCar = createF1Car(selectedCar.hexColor);
    playerCar.position.set(0, 0, 0);
    scene.add(playerCar);
    playerCarRef.current = playerCar;

    // Game state
    let playerZ = 0;
    let currentSpeed = 0;
    let playerX = 0;

    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);

      if (playerCarRef.current && !raceFinished) {
        // Acceleration
        if (keys.up) {
          currentSpeed = Math.min(100, currentSpeed + 2);
        } else {
          currentSpeed = Math.max(0, currentSpeed - 1);
        }

        // Movement
        playerZ += currentSpeed * 0.05;
        
        // Steering
        if (keys.left) {
          playerX = Math.max(-3, playerX - 0.15);
        } else if (keys.right) {
          playerX = Math.min(3, playerX + 0.15);
        } else {
          // Return to center
          playerX *= 0.9;
        }

        // Update car position
        playerCarRef.current.position.z = playerZ;
        playerCarRef.current.position.x = playerX;
        
        // Car rotation based on steering
        playerCarRef.current.rotation.z = (playerX / 3) * 0.3;

        // Update UI
        setSpeed(Math.round(currentSpeed));
        setPosition({ x: playerX, z: playerZ });

        // Camera follow
        camera.position.z = playerZ + 8;
        camera.position.y = 4;
        camera.lookAt(playerCarRef.current.position);

        // Check finish line (200 units = finish)
        if (playerZ >= 200) {
          finishRace();
        }
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

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
        animationIdRef.current = null;
      }
      if (rendererRef.current) {
        rendererRef.current.dispose();
        if (containerRef.current && containerRef.current.contains(rendererRef.current.domElement)) {
          containerRef.current.removeChild(rendererRef.current.domElement);
        }
        rendererRef.current = null;
      }
    };
  }, [isRacing, selectedCar, raceFinished, keys]);

  useEffect(() => {
    if (!isRacing || raceFinished) return;

    const interval = setInterval(() => {
      setRaceTime(prev => prev + 0.1);
    }, 100);

    return () => clearInterval(interval);
  }, [isRacing, raceFinished]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        setKeys(prev => ({ ...prev, up: true }));
      }
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        setKeys(prev => ({ ...prev, left: true }));
      }
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        setKeys(prev => ({ ...prev, right: true }));
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        setKeys(prev => ({ ...prev, up: false }));
      }
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        setKeys(prev => ({ ...prev, left: false }));
      }
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        setKeys(prev => ({ ...prev, right: false }));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const startRace = () => {
    if (!selectedCar) return;
    setIsRacing(true);
    setRaceFinished(false);
    setSpeed(0);
    setRaceTime(0);
    setPosition({ x: 0, z: 0 });
    playSound('success');
  };

  const finishRace = () => {
    setRaceFinished(true);
    playSound('success');
    
    if (!bestTime || raceTime < bestTime) {
      setBestTime(raceTime);
      localStorage.setItem('f1BestTime', raceTime.toString());
    }
  };

  const resetRace = () => {
    setIsRacing(false);
    setRaceFinished(false);
    setSpeed(0);
    setRaceTime(0);
    setPosition({ x: 0, z: 0 });
    setKeys({ up: false, left: false, right: false });
    playSound('buttonClick');
  };

  const formatTime = (time: number) => {
    const seconds = time.toFixed(1);
    return `${seconds}s`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black relative overflow-hidden">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_50%,_rgba(255,0,0,0.2),_transparent)]" />
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_50%,_rgba(0,255,255,0.2),_transparent)]" />
      </div>
      
      <div className="container max-w-7xl mx-auto px-4 py-6 relative z-10">
        <motion.div
          className="text-center mb-6"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 
            className="text-7xl md:text-9xl font-black text-white mb-2 tracking-tighter"
            style={{ 
              fontFamily: 'Inter, system-ui, sans-serif',
              fontWeight: 900,
              letterSpacing: '-0.05em',
              textShadow: '0 0 30px rgba(255,0,0,0.8), 0 0 60px rgba(255,0,0,0.5)'
            }}
          >
            FORMULA 1
          </h1>
          <p className="text-2xl text-gray-400 font-black tracking-widest">
            GRAND PRIX
          </p>
        </motion.div>

        {!selectedCar ? (
          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {cars.map((car) => (
              <motion.div
                key={car.id}
                className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-6 border-2 border-gray-700 cursor-pointer hover:border-red-500 transition-all"
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setSelectedCar(car);
                  playSound('buttonClick');
                }}
                style={{ boxShadow: `0 0 20px ${car.color}40` }}
              >
                <div
                  className="w-full h-32 rounded-lg mb-4 flex items-center justify-center text-6xl relative overflow-hidden"
                  style={{ backgroundColor: car.color + '20' }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[shimmer_2s_infinite]" />
                  🏎️
                </div>
                <h3 className="text-2xl font-black text-white mb-1">{car.name}</h3>
                <p className="text-sm text-gray-400 mb-1 font-bold">{car.team}</p>
                <p className="text-xs text-gray-500 mb-4 font-bold">Driver: {car.driver}</p>
              </motion.div>
            ))}
          </motion.div>
        ) : !isRacing ? (
          <motion.div
            className="max-w-3xl mx-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-8 border-2 border-gray-700 text-center">
              <div
                className="w-full h-64 rounded-lg mb-6 flex items-center justify-center text-8xl relative overflow-hidden"
                style={{ backgroundColor: selectedCar.color + '20', border: `4px solid ${selectedCar.color}` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_2s_infinite]" />
                🏎️
              </div>
              <h2 className="text-4xl font-black text-white mb-2">{selectedCar.name}</h2>
              <p className="text-gray-400 mb-1 font-bold">{selectedCar.team}</p>
              <p className="text-gray-500 mb-6 text-sm font-bold">Driver: {selectedCar.driver}</p>
              
              {bestTime && (
                <div className="mb-6 p-4 bg-red-900/30 rounded-lg border border-red-500/50">
                  <p className="text-sm text-gray-400 font-bold mb-1">BEST TIME</p>
                  <p className="text-3xl font-black text-red-400">{formatTime(bestTime)}</p>
                </div>
              )}

              <div className="flex gap-4 justify-center">
                <button
                  onClick={startRace}
                  className="px-12 py-5 bg-gradient-to-r from-red-600 to-red-700 text-white font-black text-xl rounded-lg hover:from-red-700 hover:to-red-800 transition-all shadow-lg shadow-red-500/50"
                  style={{ textShadow: '0 0 10px rgba(255,255,255,0.5)' }}
                >
                  START RACE
                </button>
                <button
                  onClick={() => {
                    setSelectedCar(null);
                    playSound('buttonClick');
                  }}
                  className="px-10 py-5 bg-gray-700 text-white font-bold rounded-lg hover:bg-gray-600"
                >
                  CHANGE CAR
                </button>
              </div>

              <p className="text-sm text-gray-500 mt-6 font-bold">
                💡 CONTROLS: UP/W = Accelerate • LEFT/RIGHT = Steer
              </p>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {/* HUD */}
            <div className="bg-black/90 backdrop-blur-sm rounded-lg p-4 border-2 border-gray-700">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-xs text-gray-400 font-bold mb-1">TIME</p>
                  <p className="text-2xl font-black text-white">{formatTime(raceTime)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-bold mb-1">SPEED</p>
                  <p className="text-2xl font-black text-red-400">{speed} MPH</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-bold mb-1">DISTANCE</p>
                  <p className="text-2xl font-black text-green-400">{Math.round(position.z)}m</p>
                </div>
              </div>
            </div>

            {/* 3D Race View */}
            <div
              ref={containerRef}
              className="bg-black rounded-lg border-2 border-gray-700 min-h-[500px] relative overflow-hidden"
            />

            {/* Controls Info */}
            <div className="bg-black/80 backdrop-blur-sm rounded-lg p-4 border-2 border-gray-700 text-center">
              <p className="text-sm text-gray-400 font-bold">
                {keys.up && '⬆️ Accelerating • '}
                {keys.left && '⬅️ Turning Left • '}
                {keys.right && '➡️ Turning Right'}
                {!keys.up && !keys.left && !keys.right && 'Press UP/W to accelerate'}
              </p>
            </div>

            {/* Reset Button */}
            <div className="text-center">
              <button
                onClick={resetRace}
                className="px-8 py-3 bg-gray-700 text-white font-bold rounded-lg hover:bg-gray-600"
              >
                RESET RACE
              </button>
            </div>
          </div>
        )}

        {/* Race Finished Modal */}
        <AnimatePresence>
          {raceFinished && (
            <motion.div
              className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-gradient-to-br from-gray-900 to-black rounded-lg p-12 border-4 border-yellow-500 text-center max-w-2xl"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              >
                <div className="text-8xl mb-6">🏆</div>
                <h2 className="text-6xl font-black text-white mb-4" style={{ textShadow: '0 0 30px rgba(255,255,0,0.8)' }}>
                  RACE FINISHED!
                </h2>
                <p className="text-4xl font-black text-yellow-400 mb-2">TIME: {formatTime(raceTime)}</p>
                {bestTime && raceTime < bestTime && (
                  <p className="text-green-400 font-black mb-6 text-3xl">🎉 NEW BEST TIME!</p>
                )}
                <button
                  onClick={resetRace}
                  className="px-12 py-5 bg-gradient-to-r from-red-600 to-red-700 text-white font-black text-xl rounded-lg hover:from-red-700 hover:to-red-800 transition-all"
                >
                  RACE AGAIN
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default F1Racing;
