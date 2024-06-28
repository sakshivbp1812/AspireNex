import Navbar from '@/components/Navbar';
// import Navbar from '../components/Navbar';
import { AuthProvider } from '@/contexts/authContext';
import Footer from '@/components/Footer';
// import { AuthProvider } from '../contexts/authContext';
import 'tailwindcss/tailwind.css'; // Ensure your Tailwind CSS setup is correctly imported here

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1">
          <Component {...pageProps} />
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default MyApp;
