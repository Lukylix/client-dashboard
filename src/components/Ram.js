import "./Ram.scss";
import Card from "./Card";
import { useEffect, useState } from "react";
import ProgressBar from "./ProgressBar";

const getReadableSize = (bytes = 0) => {
	var sizes = [" Bytes", " KB", " MB", " GB", " TB", " PB", " EB", " ZB", " YB"];

	for (var i = 1; i < sizes.length; i++) {
		if (bytes < Math.pow(1024, i)) return Math.round((bytes / Math.pow(1024, i - 1)) * 100) / 100 + sizes[i - 1];
	}
	return bytes;
};

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
			<ProgressBar percent={((ramInfo.active / ramInfo.total) * 100).toFixed(2)} />
		</Card>
	);
};

export default Ram;
