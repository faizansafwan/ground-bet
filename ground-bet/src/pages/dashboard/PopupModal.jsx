import { X, User, Phone, Home, Users, DollarSign } from "lucide-react";
import { useEffect, useState } from "react";
import congrat1 from '../../assets/congrat1.wav';
import confetti from "canvas-confetti";


export default function PopupModal({ data, onClose }) {
  const { firstName, lastName, contact, address, donation } = data;

  const slots = Math.ceil(donation / 25000);

  const [modalAnimation, setModalAnimation] = useState("animate-fade-in-scale six-hit-animation");
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    // Play congratulatory audio
    const audio = new Audio(congrat1);
    audio.play().catch((e) => console.error("Failed to play sound:", e));

    // Fireworks animation for 2 seconds
    const duration = 3000; // 2 seconds
    const endTime = Date.now() + duration;

    const interval = setInterval(() => {
      if (Date.now() > endTime) {
        clearInterval(interval);
        return;
      }

      confetti({
        particleCount: 35,
        startVelocity: 40,
        spread: 360,
        ticks: 60,
        origin: {
          x: Math.random(),
          y: Math.random() * 0.4,
        },
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setModalAnimation("animate-fade-out-scale");
    setTimeout(() => {
      onClose(); // Call parent's close after animation ends
    }, 300); // duration should match your animation
  };

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center six-glow">
      <div className={`bg-white rounded-xl shadow-xl p-6 w-full max-w-xl ${modalAnimation} relative six-hit-animation`}>


        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition cursor-pointer"
        >
          <X size={20} />
        </button>

        {/* Personalized Heading */}
        <h2 className="text-3xl font-bold text-green-600 mb-3 text-center">
          🎉 Thank You, {firstName}!
        </h2>
        <p className="text-gray-700 text-lg text-center mb-6">
          We sincerely appreciate your generous contribution. Your support is truly valued.
        </p>


        {/* Info Card */}
        <div className="bg-gray-50 p-4 rounded-md shadow-sm space-y-4 text-gray-800 text-base">
          <div className="flex items-center gap-4  p-2">
            <User className="text-gray-500" size={20} />
            <span><strong>Name:</strong> {firstName} {lastName}</span>
          </div>

          <div className="flex items-center gap-4  p-2">
            <Phone className="text-gray-500" size={20} />
            <span><strong>Contact:</strong> {contact}</span>
          </div>

          <div className="flex items-center gap-4  p-2">
            <Home className="text-gray-500" size={20} />
            <span><strong>Address:</strong> {address || "—"}</span>
          </div>

          <div className="flex items-center gap-4  p-2">
            <DollarSign className="text-gray-500" size={20} />
            <span><strong>Donation:</strong> Rs. {donation.toLocaleString()}</span>
          </div>

          <div className="flex items-center gap-4  p-2">
            <Users className="text-gray-500" size={20} />
            <span><strong>Slots Reserved:</strong> {slots}</span>
          </div>
        </div>

        {/* Close Button */}
        {/* <div className="mt-6 text-right">
          <button
            onClick={onClose}
            className="bg-blue-400 hover:bg-blue-500 text-white px-4 py-2 rounded-md transition"
          >
            Close
          </button>
        </div> */}
      </div>
    </div>
  );
}
