import { useEffect, useState } from "react";
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
	tension: 0.5,
	scales: {
		y: {
			suggestedMin: 0,
		},
	},
	animation: {
		duration: 0,
	},
	plugins: {
		legend: {
			display: true,
		},
		filler: {
			propagate: true,
		},
		title: {
			display: true,
			text: "DiskIO per sec",
		},
	},
};

const DiskIO = ({ socket }) => {
	const [diskIOData, setdiskIOData] = useState({ rIO_sec: [], wIO_sec: [] });

	useEffect(() => {
		socket.on("diskIO", (data) => {
			setdiskIOData((currentData) => {
				if (currentData?.rIO_sec.length > 29) currentData.rIO_sec.shift();
				currentData.rIO_sec.push(data.rIO_sec);
				if (currentData?.wIO_sec.length > 29) currentData.wIO_sec.shift();
				currentData.wIO_sec.push(data.wIO_sec);
				return { ...currentData };
			});
		});

		socket.emit("subscribe", "diskIO");
		// eslint-disable-next-line
	}, []);

	const lineData = {
		labels: diskIOData?.wIO_sec.map((val, index) => `${diskIOData?.wIO_sec.length - index}s`),
		datasets: [
			{
				label: "read",
				data: diskIOData.wIO_sec,

				borderColor: "rgb(32, 130, 81)",
				backgroundColor: "rgb(42, 171, 107)",
			},
			{
				label: "write",
				data: diskIOData.rIO_sec,

				borderColor: "rgb(255,133,71)",
				backgroundColor: "rgb(255,133,71)",
			},
		],
	};

	return <Line options={options} data={lineData} />;
};
export default DiskIO;
