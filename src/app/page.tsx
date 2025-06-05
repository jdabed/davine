'use client';

import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Camera, Clock, Music, Star, Sparkles } from 'lucide-react';

// Passcode Screen Component (moved outside to prevent re-creation)
const PasscodeScreen = ({ 
  passcode, 
  setPasscode, 
  isWrongPasscode, 
  handlePasscodeSubmit 
}: {
  passcode: string;
  setPasscode: (value: string) => void;
  isWrongPasscode: boolean;
  handlePasscodeSubmit: (e: React.FormEvent) => void;
}) => {
  // Use stable positions to prevent re-renders when typing
  const stableHeartPositions = useMemo(() => 
    Array(8).fill(null).map((_, i) => ({
      left: `${(i * 12 + 10) % 90 + 5}%`,
      top: `${(i * 17 + 5) % 80 + 10}%`,
    })), []
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100 flex items-center justify-center relative overflow-hidden">
      {/* Background Hearts */}
      <div className="absolute inset-0">
        {stableHeartPositions.map((position, i) => (
          <motion.div
            key={i}
            className="absolute text-pink-200 text-2xl pointer-events-none select-none"
            style={{
              left: position.left,
              top: position.top,
            }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 4 + (i % 3),
              repeat: Infinity,
              delay: i * 0.5,
            }}
          >
            💕
          </motion.div>
        ))}
      </div>

      <motion.div 
        className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-pink-200 max-w-md w-full mx-4"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <h1 className="text-4xl font-dancing-script font-bold text-pink-600 mb-4">
            💝 Special Surprise 💝
          </h1>
          <p className="text-purple-700 font-inter text-lg">
            Enter the special date to unlock your surprise
          </p>
        </motion.div>

        <form onSubmit={handlePasscodeSubmit} className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <input
              type="password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="Enter passcode"
              className={`w-full px-4 py-4 text-center text-2xl font-mono tracking-widest rounded-2xl border-2 transition-all duration-300 ${
                isWrongPasscode 
                  ? 'border-red-300 bg-red-50 animate-pulse' 
                  : 'border-pink-200 bg-white/70 focus:border-pink-400 focus:bg-white'
              } focus:outline-none focus:ring-4 focus:ring-pink-200`}
              maxLength={6}
            />
          </motion.div>

          {isWrongPasscode && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-500 text-center font-inter"
            >
              ❌ Wrong passcode! Try again 💕
            </motion.div>
          )}

          <motion.button
            type="submit"
            className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-4 px-6 rounded-2xl font-inter font-semibold text-lg hover:from-pink-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-pink-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Unlock My Surprise 💖
          </motion.button>
        </form>

        <motion.div 
          className="mt-6 text-center text-pink-400 text-sm font-inter"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          Made with endless love just for you 💕
        </motion.div>
      </motion.div>
    </div>
  );
};

