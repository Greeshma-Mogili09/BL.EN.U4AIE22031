import React, { useEffect, useState, useCallback } from 'react';
import { getAllStocks, getStockHistory } from '../api/stockApi';
import { Box, Typography, Select, MenuItem, CircularProgress } from '@mui/material';

const calculateCorrelation = (x, y) => {
  const meanX = x.reduce((a, b) => a + b, 0) / x.length;
  const meanY = y.reduce((a, b) => a + b, 0) / y.length;

  const numerator = x.reduce((sum, xi, i) => sum + ((xi - meanX) * (y[i] - meanY)), 0);
  const denominator = Math.sqrt(
    x.reduce((sum, xi) => sum + Math.pow(xi - meanX, 2), 0) *
    y.reduce((sum, yi) => sum + Math.pow(yi - meanY, 2), 0)
  );

  return denominator === 0 ? 0 : numerator / denominator;
};

const CorrelationHeatmap = () => {
  const [stocks, setStocks] = useState({});
  const [minutes, setMinutes] = useState(30);
  const [matrix, setMatrix] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const allStocks = await getAllStocks();
    setStocks(allStocks);
    const tickers = Object.values(allStocks);
    const stockHistories = await Promise.all(tickers.map(t => getStockHistory(t, minutes)));

    const prices = stockHistories.map(s => s.map(e => e.price));
    const correlationMatrix = tickers.map((_, i) =>
      tickers.map((_, j) => {
        if (i === j) return 1;
        return calculateCorrelation(prices[i], prices[j]);
      })
    );

    setMatrix(correlationMatrix);
    setLoading(false);
  }, [minutes]);

  useEffect(() => {
    fetchData();
  }, [fetchData]); // Including fetchData in dependency array to prevent warnings

  const tickers = Object.values(stocks);

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>Correlation Heatmap</Typography>

      <Select value={minutes} onChange={e => setMinutes(Number(e.target.value))}>
        {[10, 20, 30, 50, 60].map(m => (
          <MenuItem key={m} value={m}>{m} minutes</MenuItem>
        ))}
      </Select>

      {loading ? (
        <CircularProgress />
      ) : (
        <Box sx={{ marginTop: 3, display: 'grid', gridTemplateColumns: `repeat(${tickers.length}, 40px)` }}>
          {matrix.map((row, i) =>
            row.map((value, j) => (
              <Box key={`${i}-${j}`} sx={{
                width: 40, height: 40,
                backgroundColor: `rgba(0, 0, 255, ${Math.abs(value)})`,
                color: '#fff',
                fontSize: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {value.toFixed(2)}
              </Box>
            ))
          )}
        </Box>
      )}
    </Box>
  );
};

export default CorrelationHeatmap;
