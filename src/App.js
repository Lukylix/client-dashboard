import Header from "./components/Header";
import Cpu from "./components/Cpu";
import Ram from "./components/Ram";
import Disk from "./components/Disk";
import "./App.scss";

import io from "socket.io-client";
import axios from "axios";

import Network from "./components/Network";
import { useEffect, useState } from "react";

const host = process.env.REACT_APP_API_HOST || "http://localhost:8080";

const socket = io(`${host}`, {
	transports: ["websocket", "polling"],
});

const App = () => {
	const [isWsl, setIsWsl] = useState(false);
	const [isDocker, setIsDocker] = useState(false);

	useEffect(() => {
		axios.get(`${host}/iswsl`).then((res) => {
			setIsWsl(res?.data?.isWsl);
		});
		axios.get(`${host}/isdocker`).then((res) => {
			setIsDocker(res?.data?.isDocker);
		});
	}, []);
	return (
		<>
			<Header />
			<div className="App">
				<div className="Left">
					<Cpu socket={socket} isDocker={isDocker} />
				</div>
				<div className="Right">
					<Ram socket={socket} />
					<Disk socket={socket} isWsl={isWsl} isDocker={isDocker} />
					<Network socket={socket} isWsl={isWsl} />
				</div>
			</div>
		</>
	);
};

export default App;
