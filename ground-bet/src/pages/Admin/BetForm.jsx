import { useEffect, useRef, useState } from "react";
import { addBet } from "../../api/bets";
import { toast } from "react-toastify";
import PopupModal from "./PopupModal";

export default function AddForm({refreshSlots}) {
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [slots, setSlots] = useState([]);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    contact: "",
    address: "",
    donation: ""
  });
  
  const [showThankYou, setShowThankYou] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);


  const [showForm, setShowForm] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [formAnimation, setFormAnimation] = useState("");


  const firstNameRef = useRef(null);

  const handleShowForm = () => {
    setFormAnimation("animate-fade-in-scale");
    setIsFormVisible(true);
    setTimeout(() => setShowForm(true), 10);
  };

  useEffect(() => {
    if (isFormVisible && firstNameRef.current) {
      firstNameRef.current.focus();
    }
  }, [isFormVisible]);

  const handleHideForm = () => {
    setShowForm(false);
    setFormAnimation("animate-fade-out-scale");
    setErrors({}); // Clear old errors
    setTimeout(() => setIsFormVisible(false), 500);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "donation") {
      const donationAmount = parseInt(value, 10);
      const slots = donationAmount > 0 ? Math.ceil(donationAmount / 100000) : 1;
      setFormData((prev) => ({ ...prev, donation: value, slots }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload
    const { firstName, lastName, contact, address, slots: slotCount } = formData;
  
    // Reset errors
    const newErrors = {};
  
    if (!firstName.trim()) newErrors.firstName = "First name is required.";
    if (!lastName.trim()) newErrors.lastName = "Last name is required.";
    
    
    if (!formData.donation || parseInt(formData.donation) <= 0) {
      newErrors.donation = "Please enter a valid donation amount.";
    }
    
    else if (parseInt(slotCount, 10) > 10) {
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
      donation: parseInt(formData.donation, 10),
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
      setSubmittedData(formData);
      setShowThankYou(true);
      setFormData({
        firstName: "",
        lastName: "",
        contact: "",
        address: "",
        donation: "",
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
        <button onClick={handleShowForm} className="mb-4 px-4 py-2 text-white cursor-pointer rounded transition 
      hover:from-yellow-400 hover:to-red-700 duration-300 ease-in-out 
      bg-gradient-to-r from-yellow-500 to-red-800 animate-fade-in-scale" >
          Add New Donation
        </button>
      )}

      {isFormVisible && (
        <div className={`w-full bg-white rounded-lg shadow-md p-6 transition-all duration-500 ease-in-out ${formAnimation}`}>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Add New Bet</h2>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="flex gap-4">
              <div className="w-full">
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  ref={firstNameRef}
                  id="firstName"
                  name="firstName"
                  type="text"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 
                  focus:ring-blue-400 transition"
                />
                {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}
              </div>

              <div className="w-full">
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 
                  focus:ring-blue-400 transition"
                />
                {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="contact" className="block text-sm font-medium text-gray-700 mb-1">
                Contact Number
              </label>
              <input
                id="contact"
                name="contact"
                type="tel"
                placeholder="0775445632"
                value={formData.contact}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 
                focus:ring-blue-400 transition"
              />
              
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                Address <span className="text-gray-400 text-xs">(optional)</span>
              </label>
              <input
                id="address"
                name="address"
                type="text"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 
                focus:ring-blue-400 transition"
              />
            </div>

            <div>
              <label htmlFor="donation" className="block text-sm font-medium text-gray-700 mb-1">
                Donation Amount (Rs.)
              </label>
              <input
                id="donation"
                name="donation"
                type="number"
                placeholder="Enter Donation"
                value={formData.donation}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
              {errors.donation && <p className="text-red-500 text-sm">{errors.donation}</p>}
              <p className="text-sm text-gray-600 mt-1">
                Slots allocated: <strong>{formData.slots || 1}</strong>
              </p>
            </div>

            {errors.slots && <p className="text-red-500 text-sm">{errors.slots}</p>}
            {errors.general && <p className="text-red-500 text-sm mt-2">{errors.general}</p>}

            <div className="flex justify-between gap-4">
              <button
                type="submit"
                disabled={loading}
                className={`w-full text-white py-2 rounded-md cursor-pointer 
                transition ease-in-out duration-300 
                ${loading 
                  ? "bg-gray-300 cursor-not-allowed" 
                  : "bg-gradient-to-r from-yellow-500 to-red-800 hover:from-yellow-400 hover:to-red-700"
                }`}
              >
                {loading ? "Submitting..." : "Add Donation"}
              </button>

              <button
                type="button"
                onClick={handleHideForm}
                className="w-full bg-gray-300 text-gray-700 py-2 rounded-md 
                cursor-pointer hover:bg-gray-400 transition ease-in-out duration-300"
              >
                Cancel
              </button>
            </div>
          </form>

        </div>
      )}


      {showThankYou && submittedData && (
        <div className="">
          <PopupModal 
          data={submittedData}
          onClose={() => setShowThankYou(false)}
        />
        </div>
        
      )}
    </div>
  );
}
