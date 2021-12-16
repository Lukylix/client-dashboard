import Card from "./Card";
import "./Disk.scss";
import axios from "axios";
import { useEffect, useState } from "react";
import ProgressBar from "./ProgressBar";
import { getReadableSize } from "../utils/convertion";

const DiskLine = ({ disk }) => {
	return (
		<>
			<p>{disk.mount}</p>
			<p>{getReadableSize(disk.used)}</p>
			<p>{getReadableSize(disk.size - disk.used)}</p>
			<p>{getReadableSize(disk.size)}</p>
			<ProgressBar rounded height={"15px"} percent={disk.use} />
		</>
	);
};

const Disk = () => {
	const [disks, setDisks] = useState([]);
	useEffect(() => {
		axios.get("http://localhost:8080/disks").then((res) => {
			setDisks(res.data);
		});
	}, []);
	return (
		<Card title="Disk info">
			<div className="Disk-container">
				<h3>Mount</h3>
				<h3>Used</h3>
				<h3>Free</h3>
				<h3>Total</h3>
				{disks.map((disk, index) => (
					<DiskLine key={index} disk={disk} />
				))}
			</div>
		</Card>
	);
};

export default Disk;
