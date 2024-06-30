import React from 'react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData,
} from 'chart.js'
import { StatisticIncomeType, StatisticType } from '@/types/statistic.type'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

interface LineProps {
  data: StatisticType
}

const IncomeLineChart: React.FC<LineProps> = ({ data }) => {
  const formattedData: ChartData<'line'> = {
    labels: data.incomeByDays.map((item: StatisticIncomeType) => item.date),
    datasets: [
      {
        label: 'Doanh thu theo ngày trong tháng (VNĐ)',
        data: data.incomeByDays.map((item) => item.incomeByDay), // Convert to triệu đồng (millions)
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        yAxisID: 'y1',
      },
    ],
  }

  const options: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Thống kê hoa hồng theo đơn hàng theo từng ngày',
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Ngày',
        },
      },
      y1: {
        type: 'linear',
        position: 'left',
        title: {
          display: true,
          text: 'Số tiền (VNĐ)',
        },

        ticks: {
          stepSize: 1000000,
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  }

  return (
    <>
      <Line data={formattedData} options={options} />
    </>
  )
}

export default IncomeLineChart