export default function MonthsaryPage() {
  const [timeData, setTimeData] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    months: 0,
    years: 0
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [mouseTrail, setMouseTrail] = useState<Array<{id: number, x: number, y: number, timestamp: number}>>([]);
  const [windowSize, setWindowSize] = useState({ width: 800, height: 600 });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [isWrongPasscode, setIsWrongPasscode] = useState(false);

  const CORRECT_PASSCODE = '050921';
  const trailIdRef = useRef(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Photo gallery placeholder images
  const photos = [
    '/photos/photo1.jpg',
    '/photos/photo2.jpg',
    '/photos/photo3.jpg',
    '/photos/photo4.jpg',
    '/photos/photo5.jpg',
    '/photos/photo6.jpg'
  ];

  // Things I love about her
  const loveItems = [
    "Your beautiful smile that lights up my world",
    "The way you laugh at my silly jokes",
    "Your kind and caring heart",
    "How you make everything better just by being there",
    "How hard you work",
    "The way you sing and dance",
    "Your incredible strength and determination",
    "How you always believe in me",
    "Your cute little habits that make me smile",
    "The way you love me unconditionally"
  ];

  // Stable mouse move handler using useCallback
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const newTrail = {
      id: trailIdRef.current++,
      x: e.clientX,
      y: e.clientY,
      timestamp: Date.now()
    };
    
    setMouseTrail(prev => [...prev.slice(-6), newTrail]);
  }, []);

  // Auto-rotate gallery (only when authenticated)
  useEffect(() => {
    if (!isAuthenticated) return;
    
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % photos.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [photos.length, isAuthenticated]);

  // Mouse trail effect (only when authenticated)
  useEffect(() => {
    if (typeof window === 'undefined' || !isAuthenticated) return;

    document.addEventListener('mousemove', handleMouseMove);
    
    // Clean up old trail items based on timestamp
    const cleanup = setInterval(() => {
      const now = Date.now();
      setMouseTrail(prev => prev.filter(item => now - item.timestamp < 3000));
    }, 100);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      clearInterval(cleanup);
    };
  }, [handleMouseMove, isAuthenticated]);

  // Calculate time since May 9, 2021 (only when authenticated)
  useEffect(() => {
    if (!isAuthenticated) return;
    
    const startDate = new Date('2021-05-09T00:00:00');
    
    const updateTime = () => {
      const now = new Date();
      
      // Calculate accurate years, months, and days
      let years = now.getFullYear() - startDate.getFullYear();
      let months = now.getMonth() - startDate.getMonth();
      let days = now.getDate() - startDate.getDate();
      
      // Adjust for negative days
      if (days < 0) {
        months--;
        const lastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        days += lastMonth.getDate();
      }
      
      // Adjust for negative months
      if (months < 0) {
        years--;
        months += 12;
      }
      
      // Calculate remaining time components
      const totalMs = now.getTime() - startDate.getTime();
      const totalDays = Math.floor(totalMs / (1000 * 60 * 60 * 24));
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();
      
      setTimeData({ 
        years, 
        months, 
        days, 
        hours, 
        minutes, 
        seconds 
      });
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  // Window size effect
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
      
      const handleResize = () => {
        setWindowSize({ width: window.innerWidth, height: window.innerHeight });
      };
      
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  // Handle passcode submission
  const handlePasscodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === CORRECT_PASSCODE) {
      setIsAuthenticated(true);
    } else {
      setIsWrongPasscode(true);
      setPasscode('');
      setTimeout(() => setIsWrongPasscode(false), 2000);
    }
  };

  // Handle music play/pause
  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => {
          console.log('Audio play failed:', e);
          // Handle autoplay restrictions
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Return passcode screen if not authenticated
  if (!isAuthenticated) {
    return <PasscodeScreen passcode={passcode} setPasscode={setPasscode} isWrongPasscode={isWrongPasscode} handlePasscodeSubmit={handlePasscodeSubmit} />;
  }

  // Floating hearts animation
  const FloatingHeart = ({ delay, index, windowSize }: { delay: number; index: number; windowSize: {width: number, height: number} }) => {
    const [positions, setPositions] = useState({
      startX: (windowSize.width / 6) * (index + 1),
      endX: (windowSize.width / 6) * (index + 1)
    });
    
    // Set random positions only on client side to avoid hydration mismatch
    useEffect(() => {
      const startX = (windowSize.width / 6) * (index + 1) + (Math.random() - 0.5) * 100;
      const endX = startX + (Math.random() - 0.5) * 200;
      setPositions({ startX, endX });
    }, [index, windowSize.width]);
    
    return (
      <motion.div
        className="absolute text-pink-300 text-xl pointer-events-none select-none"
        initial={{ 
          x: positions.startX,
          y: windowSize.height + 20,
          opacity: 0,
          rotate: 0,
          scale: 0.8
        }}
        animate={{
          y: -100,
          x: positions.endX,
          opacity: [0, 0.7, 0.5, 0],
          rotate: [0, 10, -10, 0],
          scale: [0.8, 1, 1.1, 0.9]
        }}
        transition={{
          duration: 12,
          delay,
          repeat: Infinity,
          ease: "easeInOut",
          times: [0, 0.2, 0.8, 1]
        }}
      >
        💕
      </motion.div>
    );
  };

  // Mouse trail particle component
  const MouseTrailParticle = ({ x, y, index, id, timestamp }: { x: number, y: number, index: number, id: number, timestamp: number }) => {
    const age = (Date.now() - timestamp) / 1000; // Age in seconds
    const baseOpacity = Math.max(0.05, 0.7 - index * 0.1);
    const ageOpacity = Math.max(0, 1 - age / 1.5); // Fade over 1.5 seconds
    
    return (
      <motion.div
        key={id}
        className="fixed pointer-events-none select-none z-50"
        style={{ left: x - 4, top: y - 4 }}
        initial={{ opacity: baseOpacity, scale: 1 }}
        animate={{ 
          opacity: baseOpacity * ageOpacity,
          scale: Math.max(0.3, 1 - index * 0.1)
        }}
        transition={{ 
          duration: 0.3,
          ease: "easeOut"
        }}
      >
        <div 
          className="w-2 h-2 rounded-full bg-gradient-to-br from-pink-300 to-purple-300"
          style={{ 
            opacity: 0.6,
            filter: 'blur(0.5px)',
            boxShadow: '0 0 8px rgba(236, 72, 153, 0.4)'
          }}
        />
      </motion.div>
    );
  };

  // Background hearts particle system
  const BackgroundHeart = ({ delay, index, windowSize }: { delay: number; index: number; windowSize: {width: number, height: number} }) => {
    const [heartConfig, setHeartConfig] = useState({
      startX: 400,
      endX: 400,
      duration: 20,
      heartSize: 0.75,
      opacity: 0.15,
      heartEmoji: '💕'
    });
    
    // Set random values only on client side to avoid hydration mismatch
    useEffect(() => {
      const hearts = ['💕', '💖', '💝', '💗', '💓', '💞'];
      setHeartConfig({
        startX: Math.random() * windowSize.width,
        endX: Math.random() * windowSize.width + (Math.random() - 0.5) * 300,
        duration: 15 + Math.random() * 10,
        heartSize: 0.5 + Math.random() * 0.5,
        opacity: 0.1 + Math.random() * 0.15,
        heartEmoji: hearts[index % hearts.length]
      });
    }, [index, windowSize.width]);
    
    return (
      <motion.div
        className="absolute pointer-events-none select-none"
        style={{ 
          fontSize: `${heartConfig.heartSize}rem`,
          color: `rgba(236, 72, 153, ${heartConfig.opacity})`,
          filter: 'blur(0.5px)'
        }}
        initial={{ 
          x: heartConfig.startX,
          y: windowSize.height + 50,
          opacity: 0,
          rotate: 0,
          scale: 0.5
        }}
        animate={{
          y: -100,
          x: heartConfig.endX,
          opacity: [0, heartConfig.opacity, heartConfig.opacity * 0.8, 0],
          rotate: [0, 180, 360],
          scale: [0.5, heartConfig.heartSize, heartConfig.heartSize * 1.2, 0.3]
        }}
        transition={{
          duration: heartConfig.duration,
          delay,
          repeat: Infinity,
          ease: "easeInOut",
          times: [0, 0.3, 0.7, 1]
        }}
      >
        {heartConfig.heartEmoji}
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100 relative overflow-hidden">
      {/* Mouse Trail Particles */}
      {mouseTrail.map((trail, index) => (
        <MouseTrailParticle 
          key={trail.id}
          x={trail.x} 
          y={trail.y} 
          index={index}
          id={trail.id}
          timestamp={trail.timestamp}
        />
      ))}
      
      {/* Simple Floating Hearts Background */}
      <div className="absolute inset-0">
        {[...Array(10)].map((_, i) => {
          // Create stable positions based on index to prevent jumping
          const position = {
            left: `${(i * 11) % 100}%`,
            top: `${(i * 13) % 100}%`
          };
          
          return (
            <motion.div
              key={i}
              className="absolute text-pink-200 text-2xl pointer-events-none select-none"
              style={{
                left: position.left,
                top: position.top,
              }}
              animate={{
                y: [0, -20, 0],
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 4 + (i % 3),
                repeat: Infinity,
                delay: i * 0.8,
              }}
            >
              💕
            </motion.div>
          );
        })}
      </div>
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-repeat" style={{
          backgroundImage: "radial-gradient(circle, #ec4899 1px, transparent 1px)",
          backgroundSize: "30px 30px"
        }}></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        
        {/* Welcome Section */}
        <motion.section 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <motion.h1 
            className="text-6xl md:text-8xl font-dancing-script font-bold text-pink-600 mb-4"
            animate={{ 
              scale: [1, 1.05, 1],
              color: ["rgb(219, 39, 119)", "rgb(168, 85, 247)", "rgb(219, 39, 119)"]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            Happy Monthsary, Love! 💕
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl text-purple-700 font-inter"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            You make every day feel like a fairytale ✨
          </motion.p>
        </motion.section>

        {/* Countdown Timer */}
        <motion.section 
          className="mb-16"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-pink-200">
            <h2 className="text-3xl font-dancing-script font-bold text-center text-pink-600 mb-6">
              <Clock className="inline mr-2" size={32} />
              Our Love Story Timeline
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              {[
                { label: 'Years', value: timeData.years },
                { label: 'Months', value: timeData.months },
                { label: 'Days', value: timeData.days },
                { label: 'Hours', value: timeData.hours },
                { label: 'Minutes', value: timeData.minutes },
                { label: 'Seconds', value: timeData.seconds }
              ].map((item, index) => (
                <motion.div 
                  key={item.label}
                  className="text-center bg-gradient-to-br from-pink-100 to-purple-100 rounded-2xl p-4"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ 
                    duration: 2,
                    delay: index * 0.2,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                >
                  <div className="text-2xl md:text-3xl font-bold text-pink-600">
                    {item.value.toString().padStart(2, '0')}
                  </div>
                  <div className="text-sm text-purple-600 font-inter">
                    {item.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Love Letter Section */}
        <motion.section 
          className="mb-16"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.5, duration: 0.8 }}
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-pink-200">
            <h2 className="text-3xl font-dancing-script font-bold text-center text-pink-600 mb-6">
              💌 A Letter From My Heart
            </h2>
            <div className="prose prose-lg max-w-none text-gray-700 font-inter leading-relaxed">
              <p className="text-lg mb-4">
                My Dearest Love,
              </p>
              <p className="mb-4">
                From your presence, I am always reminded how I've already won in life. 
                From the moment I wake up to when I fall asleep, you're the first and last thing on my mind. 
                Your smile brightens even my darkest days, and your laughter is the most beautiful sound in the world.
              </p>
              <p className="mb-4">
                I love how you act like a baby around me. You make me want to be a better person, 
                and I'm so blessed to have you in my life. Thank you for being my partner, my best friend, 
                and my greatest love.
              </p>
              <p className="mb-4">
                Here's to many more months, years, and memories together. I love you more than words can express.
              </p>
              <p className="text-right">
                Forever yours,<br />
                David (Babu) 💕
              </p>
            </div>
        </div>
        </motion.section>

        {/* Photo Gallery */}
        <motion.section 
          className="mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 0.8 }}
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-pink-200">
            <h2 className="text-3xl font-dancing-script font-bold text-center text-pink-600 mb-6">
              <Camera className="inline mr-2" size={32} />
              Our Beautiful Memories
            </h2>
            <div className="relative max-w-md mx-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentImageIndex}
                  className="relative w-full aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-pink-200 to-purple-200"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.5 }}
                >
                  <img
                    src={photos[currentImageIndex]}
                    alt={`Beautiful memory ${currentImageIndex + 1}`}
                    className="w-full h-full object-cover rounded-2xl"
                    onError={(e) => {
                      // Fallback if image doesn't exist
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = `
                          <div class="w-full h-full flex items-center justify-center text-gray-600 text-lg font-inter bg-gradient-to-br from-pink-200 to-purple-200">
                            📸 Photo ${currentImageIndex + 1}: Add your photo as /photos/photo${currentImageIndex + 1}.jpg
                          </div>
                        `;
                      }
                    }}
                  />
                  {/* Romantic overlay effect */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent rounded-2xl pointer-events-none" />
                  {/* Love emoji overlay */}
                  <div className="absolute top-4 right-4 text-white text-2xl drop-shadow-lg">💕</div>
                </motion.div>
              </AnimatePresence>
              <div className="flex justify-center mt-4 space-x-2">
                {photos.map((_, index) => (
                  <button
                    key={index}
                    className={`w-3 h-3 rounded-full transition-all ${
                      index === currentImageIndex ? 'bg-pink-500' : 'bg-pink-200'
                    }`}
                    onClick={() => setCurrentImageIndex(index)}
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        {/* Things I Love About You */}
        <motion.section 
          className="mb-16"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 2.5, duration: 0.8 }}
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-pink-200">
            <h2 className="text-3xl font-dancing-script font-bold text-center text-pink-600 mb-8">
              <Star className="inline mr-2" size={32} />
              Things I Love About You
            </h2>
            <div className="grid gap-4">
              {loveItems.map((item, index) => (
                <motion.div
                  key={index}
                  className="flex items-start space-x-3 p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 3 + index * 0.1, duration: 0.5 }}
                  whileHover={{ scale: 1.02, x: 10 }}
                >
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    💖
                  </motion.div>
                  <p className="text-gray-700 font-inter leading-relaxed">{item}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Music Player */}
        <motion.section 
          className="mb-16"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 3.5, duration: 0.8 }}
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-pink-200">
            <h3 className="text-3xl font-dancing-script font-bold text-pink-600 mb-6 text-center">
              <Music className="inline mr-2" size={32} />
              Our Love Song
            </h3>
            
            {/* Audio Element */}
            <audio 
              ref={audioRef}
              loop
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              className="hidden"
            >
              <source src="/music/love-song.mp3" type="audio/mpeg" />
              <source src="/music/love-song.wav" type="audio/wav" />
              Your browser does not support the audio element.
            </audio>

            {/* Song Info */}
            <div className="text-center mb-6">
              <div className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-2xl p-6 mb-4">
                <h4 className="text-xl font-inter font-semibold text-gray-800 mb-2">
                  🎵 "I want to grow old with you"
                </h4>
                <p className="text-gray-600 font-inter text-sm">
                  Our special song that always reminds me of you 💕
                </p>
              </div>
            </div>

            {/* Music Controls */}
            <div className="flex flex-col items-center space-y-4">
              {/* Play/Pause Button */}
              <motion.button
                onClick={toggleMusic}
                className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full font-inter font-medium hover:from-pink-600 hover:to-purple-600 transition-all transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-pink-300 flex items-center justify-center text-2xl"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {isPlaying ? '⏸️' : '▶️'}
              </motion.button>

              {/* Music Status */}
              <motion.div 
                className="text-center"
                animate={{ 
                  scale: isPlaying ? [1, 1.02, 1] : 1,
                  color: isPlaying ? ["rgb(219, 39, 119)", "rgb(168, 85, 247)", "rgb(219, 39, 119)"] : "rgb(107, 114, 128)"
                }}
                transition={{ 
                  duration: 2,
                  repeat: isPlaying ? Infinity : 0,
                  ease: "easeInOut"
                }}
              >
                <p className="font-inter text-sm">
                  {isPlaying ? '🎶 Playing our love song... 🎶' : '🎵 Click to play our special song 🎵'}
                </p>
              </motion.div>

              {/* Volume Control */}
              <div className="flex items-center space-x-3 w-full max-w-xs">
                <span className="text-gray-500 text-sm">🔉</span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  defaultValue="0.7"
                  onChange={(e) => {
                    if (audioRef.current) {
                      audioRef.current.volume = parseFloat(e.target.value);
                    }
                  }}
                  className="flex-1 h-2 bg-pink-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <span className="text-gray-500 text-sm">🔊</span>
              </div>

              {/* Music Note Animation */}
              {isPlaying && (
                <motion.div 
                  className="flex space-x-2 text-pink-400"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                >
                  <span>♫</span>
                  <motion.span
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 1, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                  >
                    ♪
                  </motion.span>
                  <motion.span
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 1, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
                  >
                    ♫
                  </motion.span>
                </motion.div>
              )}
            </div>

          
          </div>
        </motion.section>

        {/* Footer */}
        <motion.footer 
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 4, duration: 1 }}
        >
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-pink-200">
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Sparkles className="text-pink-500 mx-auto mb-2" size={32} />
            </motion.div>
            <p className="text-pink-600 font-dancing-script text-2xl font-bold">
              Made with endless love for you 💕
            </p>
            <p className="text-purple-600 font-inter text-sm mt-2">
              Happy Monthsary, babu! Here's to forever with you ✨
            </p>
          </div>
        </motion.footer>
      </div>
    </div>
  );
}
