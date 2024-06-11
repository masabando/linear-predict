import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  LogarithmicScale,
} from "chart.js";
import { Scatter } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function LossGraph({ lossData = [] }) {
  const options = {
    animation: false,
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "chart",
      },
    },
    scales: {
      x: {
        min: 0,
      },
      y: {
        type: "logarithmic",
      },
    },
  };

  const data = {
    labels: lossData.map((d) => d.x),
    datasets: [
      {
        label: "Loss",
        data: lossData,
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.5)",
      },
    ],
  };

  return <Scatter options={options} data={data} />;
}
