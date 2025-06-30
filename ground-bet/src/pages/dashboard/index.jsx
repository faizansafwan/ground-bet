import { useEffect, useState } from "react";
import Header from "../../components/Header";
import AddForm from "./BetForm";
import { getAllBets, deleteBetById, updateBetById } from "../../api/bets";
import SlotModal from "./BetUpdateForm";

export default function Dashboard() {
  const [slotsData, setSlotsData] = useState([]); // data from backend
  const [columns, setColumns] = useState(10);
  const [selectedSlot, setSelectedSlot] = useState(null); // slot clicked
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAnimation, setModalAnimation] = useState("animate-fade-in-scale");
  const [isEditing, setIsEditing] = useState(false);
  const [editedSlot, setEditedSlot] = useState(null);



  useEffect(() => {
    loadSlots(); // extract this for reuse
  }, []);
  
  const loadSlots = async () => {
    try {
      const res = await getAllBets();
      setSlotsData(res.data);
    } catch (err) {
      console.error("Failed to fetch slots:", err);
    }
  };

  // Listen to screen width and set columns dynamically
  useEffect(() => {
    const updateColumns = () => {
      const width = window.innerWidth;
      if (width >= 1024) setColumns(30);
      else if (width >= 768) setColumns(20);
      else if (width >= 640) setColumns(15);
      else setColumns(10);
    };

    updateColumns();
    window.addEventListener("resize", updateColumns);
    return () => window.removeEventListener("resize", updateColumns);
  }, []);

  const filledSlotIds = new Set(slotsData.map((slot) => slot.id));
  const totalSlots = 1600;
  const rows = Math.ceil(totalSlots / columns);
  const filledCount = filledSlotIds.size;
  const emptyCount = totalSlots - filledCount;

  return (
    <div>
      <Header />
      <div className="m-2 p-3">
        <div className="flex-column md:flex gap-3">
          <div className="w-full md:w-1/2 p-3">
            <AddForm refreshSlots={loadSlots} />
          </div>
          
        </div>

        <div className="px-3 md:flex md:gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-gray-600 rounded-sm" />
              <span className="text-md text-gray-700">Filled</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-gray-300 rounded-sm" />
              <span className="text-md text-gray-700">Available</span>
            </div>
          </div>

        
          <div className="flex gap-3">
            <p className="text-md text-gray-700">Filled Slots: <strong>{filledCount}</strong></p>
            <p className="text-md text-gray-700">Empty Slots: <strong>{emptyCount}</strong></p>
            <p className="text-md text-gray-700">Columns: <strong>{columns}</strong></p>
            <p className="text-md text-gray-700">Rows: <strong>{rows}</strong></p>
          </div>
        </div>

        {/* Slot Grid */}
        <div className="mt-3 p-3 gap-1" style={{ display: "grid", gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
          {[...Array(totalSlots)].map((_, i) => {
            const slotId = i + 1;
            const slotData = slotsData.find((slot) => slot.id === slotId);
            const isFilled = !!slotData;
            const slotTitle = isFilled
              ? `${slotData.first_name} ${slotData.last_name}`
              : `Slot ${slotId}`;

            return (
              <div
                key={slotId}
                title={slotTitle}
                onClick={() => {
                  if (slotData) {
                    setSelectedSlot(slotData);
                    setEditedSlot({ ...slotData });
                    setModalAnimation("animate-fade-in-scale");
                    setIsModalOpen(true);
                  }
                }}
                className={`w-full aspect-square flex items-center justify-center rounded-sm transition-colors hover:border hover:border-2 hover:shadow-sm cursor-pointer duration-300 ${
                  isFilled ? "hover:border-gray-200 bg-gray-600" : "bg-gray-300"
                }`} >
                {slotId}
              </div>
            );
          })}

        </div>

        {isModalOpen && selectedSlot && (
          <SlotModal
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

      </div>
    </div>
  );
}
