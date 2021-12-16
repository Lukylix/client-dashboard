import Header from "./components/Header";
import Cpu from "./components/Cpu";
import Ram from "./components/Ram";
import Disk from "./components/Disk";
import "./App.scss";

import io from "socket.io-client";
import Network from "./components/Network";
const socket = io("http://localhost:3001", {
	transports: ["websocket", "polling"],
});

const App = () => {
	return (
		<>
			<Header />
			<div className="App">
				<div className="Left">
					<Cpu socket={socket} />
				</div>
				<div className="Right">
					<Ram socket={socket} />
					<Disk />
					<Network socket={socket} />
				</div>
			</div>
		</>
	);
};

export default App;
