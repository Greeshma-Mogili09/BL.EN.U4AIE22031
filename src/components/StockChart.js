import React from 'react';
import { Line } from 'react-chartjs-2';
import { Card, Typography } from '@mui/material';
import 'chart.js/auto';

const StockChart = ({ data, average }) => {
  const chartData = {
    labels: data.map(point => new Date(point.lastUpdatedAt).toLocaleTimeString()),
    datasets: [
      {
        label: 'Price',
        data: data.map(point => point.price),
        fill: false,
        borderColor: 'blue',
        tension: 0.1
      },
      {
        label: 'Average',
        data: Array(data.length).fill(average),
        fill: false,
        borderColor: 'red',
        borderDash: [5, 5],
        pointRadius: 0
      }
    ]
  };

  return (
    <Card sx={{ padding: 2 }}>
      <Typography variant="h6">Stock Price Chart</Typography>
      <Line data={chartData} />
    </Card>
  );
};

export default StockChart;
