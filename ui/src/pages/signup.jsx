// pages/Signup.js
import SignupForm from '../components/SignupForm';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Head from 'next/head';

const movingSvgs = [
  '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-full h-full text-blue-500 opacity-20"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>',
  '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-full h-full text-purple-500 opacity-20"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>',
  '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-full h-full text-green-500 opacity-20"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>',
  '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-full h-full text-pink-500 opacity-20"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" /></svg>',
];

const staticSvgs = [
  '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-full h-full text-blue-500 opacity-10"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>',
  '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-full h-full text-purple-500 opacity-10"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>',
  '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-full h-full text-green-500 opacity-10"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" /></svg>',
];

const MovingSVG = ({ svg, size }) => {
  const randomPosition = () => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
  });

  const start = randomPosition();
  const end = randomPosition();

  return (
    <motion.div
      className="absolute"
      style={{
        width: size,
        height: size,
      }}
      initial={{
        x: `${start.x}vw`,
        y: `${start.y}vh`,
        scale: Math.random() * 0.5 + 0.5,
        rotate: Math.random() * 360,
      }}
      animate={{
        x: [`${start.x}vw`, `${end.x}vw`],
        y: [`${start.y}vh`, `${end.y}vh`],
        rotate: [0, 360],
        scale: [Math.random() * 0.5 + 0.5, Math.random() * 0.5 + 1],
      }}
      transition={{
        repeat: Infinity,
        repeatType: "reverse",
        duration: 20 + Math.random() * 10,
        ease: "linear"
      }}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
};

const Signup = () => {
  const movingSVGs = Array(20).fill().map((_, i) => {
    const svg = movingSvgs[i % movingSvgs.length];
    const size = 60 + Math.random() * 80;
    return <MovingSVG key={i} svg={svg} size={size} />;
  });

  useEffect(() => {
    const canvas = document.getElementById('smokeCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const particleCount = 100;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: canvas.height,
        radius: Math.random() * 3 + 2,
        speed: Math.random() * 1 + 0.5,
        opacity: Math.random() * 0.5 + 0.1,
      });
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particleCount; i++) {
        let p = particles[i];
        ctx.beginPath();
        let gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
        gradient.addColorStop(0, `rgba(255, 255, 255, ${p.opacity})`);
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = gradient;
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();

        p.y -= p.speed;
        p.x += Math.sin(p.y * 0.03) * 0.5;

        if (p.y < 0) {
          p.y = canvas.height;
          p.x = Math.random() * canvas.width;
        }
      }

      requestAnimationFrame(animate);
    }

    animate();

    return () => cancelAnimationFrame(animate);
  }, []);

  return (
    <>
      <Head>
        <title>Sign Up - Secure Access</title>
      </Head>
      <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-gray-900 via-black to-gray-800 relative overflow-hidden">
        <canvas id="smokeCanvas" className="absolute inset-0" />
        
        {/* Additional background element */}
        <div className="absolute inset-0 bg-[url('/circuit-board.svg')] opacity-5"></div>

        {/* Static background SVGs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-1/3 h-1/3" dangerouslySetInnerHTML={{ __html: staticSvgs[0] }} />
          <div className="absolute top-1/3 right-0 w-1/2 h-1/2" dangerouslySetInnerHTML={{ __html: staticSvgs[1] }} />
          <div className="absolute bottom-0 left-1/4 w-2/5 h-2/5" dangerouslySetInnerHTML={{ __html: staticSvgs[2] }} />
        </div>

        {/* Moving background SVGs */}
        {movingSVGs}

        <motion.div
          className="z-10 flex items-center justify-center mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-500 mr-4" viewBox="0 0 20 20" fill="currentColor">
            <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
          </svg>
          <h1 className="text-5xl text-white font-bold">Sign Up</h1>
        </motion.div>
        <SignupForm />
      </div>
    </>
  );
};

export default Signup;
