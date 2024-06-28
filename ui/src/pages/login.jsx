// pages/Login.js
import LoginForm from '../components/LoginForm';
import { useEffect } from 'react';

const Login = () => {
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
    <div className="min-h-screen flex items-center justify-center bg-gray-900 relative overflow-hidden">
      <canvas id="smokeCanvas" className="absolute inset-0" />
      <div className="z-10 bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-8 shadow-2xl w-full max-w-md">
        <h1 className="text-4xl font-bold text-white mb-6 text-center">Login</h1>
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;