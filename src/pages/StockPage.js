import React, { useEffect, useState, useCallback } from 'react';
import { getAllStocks, getStockHistory } from '../api/stockApi';
import StockChart from '../components/StockChart';
import {
  MenuItem, Select, Typography, Box, CircularProgress, InputLabel, FormControl
} from '@mui/material';

const StockPage = () => {
  const [stocks, setStocks] = useState({});
  const [selectedTicker, setSelectedTicker] = useState('');
  const [minutes, setMinutes] = useState(30);
  const [stockData, setStockData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchStockList = useCallback(async () => {
    const data = await getAllStocks();
    setStocks(data);
    const defaultTicker = Object.values(data)[0];
    setSelectedTicker(defaultTicker);
  }, []);

  const fetchStockData = useCallback(async () => {
    if (!selectedTicker) return;
    setLoading(true);
    const data = await getStockHistory(selectedTicker, minutes);
    setStockData(data);
    setLoading(false);
  }, [selectedTicker, minutes]);

  useEffect(() => {
    fetchStockList();
  }, [fetchStockList]); // Including fetchStockList in dependency array to prevent warnings

  useEffect(() => {
    if (selectedTicker) fetchStockData();
  }, [selectedTicker, minutes, fetchStockData]); // Adding fetchStockData to dependency array

  const average =
    stockData.reduce((acc, item) => acc + item.price, 0) / (stockData.length || 1);

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>Stock Viewer</Typography>

      <Box sx={{ display: 'flex', gap: 3, marginBottom: 3 }}>
        <FormControl>
          <InputLabel>Stock</InputLabel>
          <Select value={selectedTicker} label="Stock" onChange={e => setSelectedTicker(e.target.value)}>
            {Object.entries(stocks).map(([name, ticker]) => (
              <MenuItem key={ticker} value={ticker}>{name}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl>
          <InputLabel>Time (minutes)</InputLabel>
          <Select value={minutes} label="Minutes" onChange={e => setMinutes(Number(e.target.value))}>
            {[10, 20, 30, 50, 60].map(min => (
              <MenuItem key={min} value={min}>{min}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {loading ? (
        <CircularProgress />
      ) : (
        <StockChart data={stockData} average={average} />
      )}
    </Box>
  );
};

export default StockPage;
