// Sample data: User's queries over the last 30 days
// Sample data: User's queries over the last 30 days
import Chart from "chart.js/auto";

const userData = [
  { date: "2025-01-01", queries: 10 },
  { date: "2025-01-02", queries: 15 },
  { date: "2025-01-03", queries: 7 },
  { date: "2025-01-04", queries: 20 },
  { date: "2025-01-05", queries: 18 },
  { date: "2025-01-06", queries: 25 },
  { date: "2025-01-07", queries: 12 },
  { date: "2025-01-08", queries: 5 },
  { date: "2025-01-09", queries: 16 },
  { date: "2025-01-10", queries: 22 },
  { date: "2025-01-11", queries: 30 },
  { date: "2025-01-12", queries: 27 },
  { date: "2025-01-13", queries: 19 },
  { date: "2025-01-14", queries: 24 },
  { date: "2025-01-15", queries: 33 },
  { date: "2025-01-16", queries: 28 },
  { date: "2025-01-17", queries: 11 },
  { date: "2025-01-18", queries: 14 },
  { date: "2025-01-19", queries: 21 },
  { date: "2025-01-20", queries: 17 },
  { date: "2025-01-21", queries: 8 },
  { date: "2025-01-22", queries: 29 },
  { date: "2025-01-23", queries: 35 },
  { date: "2025-01-24", queries: 40 },
  { date: "2025-01-25", queries: 38 },
  { date: "2025-01-26", queries: 31 },
  { date: "2025-01-27", queries: 45 },
  { date: "2025-01-28", queries: 37 },
  { date: "2025-01-29", queries: 50 },
  { date: "2025-01-30", queries: 52 },
];

// Function to format the date to "YYYY-MM-DD" (or you can use a library like moment.js for formatting)
function formatDate(date) {
  return new Date(date).toLocaleDateString("en-GB"); // You can adjust the locale based on your preference
}

// Get the past 30 days from today
function getLast30Days() {
  const today = new Date();
  const past30Days = [];
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    past30Days.push(formatDate(date));
  }
  return past30Days;
}

// Process the data to make it compatible with the chart (e.g., get data for the last 30 days)
function prepareChartData() {
  // Loop over user data and populate the queries for each day
  const last30Days = userData.map((item) => {
    return item.date;
  });
  const queries = userData.map((item) => {
    return item.queries;
  });


  return {
    labels: last30Days,
    datasets: [
      {
        label: "Queries over the Last 30 Days",
        data: queries,
        fill: false,
        borderColor: "rgba(75, 192, 192, 1)",
        tension: 0.1,
      },
    ],
  };
}

export default function renderChart() {
  // Create and render the line chart using Chart.js
  const ctx = document.getElementById("lineChart").getContext("2d");
  const chart = new Chart(ctx, {
    type: "line",
    data: prepareChartData(),
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
