import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import './EventList.css';

/*
 * The Event component
 * displays the event details
 */
class Event extends React.Component {
	state = {
		id: null,
		clicked: false
	}
	render() {
		if (this.props.match.params.name) {
			let name = decodeURIComponent(this.props.match.params.name);
			let date = new Date(this.props.match.params.start_datetime);
			date = date.toLocaleString();
			return (
					<div> 
						<h3>Name: {name} </h3>
						<h3>Start Time: {date} </h3>
					</div>
			);		
		}
		else {
			return (
					<div></div>
			);
		}
	}
}

/*
 * The Event List component
 * lists the Events, links to separate Event components
 */
class EventList extends Component {
  constructor(props) {
		super(props);
		this.state = {
			error: null,
			isLoaded: false,
			events: []
		};
	}	
	// make the API call to fetch events
	componentDidMount() {
		let bypass = "https://cors-anywhere.herokuapp.com/";
		fetch(bypass+"https://api.smarkets.com/v3/events/?type=basketball_match&period=upcoming")
			.then(res => res.json())
			.then(
					(result) => {
						if (result.events === undefined){
							result.events = [];
						}
						this.setState({
							isLoaded: true,
							events: result.events
						});
					},
					(error) => {
						this.setState({
							isLoaded: true,
							error
						});
					}
			)
	}
	render() {
		const { error, isLoaded, events } = this.state;
		if (error) {
			return <div>Error: {error.message}</div>;
		} else if (!isLoaded) {
			return <div>Loading...</div>;
		} else {
			// display list of events as routes
			return (
					<Router> 
						<div>
							<h2> Events </h2>
							<ul>
								{events.map(e => (
									<li key={e.id}>
										<Link to={"/" + encodeURIComponent(e.name) + "/" + e.start_datetime}>
											{e.name}
										</Link>
									</li>
								))}
							</ul>
							<Route exact path="/:name/:start_datetime" component={Event} />
						</div>
					</Router>
			);
		}
  }
}

export default EventList;
