import "./Ram.scss";
import Card from "./Card";
import { useEffect, useState } from "react";
import ProgressBar from "./ProgressBar";
import { getReadableSize } from "../utils/convertion";

const Ram = ({ socket }) => {
	const [ramInfo, setRamInfo] = useState({});
	useEffect(() => {
		socket.on("ram", (data) => setRamInfo(data));
		socket.emit("subscribe", "ram");
		// eslint-disable-next-line
	}, []);
	return (
		<Card title="Ram Info">
			<div className="Ram-header">
				<div>
					<h3>Used</h3>
					<p>{getReadableSize(ramInfo?.active)}</p>
				</div>
				<div>
					<h3>Free</h3>
					<p>{getReadableSize(ramInfo?.available)}</p>
				</div>
				<div>
					<h3>Total</h3>
					<p>{getReadableSize(ramInfo?.total)}</p>
				</div>
			</div>
			<p style={{ textAlign: "center" }}>{`${((ramInfo.active / ramInfo.total) * 100).toFixed(2)} %`}</p>
			<ProgressBar rounded percent={((ramInfo.active / ramInfo.total) * 100).toFixed(2)} />
		</Card>
	);
};

export default Ram;
