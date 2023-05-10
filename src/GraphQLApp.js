import React from "react";
import { useState, useEffect } from "react";

const Status = {
	Idle: "idle",
	Loading: "loading",
	Complete: "complete",
	Error: "error",
};

const query = `
query {
  allLifts {
    name
    elevationGain
    status
  }
}`;

const opts = {
	method: "POST",
	headers: { "Content-Type": "application/json" },
	body: JSON.stringify({ query }),
};

function Lift({ name, elevationGain, status }) {
	return (
		<div>
			<h1>{name}</h1>
			<p>
				{elevationGain} {status}
			</p>
		</div>
	);
}

export default function GApp() {
	const [data, setData] = useState(null);
	const [status, setStatus] = useState(Status.Idle);

	useEffect(() => {
		setStatus(Status.Loading);
		fetch(`https://snowtooth.moonhighway.com/`, opts)
			.then((reponse) => reponse.json())
			.then((d) => {
				console.log(`d: ${d}`);
				setData(d);
			})
			.then(() => setStatus(Status.Complete))
			.catch(() => setStatus(Status.Error));
	}, []);

	switch (status) {
		case Status.Loading:
			return <h1>Loading...</h1>;
		case Status.Error:
			return <h1>Error retrieving data</h1>;
		default:
			console.log(`Displaying page`);
	}

	if (!data) return null;
	console.log(data, `the data`);
	return (
		<div>
			{data.data.allLifts.map((lift) => (
				<Lift
					name={lift.name}
					elevationGain={lift.elevationGain}
					status={lift.status}
				/>
			))}
		</div>
	);
}
