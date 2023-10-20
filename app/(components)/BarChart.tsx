"use client"

import { Chart as ChartJS, registerables } from "chart.js";
import { Bar } from "react-chartjs-2";

export default function BarChart({data, options}: {data: any, options: any}) {
	ChartJS.register(...registerables);

	return (
		<Bar data={data} options={options} />
	)
}