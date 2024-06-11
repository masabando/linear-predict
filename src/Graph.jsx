import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Scatter } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Graph({ dataSet = [], predictedDataSet = [] }) {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top'
      },
      title: {
        display: false,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'x'
        },
        min: 0,
        max: 100,
      },
      y: {
        title: {
          display: true,
          text: 'y'
        },
        min: 0,
        max: 250,
      }
    }
  };

  const data = {
    labels: dataSet.map(d => d.x),
    datasets: [
      {
        label: 'training data',
        data: dataSet,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'prediction data',
        data: predictedDataSet,
        borderColor: 'rgb(54, 162, 235)',
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
      }
    ],
  };

  return (
    <Scatter options={options} data={data} />
  )
}