import { FaEdit, FaTrash } from "react-icons/fa";
import { User, Phone, Home, IdCard, DollarSign, User2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { getAllBets } from "../../api/bets";
import { X } from "lucide-react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

export default function EditForm({
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
  const [modalAnimation, setModalAnimation] = useState("animate-fade-in-scale six-hit-animation");
  const MySwal = withReactContent(Swal);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const firstNameRef = useRef(null);

  // 👇 Focus on the first input when modal opens
  useEffect(() => {
    if (isEditing && firstNameRef.current) {
      firstNameRef.current.focus();
    }
  }, [isEditing]);

  const handleDelete = async () => {
    const result = await MySwal.fire({
      title: "Are you sure?",
      icon: "error",
      showCancelButton: true,
      confirmButtonColor: "#00bcff",
      cancelButtonColor: "#99a1af",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      await deleteBetById(selectedSlot.id);
      setSlotsData((prev) => prev.filter((slot) => slot.id !== selectedSlot.id));
      setIsModalOpen(false);
      setSelectedSlot(null);
      setIsEditing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-100/10 flex items-center justify-center z-50">
      <div className={`bg-white p-8 rounded-2xl shadow-2xl w-[600px] ${modalAnimation} relative text-[16px] md:text-[18px] transition-all duration-300`}>
        
        {/* Close Button */}
        <button
          onClick={() => {
            setModalAnimation("animate-fade-out-scale");
            setTimeout(() => {
              setIsModalOpen(false);
              setSelectedSlot(null);
            }, 300);
          }}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-full p-1 cursor-pointer transition"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <p className="py-2 font-bold text-gray-600">ID: {selectedSlot.id}</p>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Bet Details</h2>
          <div className="flex gap-4">
            <button
              onClick={() => setIsEditing((prev) => !prev)}
              className="text-sky-500 hover:text-sky-700  text-xl transition-transform duration-500 transform hover:-translate-y-1 "
              title="Edit Slot"
            >
              <FaEdit />
            </button>
            <button
              onClick={handleDelete}
              className="text-red-500 hover:text-red-700  text-xl transition-transform duration-500 transform hover:-translate-y-1"
              title="Delete Slot"
            >
              <FaTrash />
            </button>
          </div>
        </div>

        {/* Input Fields */}
        <div className="space-y-4">
          {/* First Name */}
          <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 bg-gray-50
                focus-within:ring-2 focus-within:ring-sky-400
                transition-transform duration-300 transform
                 focus-within:scale-101">
            <User className="text-gray-500 mr-3" size={20} />
            <input
              ref={firstNameRef}
              type="text"
              onChange={(e) => setEditedSlot({ ...editedSlot, first_name: e.target.value })}
              value={editedSlot?.first_name || ""}
              disabled={!isEditing}
              className={`w-full bg-transparent outline-none ${!isEditing && "cursor-not-allowed text-gray-500"}`}
              placeholder="First Name"
            />
          </div>

          {/* Last Name */}
          <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 bg-gray-50
                focus-within:ring-2 focus-within:ring-sky-400
                transition-transform duration-300 transform
                focus-within:scale-101">
            <User2 className="text-gray-500 mr-3" size={20} />
            <input
              type="text"
              onChange={(e) => setEditedSlot({ ...editedSlot, last_name: e.target.value })}
              value={editedSlot?.last_name || ""}
              disabled={!isEditing}
              className={`w-full bg-transparent outline-none ${!isEditing && "cursor-not-allowed text-gray-500"}`}
              placeholder="Last Name"
            />
          </div>

          {/* Contact */}
          <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 bg-gray-50
                focus-within:ring-2 focus-within:ring-sky-400
                transition-transform duration-300 transform
                 focus-within:scale-101">
            <Phone className="text-gray-500 mr-3" size={20} />
            <input
              type="text"
              onChange={(e) => setEditedSlot({ ...editedSlot, contact_no: e.target.value })}
              value={editedSlot?.contact_no || ""}
              disabled={!isEditing}
              className={`w-full bg-transparent outline-none ${!isEditing && "cursor-not-allowed text-gray-500"}`}
              placeholder="Contact No."
            />
          </div>

          {/* Address */}
          <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 bg-gray-50
                focus-within:ring-2 focus-within:ring-sky-400
                transition-transform duration-300 transform
                 focus-within:scale-101">
            <Home className="text-gray-500 mr-3" size={20} />
            <input
              type="text"
              onChange={(e) => setEditedSlot({ ...editedSlot, address: e.target.value })}
              value={editedSlot?.address || ""}
              disabled={!isEditing}
              className={`w-full bg-transparent outline-none ${!isEditing && "cursor-not-allowed text-gray-500"}`}
              placeholder="Address"
            />
          </div>

          {/* Address */}
          <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 bg-gray-100">
            <DollarSign className="text-gray-500 mr-3" size={20} />
            <input
              type="text"
              onChange={(e) => setEditedSlot({ ...editedSlot, donation: e.target.value })}
              value={editedSlot?.donation.toLocaleString("en-IN", { minimumFractionDigits: 2 }) || ""}
              disabled
              className={`w-full bg-transparent outline-none cursor-not-allowed text-gray-700`}
              placeholder="Address"
            />
          </div>

          {/* Slots (readonly) */}
          <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 bg-gray-100">
            <span className="text-gray-500 mr-3">🎟️</span>
            <input
              type="text"
              value={`Slots: ${editedSlot?.slot_count || 1}`}
              disabled
              className="w-full bg-transparent outline-none cursor-not-allowed text-gray-700"
            />
          </div>
        </div>

        {/* Save Button */}
        {isEditing && (
          <button
            onClick={async () => {
              try {
                setIsSubmitting(true);
                await updateBetById(editedSlot.id, editedSlot);
                const updatedData = await getAllBets();
                setSlotsData(updatedData.data);
                setSelectedSlot(editedSlot);
                setIsEditing(false);

                MySwal.fire({
                  title: "Success!",
                  text: "Slot updated successfully.",
                  icon: "success",
                  confirmButtonColor: "#00bcff",
                });
              } catch (err) {
                console.error(err);
                MySwal.fire({
                  title: "Error!",
                  text: "Failed to update slot.",
                  icon: "error",
                  confirmButtonColor: "#d33",
                });
              } finally {
                setIsSubmitting(false); // stop submitting
              }
              disabled={isSubmitting}
            }}
            className={`mt-6 w-full bg-sky-500 text-white cursor-pointer py-2 px-4 rounded-lg font-medium shadow-lg 
              transition-transform duration-500 transform hover:-translate-y-1 hover:scale-101 ${isSubmitting ? "opacity-70 cursor-not-allowed" : "hover:bg-sky-600"}`}
          >
             {isSubmitting ? "Updating..." : "Update Donation"}
          </button>
        )}
      </div>
    </div>
  );
}
