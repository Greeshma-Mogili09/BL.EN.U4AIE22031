import axios from 'axios';

const BASE_URL = 'http://20.244.56.144/evaluation-service/stocks';

export const getAllStocks = async () => {
  const res = await axios.get(BASE_URL);
  return res.data.stocks;
};

export const getStockHistory = async (ticker, minutes = 50) => {
  const res = await axios.get(`${BASE_URL}/${ticker}?minutes=${minutes}`);
  return res.data;
};
