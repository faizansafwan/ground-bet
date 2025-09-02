import { db } from "../database/db.js";

let io; // placeholder

export const setSocketIO = (socketIOInstance) => {
  io = socketIOInstance;
};

const MAX_SLOT_AMOUNT = 100000;

// export const addBet = async (req, res) => {
//   const { first_name, last_name, contact_no, address, donation } = req.body;

//   try {
//     if (donation <= 0) {
//       return res.status(400).json({ message: "Donation must be greater than Rs. 0" });
//     }

//     // Step 1: Calculate slots and amounts
//     const slots = [];
//     let remainingDonation = donation;

//     while (remainingDonation > 0) {
//       const slotDonation = Math.min(remainingDonation, MAX_SLOT_AMOUNT);
//       slots.push(slotDonation);
//       remainingDonation -= slotDonation;
//     }

//     // Step 2: Get all existing IDs
//     const [rows] = await db.query("SELECT id FROM bets ORDER BY id ASC");
//     const existingIds = new Set(rows.map(row => row.id));

//     // Step 3: Find first N available IDs
//     const availableIds = [];
//     let id = 1;
//     while (availableIds.length < slots.length && id <= 1600) {
//       if (!existingIds.has(id)) availableIds.push(id);
//       id++;
//     }

//     if (availableIds.length < slots.length) {
//       return res.status(400).json({ message: "Not enough available slots." });
//     }

//     // Step 4: Insert each slot as separate record
//     const insertPromises = availableIds.map((slotId, index) =>
//       db.query(
//         "INSERT INTO bets (id, first_name, last_name, contact_no, address, slot_count, donation) VALUES (?, ?, ?, ?, ?, ?, ?)",
//         [slotId, first_name, last_name, contact_no, address, slots.length, slots[index]]
//       )
//     );

//     await Promise.all(insertPromises);

//     res.status(201).json({
//       message: `${slots.length} slot(s) added successfully.`,
//       slotAmounts: slots, // optional: return slot allocation for frontend
//     });
//   } catch (error) {
//     console.error("Error adding bet:", error);
//     res.status(500).json({ message: "Error adding bet", error });
//   }
// };



export const getAllBets = async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT * FROM bets order by id'
        );
        res.status(201).json(rows);
    } catch (error) {
        console.error('Error retrieving bets:', error);
        res.status(500).json({ message: 'Failed to retrieve bets', error });
    }
}


export const addBet = async (req, res) => {
  const { first_name, last_name, contact_no, address, donation } = req.body;

  try {
    if (donation <= 0) {
      return res.status(400).json({ message: "Donation must be greater than Rs. 0" });
    }

    // Step 1: Calculate slots
    const slots = [];
    let remainingDonation = donation;
    while (remainingDonation > 0) {
      const slotDonation = Math.min(remainingDonation, MAX_SLOT_AMOUNT);
      slots.push(slotDonation);
      remainingDonation -= slotDonation;
    }

    // Step 2: Get existing IDs
    const [rows] = await db.query("SELECT id FROM bets ORDER BY id ASC");
    const existingIds = new Set(rows.map(row => row.id));

    // Step 3: Allocate IDs
    const availableIds = [];
    let id = 1;
    while (availableIds.length < slots.length && id <= 1600) {
      if (!existingIds.has(id)) availableIds.push(id);
      id++;
    }

    if (availableIds.length < slots.length) {
      return res.status(400).json({ message: "Not enough available slots." });
    }

    // Step 4: Insert
    const insertPromises = availableIds.map((slotId, index) =>
      db.query(
        "INSERT INTO bets (id, first_name, last_name, contact_no, address, slot_count, donation) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [slotId, first_name, last_name, contact_no, address, slots.length, slots[index]]
      )
    );
    await Promise.all(insertPromises);

    // ✅ Prepare newBets array for socket
    const newBets = availableIds.map((slotId, index) => ({
      id: slotId,
      first_name,
      last_name,
      contact_no,
      address,
      slot_count: slots.length,
      donation: slots[index],
    }));

    // ✅ Emit all created bets
    if (io) io.emit("betAdded", newBets);

    res.status(201).json({ message: `${slots.length} slot(s) added successfully.` });
  } catch (error) {
    console.error("Error adding bet:", error);
    res.status(500).json({ message: "Error adding bet", error });
  }
};


export const updateBetById = async (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, contact_no, address, slot_count, donation } = req.body;

  try {
    const [result] = await db.query(
      "UPDATE bets SET first_name=?, last_name=?, contact_no=?, address=?, slot_count=?, donation=? WHERE id=?",
      [first_name, last_name, contact_no, address, slot_count, donation, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Bet not found" });
    }

    // ✅ Emit update
    if (io) io.emit("betUpdated", { id, first_name, last_name, donation });

    res.status(200).json({ message: "Bet updated successfully" });
  } catch (error) {
    console.error("Error updating bet:", error);
    res.status(500).json({ message: "Error updating bet", error });
  }
};

export const deleteBetById = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query("DELETE FROM bets WHERE id=?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Bet not found" });
    }

    // ✅ Emit delete
    if (io) io.emit("betDeleted", id);

    res.status(200).json({ message: "Bet deleted successfully" });
  } catch (error) {
    console.error("Error deleting bet:", error);
    res.status(500).json({ message: "Error deleting bet", error });
  }
};


  // 👇 New Controller: Get Total Donation
export const getTotalDonation = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT SUM(donation) AS total_donation FROM bets"
    );

    const totalDonation = rows[0].total_donation || 0;

    res.status(200).json({
      total_donation: totalDonation,
      formatted: `Rs. ${totalDonation.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
    });
  } catch (error) {
    console.error("Error fetching total donation:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch total donation", error });
  }
};
  

// inside addBet


// inside updateBetById


// inside deleteBetById

