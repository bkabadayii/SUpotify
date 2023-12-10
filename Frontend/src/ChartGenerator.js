// ChartGenerator.js
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

export const generateBarChart = (topRatedGenres) => {
  // Transform the object into an array if it's not already an array
  let chartData = [];
  if (topRatedGenres && typeof topRatedGenres === 'object' && !Array.isArray(topRatedGenres)) {
      chartData = Object.entries(topRatedGenres).map(([genre, { numTracks, avgRating }]) => ({
          genre,
          NumTracks: numTracks,
          AvgRating: parseFloat(avgRating)
      }));
  } else if (Array.isArray(topRatedGenres)) {
      chartData = topRatedGenres.map(item => ({
          name: item.genre,
          NumTracks: item.numTracks,
          AvgRating: parseFloat(item.avgRating),
      }));
  }

    return (
        <BarChart width={600} height={300} data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="NumTracks" fill="#8884d8" />
            <Bar dataKey="AvgRating" fill="#82ca9d" />
        </BarChart>
    );
};
