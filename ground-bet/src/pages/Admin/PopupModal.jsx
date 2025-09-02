import { X } from "lucide-react";
import { useEffect, useState } from "react";
import congrat1 from '../../assets/congrat1.wav';
import confetti from "canvas-confetti";
import bgImg from "../../assets/bgImg.jpg";

export default function PopupModal({ data, onClose }) {
  const { firstName, donation } = data ?? {};
  const [modalAnimation, setModalAnimation] = useState("animate-fade-in-scale six-hit-animation");
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);

  useEffect(() => {
    const handleResize = () => {
      setWindowHeight(window.innerHeight);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const audio = new Audio(congrat1);
    audio.play().catch(() => {});
    
    const duration = 3000;
    const endTime = Date.now() + duration;
    const interval = setInterval(() => {
      if (Date.now() > endTime) return clearInterval(interval);
      confetti({
        particleCount: 35,
        startVelocity: 40,
        spread: 360,
        ticks: 60,
        origin: { x: Math.random(), y: Math.random() * 0.4 },
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const handleClose = () => {
    setModalAnimation("animate-fade-out-scale");
    setTimeout(() => onClose(), 300);
  };

  const bgUrl = (bgImg && (bgImg.src ?? bgImg)) || "";

  // Calculate responsive text sizes based on window height
  const getResponsiveTextSize = () => {
    if (windowHeight < 600) return 'xs';
    if (windowHeight < 700) return 'sm';
    if (windowHeight < 800) return 'base';
    return 'lg';
  };

  const textSize = getResponsiveTextSize();
  const headingSize = windowHeight < 600 ? 'text-2xl' : (windowHeight < 700 ? 'text-3xl' : 'text-4xl');

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/40">
      <div
        className={`relative w-full max-w-xl h-full max-h-[97vh] rounded-xl overflow-hidden flex flex-col ${modalAnimation}`}
        style={{
          backgroundImage: `url("${bgUrl}")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/40"></div>

        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 z-30 bg-black/40 hover:bg-black/60 text-white rounded-full  p-2 transition"
          aria-label="Close"
        >
          <X size={20} className="hover:text-gray-300" />
        </button>

        {/* Top - THANK YOU + NAME */}
        <div className="relative z-20 flex flex-col items-center p-4 text-center text-white flex-shrink-0">
          <h2 className={`font-bold text-3xl drop-shadow-lg  bg-gradient-to-r from-[#a66233] to-[#fed470] bg-clip-text text-transparent `}
          >
            THANK YOU, <br /> {firstName}!
          </h2>
        </div>

        {/* Spacer - This will center the donation */}
        <div className="flex-grow flex items-center justify-center mb-13">
          <span className="font-bold">
            <span
              className="px-2 py-2 rounded-lg inline-block font-bold text-white text-2xl"
              
            >
              Rs. {(donation || 0).toLocaleString("en-IN", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </span>
        </div>

        {/* Bottom content - Fixed at the bottom */}
        <div className="relative z-20 flex flex-col items-center text-center text-white flex-shrink-0 p-4 mb-2">
  	      
          <p className={`uppercase mt-1 text-md font-bold`}>WE SINCERELY APPRECIATE YOUR GENEROUS CONTRIBUTION</p>
          <p className={`uppercase text-md font-bold`}>YOUR SUPPORT IS TRULY VALUED</p>
          <p className={`uppercase font-semibold mt-4 text-${textSize}`}>JAZAKUMULLAHU KHAIRA FOR YOUR CONTRIBUTION</p>
        </div>
      </div>
    </div>
  );
}