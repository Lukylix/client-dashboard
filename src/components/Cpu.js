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
import ProgressBar from "./ProgressBar";
import "./Cpu.scss";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

export const options = {
	responsive: true,
	maintainAspectRatio: true,
	tension: 0.5,
	scales: {
		y: {
			suggestedMin: 0,
			suggestedMax: 100,
			ticks: {
				callback: (value) => value + "%",
			},
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
			text: "CPU usage",
		},
	},
};

function convertMiliseconds(ms) {
	const total_seconds = parseInt(Math.floor(ms / 1000));
	const total_minutes = parseInt(Math.floor(total_seconds / 60));
	const total_hours = parseInt(Math.floor(total_minutes / 60));
	const days = parseInt(Math.floor(total_hours / 24));

	const minutes = parseInt(total_minutes % 60);
	const hours = parseInt(total_hours % 24);
	let timeString = "";
	if (days > 0) timeString += days + "D ";
	if (hours > 0) timeString += hours + "h";
	if (minutes > 0) timeString += minutes + "m";
	return timeString;
}

const CpuBar = ({ num, percent }) => (
	<div className="Cpu-bar">
		<p>{num}</p> <ProgressBar percent={percent} />
	</div>
);

const ProcessLine = ({ process }) => {
	const elapsedTimeMs = Date.now() - Date.parse(process.started);
	const elapsedTime = convertMiliseconds(elapsedTimeMs);
	return (
		<>
			<p>{process.pid}</p>
			<p>{process.user}</p>
			<p>{process.name}</p>
			<p>{process.cpu.toFixed(2)}%</p>
			<p>{process.mem.toFixed(2)}%</p>
			<p>{elapsedTime}</p>
			<p>{process.path}</p>
		</>
	);
};

const CpuChart = ({ socket }) => {
	const [cpuPercents, setCpuPercents] = useState([]);
	const [cpus, setCpus] = useState([]);
	const [cpuInfo, setCpuInfo] = useState({});
	const [showProcesses, setShowProcesses] = useState(false);

	function toggleShowProcesses() {
		if (!showProcesses) socket.emit("subscribe", "cpuInfo");
		if (showProcesses) socket.emit("unsubscribe", "cpuInfo");
		setShowProcesses(!showProcesses);
	}

	useEffect(() => {
		socket.on("cpuBase", (cpuPercents) => {
			setCpuPercents(cpuPercents);
		});
		socket.on("cpu", (data) => {
			setCpuPercents((currentData) => {
				if (currentData.length > 59) currentData.shift();
				return [...currentData, data.totalLoad];
			});
			setCpus(data.cpus);
		});

		socket.on("cpuInfo", (data) => {
			setCpuInfo(data);
		});

		socket.emit("subscribe", "cpu");

		// eslint-disable-next-line
	}, []);

	const lineData = {
		labels: cpuPercents.map((val, index) => `${cpuPercents?.length - index}s`),
		datasets: [
			{
				label: "cpu usage",
				data: cpuPercents,
				fill: {
					target: "origin",
					above: "rgb(42, 171, 107)",
				},
				borderColor: "rgb(32, 130, 81)",
				backgroundColor: "rgb(42, 171, 107)",
			},
		],
	};

	const processListPerUsage = cpuInfo?.process?.list?.sort((a, b) => b.cpu - a.cpu);
	const topProcesses = processListPerUsage?.slice(0, 10);

	return (
		<Card title="Cpu usage">
			<Line options={options} data={lineData} />
			<h2>Per thread usage</h2>
			<div className="Cores-container">
				{cpus.map((cpu, index) => (
					<CpuBar key={index} num={index + 1} percent={cpu} />
				))}
			</div>
			<button onClick={toggleShowProcesses} style={{ backgroundColor: showProcesses ? "#a4443d" : "#2aab6b" }}>
				{showProcesses ? "Hide" : "Show"} advenced cpu infos
			</button>
			{showProcesses && (
				<>
					<h2>Cpu info {cpuInfo?.manufacturer + " " + cpuInfo?.brand}</h2>
					<div className="Cpu-info-container">
						<div>
							<h3>Frequency avg</h3>
							<p>{cpuInfo?.avg}GHz</p>
						</div>
						<div>
							<h3>Frequency min</h3>
							<p>{cpuInfo?.min}GHz</p>
						</div>
						<div>
							<h3>Frequency max</h3>
							<p>{cpuInfo?.max}GHz</p>
						</div>
						<div>
							<h3>Cores</h3>
							<p>{cpuInfo?.physicalCores}</p>
						</div>
						<div>
							<h3>Threads</h3>
							<p>{cpuInfo?.cores}</p>
						</div>
						<div>
							<h3>Processes</h3>
							<p>{cpuInfo?.process?.all}</p>
						</div>
						<div>
							<h3>PS Running</h3>
							<p>{cpuInfo?.process?.running}</p>
						</div>
						<div>
							<h3>PS Blocked</h3>
							<p>{cpuInfo?.process?.blocked}</p>
						</div>
						<div>
							<h3>PS Sleeping</h3>
							<p>{cpuInfo?.process?.sleeping}</p>
						</div>
						<div>
							<h3>PS Unknown</h3>
							<p>{cpuInfo?.process?.unknown}</p>
						</div>
					</div>
					<h2>Top 10 process</h2>
					<div className="Process-container">
						<h3>PID</h3>
						<h3>User</h3>
						<h3>Name</h3>
						<h3>CPU</h3>
						<h3>Memory</h3>
						<h3>Time</h3>
						<h3>Path</h3>
						{topProcesses?.map((process, index) => {
							return <ProcessLine key={index} process={process} />;
						})}
					</div>
				</>
			)}
		</Card>
	);
};

export default CpuChart;
