import Navbar from './Navbar';
import Footer from './Footer';
import FloatingWhatsApp from './FloatingWhatsApp';
import ScrollToTop from './ScrollToTop';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      <Navbar />
      <main className="flex-grow pt-16">
        {children}
      </main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}
