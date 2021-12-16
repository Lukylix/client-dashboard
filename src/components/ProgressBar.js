import "./ProgressBar.scss";

const ProgressBar = ({ percent, rounded = false, height = "20px" }) => {
	return (
		<div className="ProgressBar" style={{ borderRadius: rounded ? "10px" : "0" }}>
			<div style={{ width: `${percent}%`, height, borderRadius: rounded ? "10px" : "0" }}></div>
		</div>
	);
};

export default ProgressBar;
