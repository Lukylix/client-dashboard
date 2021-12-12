import { useEffect, useState } from "react";
import Card from "./Card";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
	Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

export const options = {
	responsive: true,
	maintainAspectRatio: true,
	tension: 0.4,
	scales: {
		y: {
			suggestedMin: 0,
			suggestedMax: 100,
		},
	},
	animation: {
		duration: 0,
	},
	plugins: {
		legend: {
			display: false,
		},
		filler: {
			propagate: true,
		},
		title: {
			display: true,
			text: "CPU usage Line Chart",
		},
	},
};

const CpuChart = ({ socket }) => {
	const [data, setData] = useState([]);
	// 1. socket.emit('subscribe'listen for a cpu event and update the state

	useEffect(() => {
		socket.on("cpuBase", (cpuPercents) => {
			setData(cpuPercents);
		});
		socket.on("cpu", (cpuPercent) => {
			setData((currentData) => {
				if (currentData.length > 59) currentData.shift();
				return [...currentData, cpuPercent];
			});
		});
		socket.emit("subscribe", "cpu");
		// eslint-disable-next-line
	}, []);

	const lineData = {
		labels: data.map((val, index) => `${60 - index}s`),
		datasets: [
			{
				label: "cpu usage",
				data: data,
				fill: {
					target: "origin",
					above: "rgb(42, 171, 107)",
				},
				borderColor: "rgb(32, 130, 81)",
				backgroundColor: "rgb(42, 171, 107)",
			},
		],
	};
	return (
		<Card title="Cpu usage">
			<Line options={options} data={lineData} />
		</Card>
	);
};

export default CpuChart;
