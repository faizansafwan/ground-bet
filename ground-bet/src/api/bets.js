import axios from "axios";

const API_URL = 'http://localhost:5000/api/bets';

export const addBet = async (betData) => {
    return await axios.post(API_URL, betData);
  };
  
  export const getAllBets = async () => {
    return await axios.get(API_URL);
  };

  export const getTotalDonation = async () => {
    return await axios.get(`${API_URL}/donation`);
  };
  
  export const updateBetById = (id, betData) => {
    return axios.put(`${API_URL}/${id}`, betData);
  };
  
  export const deleteBetById = async (id) => {
    return await axios.delete(`${API_URL}/${id}`);
  };