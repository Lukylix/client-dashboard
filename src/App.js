import Header from "./components/Header";
import CpuChart from "./components/CpuChart";
import Ram from "./components/Ram";
import "./App.scss";

import io from "socket.io-client";
const socket = io("http://localhost:3001", {
	transports: ["websocket", "polling"],
});

const App = () => {
	return (
		<>
			<Header />
			<div className="App">
				<div className="Left">
					<CpuChart socket={socket} />
				</div>
				<div className="Right">
					<Ram socket={socket} />
				</div>
			</div>
		</>
	);
};

export default App;
