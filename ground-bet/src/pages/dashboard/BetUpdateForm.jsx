// SlotModal.jsx
import { FaEdit, FaTrash } from "react-icons/fa";
import { useState } from "react";
import { getAllBets } from "../../api/bets";

export default function SlotModal({
  selectedSlot,
  editedSlot,
  setEditedSlot,
  isEditing,
  setIsEditing,
  setIsModalOpen,
  setSlotsData,
  updateBetById,
  deleteBetById,
  setSelectedSlot,
}) {
  const [modalAnimation, setModalAnimation] = useState("animate-fade-in-scale");

  return (
    <div className="fixed inset-0 bg-[rgba(101,67,33,0.2)] flex items-center justify-center z-50">
      <div className={`bg-white p-6 rounded-lg shadow-lg w-96 ${modalAnimation}`}>
        <p className="py-2 font-bold">ID: {selectedSlot.id}</p>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Bet Details</h2>
          <div className="flex gap-3">
            <button
              onClick={() => setIsEditing((prev) => !prev)}
              className="text-blue-600 cursor-pointer transition hover:text-blue-800 duration-300 ease-in-out text-lg"
              title="Edit Slot"
            >
              <FaEdit />
            </button>
            <button
              onClick={async () => {
                const confirmDelete = window.confirm("Are you sure you want to delete this slot?");
                if (confirmDelete) {
                  try {
                    await deleteBetById(selectedSlot.id);
                    setModalAnimation("animate-fade-out-scale");
                    setTimeout(() => {
                      setIsModalOpen(false);
                      setSelectedSlot(null);
                      setIsEditing(false);
                      setSlotsData((prev) => prev.filter((slot) => slot.id !== selectedSlot.id));
                    }, 300);
                  } catch (err) {
                    alert("Failed to delete the slot.");
                  }
                }
              }}
              className="text-red-600 cursor-pointer transition hover:text-red-800 duration-300 ease-in-out text-lg"
              title="Delete Slot"
            >
              <FaTrash />
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <label className="font-semifold p-2">First Name</label>
          <input
            type="text"
            onChange={(e) => setEditedSlot({ ...editedSlot, first_name: e.target.value })}
            value={editedSlot?.first_name || ""}
            disabled={!isEditing}
            className="w-full px-3 py-2 rounded bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            placeholder="First Name"
          />

          <label className="font-semifold p-2">Last Name</label>
          <input
            type="text"
            onChange={(e) => setEditedSlot({ ...editedSlot, last_name: e.target.value })}
            value={editedSlot?.last_name || ""}
            disabled={!isEditing}
            className="w-full px-3 py-2 rounded bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />

          <label className="font-semifold p-2">Contact No.</label>
          <input
            type="text"
            onChange={(e) => setEditedSlot({ ...editedSlot, contact_no: e.target.value })}
            value={editedSlot?.contact_no || ""}
            disabled={!isEditing}
            className="w-full px-3 py-2 rounded bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            placeholder="Contact No."
          />

          <label className="font-semifold p-2">Address</label>
          <input
            type="text"
            onChange={(e) => setEditedSlot({ ...editedSlot, address: e.target.value })}
            value={editedSlot?.address || ""}
            disabled={!isEditing}
            className="w-full px-3 py-2 rounded bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            placeholder="Address"
          />

          <input
            type="text"
            value={`Slots: ${editedSlot?.slot_count || 1}`}
            disabled
            className="w-full px-3 py-2 border rounded bg-gray-100"
          />
        </div>

        <button
          onClick={() => {
            setModalAnimation("animate-fade-out-scale");
            setTimeout(() => {
              setIsModalOpen(false);
              setSelectedSlot(null);
            }, 300);
          }}
          className="mt-4 bg-gray-500 text-white p-2 rounded transition hover:bg-gray-600 duration-300 ease-in-out"
        >
          Close
        </button>

        {isEditing && (
          <button
            onClick={async () => {
              try {
                await updateBetById(editedSlot.id, editedSlot);
                const updatedData = await getAllBets();
                setSlotsData(updatedData.data);
                setSelectedSlot(editedSlot);
                setIsEditing(false);
                alert("Slot updated successfully.");
              } catch (err) {
                console.error(err);
                alert("Failed to update slot.");
              }
            }}
            className="mt-3 ml-3 bg-blue-400 text-white py-2 px-4 rounded transition hover:bg-blue-500 duration-300 ease-in-out"
          >
            Save Changes
          </button>
        )}
      </div>
    </div>
  );
}
