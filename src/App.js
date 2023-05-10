import React from "react";
import "./App.css";
import { useState, useEffect } from "react";

class User {
	constructor(name, avatar, location, repos) {
		this.name = name;
		this.avatar = avatar;
		this.location = location;
		this.repos = repos;
	}
}

class GitRepo {
	constructor(name, description) {
		this.name = name;
		this.description = description;
	}
}

function GithubUser({ user }) {
	const [repos, setRepos] = useState([]);
	const [hideView, setState] = useState(true);
	const [buttonText, setButtonText] = useState("Show repos");

	//returns a promise
	async function getRepos(url) {
		const repos = [];
		const response = await fetch(url);
		const obj = await response.json();

		obj.forEach((element) => {
			console.log(`Element: ${element}`);
			if (element.private === false) {
				repos.push(new GitRepo(element.name, element.description));
			}
		});
		return repos;
	}

	function RepoList({ repoList, hide, id }) {
		return (
			<div id={id} hidden={hide}>
				<ol>
					{repoList.map((repo) => (
						<li>
							{repo.name.toUpperCase()}: {repo.description}
						</li>
					))}
				</ol>
			</div>
		);
	}

	const handleRepos = function() {
		if (buttonText === "Show repos") {
			const list = getRepos(user.repos);
			list
				.then((value) => setRepos(value))
				.catch(() => console.log("Error fetching repo list"));
			if (repos) {
				setState(false);
				setButtonText("Hide repos");
			}
		} else if (buttonText === "Hide repos") {
			setState(true);
			setButtonText("Show repos");
		}
	};

	return (
		<div>
			<h1>{user.name}</h1>
			<p>{user.location}</p>
			<img src={user.avatar} height={150} alt={user.name}></img>
			<button
				onClick={() => {
					handleRepos();
				}}>
				{buttonText}
			</button>
			<RepoList id="repo-list" hide={hideView} repoList={repos}></RepoList>
		</div>
	);
}

function App() {
	const [user, setUser] = useState(null);
	useEffect(() => {
		fetch(`https://api.github.com/users/lgoloh`)
			.then((response) => response.json())
			.then((dataObj) => {
				let user = new User(
					dataObj.name,
					dataObj.avatar_url,
					dataObj.location,
					dataObj.repos_url
				);
				setUser(user);
			});
	}, []);
	if (user) return <GithubUser user={user}></GithubUser>;
	return <h1>Data</h1>;
}

export default App;
