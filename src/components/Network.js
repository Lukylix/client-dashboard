import { useEffect, useState } from "react";
import axios from "axios";
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
import { getReadableSize } from "../utils/convertion";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

export const options = {
	responsive: true,
	maintainAspectRatio: true,
	tension: 0.5,
	scales: {
		y: {
			suggestedMin: 0,
			ticks: {
				callback: getReadableSize,
			},
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
			text: "Network usage",
		},
	},
};

const Network = ({ socket }) => {
	const [networkData, setNetworkData] = useState({ rx_sec: [], tx_sec: [] });
	const [isWsl, setIsWsl] = useState(false);

	useEffect(() => {
		axios.get("http://localhost:8080/iswsl").then((res) => {
			setIsWsl(res?.data?.isWsl);
		});

		socket.on("network", (data = []) => {
			setNetworkData((currentData) => {
				let totalRxSec = 0;
				let totalTxSec = 0;

				data.forEach((netInterface) => {
					totalRxSec += netInterface.rx_sec;
					totalTxSec += netInterface.tx_sec;
				});

				if (currentData?.rx_sec.length > 29) currentData.rx_sec.shift();
				currentData.rx_sec.push(totalRxSec);
				if (currentData?.tx_sec.length > 29) currentData.tx_sec.shift();
				currentData.tx_sec.push(totalTxSec);
				return { ...currentData };
			});
		});

		socket.emit("subscribe", "network");
		// eslint-disable-next-line
	}, []);

	const lineData = {
		labels: networkData?.tx_sec.map((val, index) => `${networkData?.tx_sec.length - index}s`),
		datasets: [
			{
				label: "download",
				data: networkData.rx_sec,

				borderColor: "rgb(32, 130, 81)",
				backgroundColor: "rgb(42, 171, 107)",
			},
			{
				label: "upload",
				data: networkData.tx_sec,

				borderColor: "rgb(255,133,71)",
				backgroundColor: "rgb(255,133,71)",
			},
		],
	};

	return (
		<Card title="Network">
			{isWsl ? <h3>Wsl incompatible with network stats</h3> : <Line options={options} data={lineData} />}
		</Card>
	);
};
export default Network;
