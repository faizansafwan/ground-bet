import { useState } from "react";
import { addBet } from "../../api/bets";
import { toast } from "react-toastify";

export default function AddForm({refreshSlots}) {
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [slots, setSlots] = useState([]);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    contact: "",
    address: "",
    slots: ""
  });

  const [showForm, setShowForm] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [formAnimation, setFormAnimation] = useState("");

  const handleShowForm = () => {
    setFormAnimation("animate-fade-in-scale");
    setIsFormVisible(true);
    setTimeout(() => setShowForm(true), 10);
  };

  const handleHideForm = () => {
    setShowForm(false);
    setFormAnimation("animate-fade-out-scale");
    setErrors({}); // Clear old errors
    setTimeout(() => setIsFormVisible(false), 500);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload
    const { firstName, lastName, contact, address, slots: slotCount } = formData;
  
    // Reset errors
    const newErrors = {};
  
    if (!firstName.trim()) newErrors.firstName = "First name is required.";
    if (!lastName.trim()) newErrors.lastName = "Last name is required.";
    if (!contact.trim()) {
      newErrors.contact = "Contact number is required.";
    } else if (!/^\d{10}$/.test(contact)) {
      newErrors.contact = "Contact number must be exactly 10 digits.";
    }
    
    if (!slotCount) {
      newErrors.slots = "Please select number of slots.";
    } else if (parseInt(slotCount, 10) > 10) {
      newErrors.slots = "Maximum allowed slots is 10.";
    }
    
  
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      e.preventDefault();
      return;
    }
  
    // All validations passed
    setErrors({}); // Clear old errors
    setLoading(true); // ⏳ Start loading
  
    const betPayload = {
      first_name: firstName,
      last_name: lastName,
      contact_no: contact,
      address,
      slot_count: parseInt(slotCount, 10),
    };
  
    try {
      const res = await addBet(betPayload);
  
      setSlots((prev) => [
        ...prev,
        ...Array(betPayload.slot_count).fill({
          firstName,
          lastName,
          contact,
          address,
          slots: betPayload.slot_count,
        }),
      ]);
      toast.success("Bet added successfully!");
      await refreshSlots(); // ✅ refresh slot grid without reloading
      setShowForm(false);
      setFormData({
        firstName: "",
        lastName: "",
        contact: "",
        address: "",
        slots: "",
      });
      
    } catch (error) {
      console.error("Error submitting bet:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false); // ✅ Stop loading regardless of success or failure
    }
  };
  
  

  return (
    <div>
      {!showForm && !isFormVisible && (
        <button onClick={handleShowForm} className="mb-4 px-4 py-2 bg-blue-400 text-white cursor-pointer rounded transition hover:bg-blue-500 duration-300 ease-in-out 
        animate-fade-in-scale" >
          Add New Bet
        </button>
      )}

      {isFormVisible && (
        <div className={`w-full bg-white rounded-lg shadow-md p-6 transition-all duration-500 ease-in-out ${formAnimation}`}>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Add New Bet</h2>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="flex gap-4">
              <input name="firstName" type="text" placeholder="First Name" value={formData.firstName} onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 
                focus:ring-blue-400 transition" />
              
              <input name="lastName" type="text" placeholder="Last Name" value={formData.lastName} onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 
                focus:ring-blue-400 transition" />
            </div>

            <div className="flex gap-2">
              {errors.firstName && <p className="text-red-500 text-sm w-1/2">{errors.firstName}</p>}
              {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}
            </div>
           
            <input name="contact" type="tel" placeholder="0775445632" value={formData.contact} onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 
              focus:ring-blue-400 transition" />

            {errors.contact && <p className="text-red-500 text-sm">{errors.contact}</p>}

            <input name="address" type="text" placeholder="Address (optional)" value={formData.address} onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 
              focus:ring-blue-400 transition" />

            <input name="slots" type="number" placeholder="Number of Bets" value={formData.slots} onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 
              focus:ring-blue-400 transition" />

            {/* <select name="slots" value={formData.slots} onChange={handleChange}
               className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 
               focus:ring-blue-400 transition">
              <option value="">Select number of Bets</option>
              {[...Array(10)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select> */}
            {errors.slots && <p className="text-red-500 text-sm">{errors.slots}</p>}

            {errors.general && <p className="text-red-500 text-sm mt-2">{errors.general}</p>}
            <div className="flex justify-between gap-4">
              <button type="submit" disabled={loading} className={`w-full text-white py-2 rounded-md cursor-pointer 
              transition ease-in-out duration-300 ${loading ? "bg-blue-300 cursor-not-allowed" : "bg-blue-400 hover:bg-blue-500"}`} >
                {loading ? "Submitting..." : "Add Bet"}
              </button>

              <button type="button" onClick={handleHideForm} className="w-full bg-gray-300 text-gray-700 py-2 rounded-md 
                cursor-pointer hover:bg-gray-400 transition ease-in-out duration-300" >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
