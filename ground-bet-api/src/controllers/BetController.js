import { db } from "../database/db.js";

export const addBet = async (req, res) => {
  const { first_name, last_name, contact_no, address, slot_count } = req.body;
  try {
    // Step 1: Get all existing IDs
    const [rows] = await db.query('SELECT id FROM bets ORDER BY id ASC');
    const existingIds = new Set(rows.map(row => row.id));

    // Step 2: Find first N available IDs
    const availableIds = [];
    let id = 1;
    while (availableIds.length < slot_count && id <= 1600) {
      if (!existingIds.has(id)) {
        availableIds.push(id);
      }
      id++;
    }

    if (availableIds.length < slot_count) {
      return res.status(400).json({ message: "Not enough available slots." });
    }

    // Step 3: Insert records into available slots
    const insertPromises = availableIds.map(slotId =>
      db.query(
        'INSERT INTO bets (id, first_name, last_name, contact_no, address, slot_count) VALUES (?, ?, ?, ?, ?, ?)',
        [slotId, first_name, last_name, contact_no, address, slot_count]
      )
    );

    await Promise.all(insertPromises);
    res.status(201).json({ message: `${slot_count} slot(s) added successfully.` });

  } catch (error) {
    console.error('Error adding bet:', error);
    res.status(500).json({ message: 'Error adding bet', error });
  }
};



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


// controllers/BetController.js
export const updateBetById = async (req, res) => {
    const { id } = req.params;
    const { first_name, last_name, contact_no, address, slot_count } = req.body;
  
    try {
      const [result] = await db.query(
        `UPDATE bets SET first_name = ?, last_name = ?, contact_no = ?, address = ?, slot_count = ? WHERE id = ?`,
        [ first_name, last_name, contact_no, address, slot_count, id]
      );
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Bet not found' });
      }
  
      res.status(200).json({ message: 'Bet updated successfully' });
    } catch (error) {
      console.error('Error updating bet:', error);
      res.status(500).json({ message: 'Error updating bet', error });
    }
  };
  
  export const deleteBetById = async (req, res) => {
    const { id } = req.params;
  
    try {
      const [result] = await db.query(
        'DELETE FROM bets WHERE id = ?',
        [id]
      );
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Bet not found' });
      }
  
      res.status(200).json({ message: 'Bet deleted successfully' });
    } catch (error) {
      console.error('Error deleting bet:', error);
      res.status(500).json({ message: 'Error deleting bet', error });
    }
  };
  