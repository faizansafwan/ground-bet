export default function Header() {
    return (
      <header className="bg-gradient-to-r from-gray-600 to-gray-500 text-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-wide text-gray-800 cursor-pointer">
            <span className="text-blue-400">Ground</span> Bet
          </h1>
          {/* <nav className="space-x-6 text-sm md:text-base">
            <a href="#" className="hover:text-blue-400 transition">Home</a>
            <a href="#" className="hover:text-blue-400 transition">My Bets</a>
            <a href="#" className="hover:text-blue-400 transition">Login</a>
          </nav> */}
        </div>
      </header>
    );
  }
  