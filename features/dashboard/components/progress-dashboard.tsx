import { Bar } from "react-chartjs-2"
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const mockProgress = {
  EC2: 80,
  S3: 65,
  VPC: 70,
  Lambda: 55,
  RDS: 60,
}

export function ProgressDashboard() {
  const data = {
    labels: Object.keys(mockProgress),
    datasets: [
      {
        label: "Progress",
        data: Object.values(mockProgress),
        backgroundColor: "rgba(102, 126, 234, 0.6)",
        borderColor: "rgb(102, 126, 234)",
        borderWidth: 1,
      },
    ],
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Your AWS Learning Progress",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
      },
    },
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-center text-purple-600">Progress Dashboard</h2>
      <Bar data={data} options={options} />
    </div>
  )
}

