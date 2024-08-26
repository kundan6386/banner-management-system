import React, { useEffect } from "react";
import { Bar } from "react-chartjs-2";
import Chart from 'chart.js/auto';

function BarChart() {
  return (
    <div className="App my-0">
      <div className="table-responsive barGraph">
        <Bar
          data={{
            // Name of the variables on x-axies for each bar
            labels: ["1st bar", "2nd bar", "3rd bar", "4th bar"],
            datasets: [
              {
                // Label for bars
                label: "total count/value",
                // Data or value of your each variable
                data: [1552, 1319, 613, 1400],
                // Color of each bar
                backgroundColor: ["blue", "blue", "blue", "blue"],
                // Border color of each bar
                borderColor: ["blue", "blue", "blue", "blue"],
                borderWidth: 0.5,
              },
            ],
          }}
          // Height of graph
          height={300}
          options={{
            maintainAspectRatio: false,
            scales: {
              yAxes: [
                {
                  ticks: {
                    // The y-axis value will start from zero
                    beginAtZero: true,
                  },
                },
              ],
            },
            legend: {
              labels: {
                fontSize: 15,
              },
            },
          }}
        />
      </div>
    </div>
  );
}

export default BarChart;
