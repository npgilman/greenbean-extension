// Sample data: User's queries over the last 30 days
// Sample data: User's queries over the last 30 days
import Chart from "chart.js/auto";
import { getUserQueryData } from "./firebase/firebaseUtils.js";

// Process the data to make it compatible with the chart (e.g., get data for the last 30 days)
async function prepareChartData(userId) {
  // Loop over user data and populate the queries for each day
  const data = await getUserQueryData(userId);
  
  const currentDate = new Date();
  const last30Days = [];
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(currentDate);
    date.setDate(currentDate.getDate() - i); // Subtract i days from today
    last30Days.push(date.toISOString().split('T')[0]); // Push formatted date 'YYYY-MM-DD'
  }
console.log("last30Days", last30Days);
  return {
    labels: last30Days,
    datasets: [
      {
        label: "Queries over the Last 30 Days",
        data: data,
        fill: false,
        borderColor: "rgba(75, 192, 192, 1)",
        tension: 0.1,
      },
    ],
  };
}

export default async function renderChart(userId) {
  // Create and render the line chart using Chart.js
  const ctx = document.getElementById("lineChart").getContext("2d");
  const chart = new Chart(ctx, {
    type: "line",
    data: await prepareChartData(userId),
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
        tooltip: {
          callbacks: {
            label: function (tooltipItem) {
              return `Queries: ${tooltipItem.raw}`;
            },
          },
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: "Date",
          },
        },
        y: {
          title: {
            display: true,
            text: "Number of Queries",
          },
          min: 0,
        },
      },
    },
  });
}


export async function renderSmallChart(userId, chartContainer) {
    const ctx = chartContainer.getContext("2d");
  
    new Chart(ctx, {
      type: "line",
      data: await prepareChartData(userId),
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "top",
          },
          tooltip: {
            callbacks: {
              label: function (tooltipItem) {
                return `Queries: ${tooltipItem.raw}`;
              },
            },
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: "Date",
            },
          },
          y: {
            title: {
              display: true,
              text: "Number of Queries",
            },
            min: 0,
          },
        },
      },
    });
  }