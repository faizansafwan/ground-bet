import { useEffect, useState } from "react";
import Header from "../../components/Header";
import AddForm from "./BetForm";
import { getAllBets, deleteBetById, updateBetById, getTotalDonation } from "../../api/bets";
import SlotModal from "./BetUpdateForm";
import background from "../../assets/bg-img.jpg";
import EditForm from "./BetUpdateForm";
import DonationProgress from "../../components/DonationProgress";
import socket from "../../webSocket/socket"; 
import PopupModal from "./PopupModal";


export default function Dashboards() {
  const totalSlots = 920;
  const [slotsData, setSlotsData] = useState([]);
  const [columns, setColumns] = useState(10);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAnimation, setModalAnimation] = useState("animate-fade-in-scale");
  const [isEditing, setIsEditing] = useState(false);
  const [editedSlot, setEditedSlot] = useState(null);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [popupData, setPopupData] = useState(null); // data for PopupModal


  const [sumOfDonation, setSumOfDonation] = useState(0);

  const getOverlayOpacity = (count) => {
    const minOpacity = 0.05;
    const maxOpacity = 1;
    const ratio = count / totalSlots;
    return maxOpacity - ratio * (maxOpacity - minOpacity);
  };

  const getGroupedBets = (data) => {
    const grouped = {};
    data.forEach((bet) => {
      const key = `${bet.first_name}|${bet.last_name}|${bet.contact_no}|${bet.address}`;
      if (!grouped[key]) {
        grouped[key] = { ...bet, slot_count: 1 };
      } else {
        grouped[key].slot_count += 1;
      }
    });
    return Object.values(grouped);
  };
  

  useEffect(() => {
    loadSlots();
  }, []);

  const loadSlots = async () => {
    try {
      setHasError(false);
      setIsLoading(true);
      const res = await getAllBets();
      setSlotsData(res.data);

      const donationRes = await getTotalDonation();
      setSumOfDonation(donationRes.data);
    } catch (err) {
      console.error("Failed to fetch slots:", err);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {
    totalDonation(); // extract this for reuse
  }, [slotsData]);
  
  const totalDonation = async () => {
    try {
      setHasError(false); // reset before fetch
      setIsLoading(true); // start loading
      const res = await getTotalDonation();
      setSumOfDonation(res.data);
    } catch (err) {
      console.error("Failed to fetch slots:", err);
      setHasError(true); // set error state
    } finally {
      setIsLoading(false); // stop loading
    }
  };


  // 📌 Socket.IO listeners for live updates
  useEffect(() => {
    socket.on("betAdded", (newBets) => {
      if (Array.isArray(newBets)) {
        setSlotsData((prev) => [...prev, ...newBets]);
        const donationSum = newBets.reduce((sum, b) => sum + b.donation, 0);
        setSumOfDonation((prev) => prev + donationSum);
  
        // Show popup for the donation
        // Only show once per donation (grouped by first slot)
        if (newBets.length > 0) {
          const firstBet = newBets[0];
          setPopupData({
            firstName: firstBet.first_name,
            lastName: firstBet.last_name,
            contact: firstBet.contact_no,
            address: firstBet.address,
            donation: newBets.reduce((sum, b) => sum + b.donation, 0), // total donation
          });
        }
      } else {
        // fallback for single bet
        setSlotsData((prev) => [...prev, newBets]);
        setSumOfDonation((prev) => prev + newBets.donation);
        setPopupData({
          firstName: newBets.first_name,
          lastName: newBets.last_name,
          contact: newBets.contact_no,
          address: newBets.address,
          donation: newBets.donation,
        });
      }
    });

    socket.on("betUpdated", (updatedBet) => {
      setSlotsData((prev) =>
        prev.map((bet) => (bet.id === updatedBet.id ? updatedBet : bet))
      );
    });
  
    socket.on("betDeleted", (deletedBetId) => {
      setSlotsData((prev) => {
        const updated = prev.filter(
          (bet) => bet.id !== Number(deletedBetId) // ensure same type
        );
    
        const donationSum = updated.reduce((sum, b) => sum + b.donation, 0);
        setSumOfDonation(donationSum);
    
        return updated;
      });
    });
    
    
    
  
    return () => {
      socket.off("betAdded");
      socket.off("betUpdated");
      socket.off("betDeleted");
    };
  }, []);
  

  useEffect(() => {
    const updateColumns = () => {
      const width = window.innerWidth;
      if (width >= 908) setColumns(40);
      // else if (width >= 1024) setColumns(30);
      else if (width >= 768) setColumns(30);
      else if (width >= 640) setColumns(15);
      else setColumns(8);
    };
    updateColumns();
    window.addEventListener("resize", updateColumns);
    return () => window.removeEventListener("resize", updateColumns);
  }, []);

  const filledSlotIds = new Set(slotsData.map((slot) => slot.id));
  const filledCount = filledSlotIds.size;
  const emptyCount = totalSlots - filledCount;
  const overlayOpacity = getOverlayOpacity(filledCount);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white-500 via-yellow-400 to-red-700 text-white">
      <div
        className="min-h-screen transition-colors duration-500"
        
      >
        <Header />

        <div className=" p-3">
          {/* <div className="flex-column md:flex gap-3">
            <div className="w-full md:w-1/2 p-3">
              <AddForm refreshSlots={loadSlots} />
            </div>
          </div> */}

          {/* 🩸 Donation Progress - Sticky */}
          <div className=" top-0 z-50 w-full pb-7">
                <DonationProgress collected={sumOfDonation.total_donation || 0} target={90000000} />
          </div>

          <div className="px-3 md:flex md:gap-4">
            {/* <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 bg-gray-600 rounded-sm" />
                <span className="text-md text-gray-700">Filled</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 bg-gray-300 rounded-sm" />
                <span className="text-md text-gray-700">Available</span>
              </div>
            </div> */}

            {/* <div className="flex gap-3">
              <p className="text-md text-gray-700">
                Filled Slots: <strong>{filledCount}</strong>
              </p>
              <p className="text-md text-gray-700">
                Empty Slots: <strong>{emptyCount}</strong>
              </p>
            </div> */}


          </div>
        

          {isLoading ? (
            <div className="flex justify-center items-center mt-10">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-400 border-solid"></div>
              <span className="ml-4 text-blue-400 text-lg">Loading...</span>
            </div>
          ) : hasError ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4">
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">Failed to load data. Please reload and try again.</span>
              <button
                onClick={loadSlots}
                className="ml-4 px-3 py-1 bg-red-500 cursor-pointer text-white rounded hover:bg-red-600 transition"
              >
                Retry
              </button>
            </div>
          ) : (
            <>
            
              {/* 🧩 Virtual Puzzle Slots */}
              <div
                className="mt-3 grid"
                style={{
                  gridTemplateColumns: `repeat(${columns}, 1fr)`,
                }}
              >
                {[...Array(totalSlots)].map((_, i) => {
                  const slotId = i + 1;
                  const slotData = slotsData.find((slot) => slot.id === slotId);
                  const isFilled = !!slotData;

                  const col = i % columns;
                  const row = Math.floor(i / columns);
                  const rows = Math.ceil(totalSlots / columns);

                  return (
                    <div
                      key={slotId}
                      title={isFilled ? `${slotData.first_name} ${slotData.last_name}` : `Slot ${slotId}`}
                      onClick={() => {
                        if (slotData) {
                          setSelectedSlot(slotData);
                          setEditedSlot({ ...slotData });
                          setModalAnimation("animate-fade-in-scale");
                          setIsModalOpen(true);
                        }
                      }}
                      className={`relative aspect-square w-full cursor-pointer transition-all duration-300 ${
                        !isFilled ? "grayscale" : " "
                      }`}
                      style={{
                        backgroundImage: `url(${background})`,
                        backgroundSize: `${columns * 100}% ${rows * 100}%`,
                        backgroundPosition: `${(col / (columns - 1)) * 100}% ${(row / (rows - 1)) * 100}%`,
                      }}
                    >
                      
                      {!isFilled && (
                        <div className="absolute bg-black/40 inset-0 border border-white rounded-lg pointer-events-none" />
                      )}
                     

                      {/* <span className="absolute bottom-1 right-1 text-[10px] text-white font-semibold">
                        {slotId}
                      </span> */}
                    </div>
                  );
                })}
              </div>

              {/* ✏️ Edit Modal */}
              {isModalOpen && selectedSlot && (
                <EditForm
                  selectedSlot={selectedSlot}
                  editedSlot={editedSlot}
                  setEditedSlot={setEditedSlot}
                  isEditing={isEditing}
                  setIsEditing={setIsEditing}
                  setIsModalOpen={setIsModalOpen}
                  setSlotsData={setSlotsData}
                  updateBetById={updateBetById}
                  deleteBetById={deleteBetById}
                  setSelectedSlot={setSelectedSlot}
                />
              )}

              {/* 📋 Summary Table */}
              {/* <div className="mt-6 p-4 overflow-x-auto bg-white shadow-md  rounded-md text-gray-800">

                <h2 className="text-lg font-semibold mb-4 text-gray-800"> Summary</h2>
                <table className="min-w-full text-sm text-left border  border-gray-300">
                  <thead className="bg-gray-100 text-gray-700">
                    <tr>
                      <th className="px-4 py-2 border">First Name</th>
                      <th className="px-4 py-2 border">Last Name</th>
                      <th className="px-4 py-2 border">Contact</th>
                      <th className="px-4 py-2 border">Address</th>
                      <th className="px-4 py-2 border">Slot Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getGroupedBets(slotsData).map((bet, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-2 border">{bet.first_name}</td>
                        <td className="px-4 py-2 border">{bet.last_name}</td>
                        <td className="px-4 py-2 border">{bet.contact_no}</td>
                        <td className="px-4 py-2 border">{bet.address}</td>
                        <td className="px-4 py-2 border text-center">{bet.slot_count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div> */}
            </>
          )}
        </div>
      </div>
      
      
      {popupData && (
        <div className="py-3">
        <PopupModal
          data={popupData}
          onClose={() => setPopupData(null)}
        />
        </div>
      )}
      
      
    </div>
  );
}
