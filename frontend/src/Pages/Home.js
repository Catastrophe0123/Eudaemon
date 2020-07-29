import React, { Component } from 'react';
import Axios from 'axios';
import { Link } from 'react-router-dom';

export class Home extends Component {
	state = { data: null };

	componentDidMount = async () => {
		try {
			let resp = await Axios.get(
				`/${this.props.role}/${this.props.organisation}`
			);
			console.log(resp);
			this.setState({ data: resp.data });
		} catch (err) {
			console.error(err);
		}
	};

	onClickPOData = async () => {
		try {
			let resp = await Axios.get(`/po?district=${this.props.district}`);
			console.log(resp);
			this.setState({ POData: resp.data, showPO: true });
		} catch (err) {
			console.error(err);
		}
	};

	fullAccessMarkUp = (role) => {
		return (
			<div>
				<div>
					<h3>CCIs under your jurisdiction</h3>
					{this.state.data.ccis.map((el) => {
						return (
							<div>
								<Link to={`/cci/${el}`}>{el}</Link>
							</div>
						);
					})}
					<button onClick={this.onClickPOData}>
						POs under your jurisdiction
					</button>
					{this.state.showPO && (
						<div>
							{this.state.POData.po.map((el) => {
								return <Link to={`/`}>{el.name}</Link>;
							})}
						</div>
					)}
				</div>
			</div>
		);
	};
	partialAccessMarkUp = () => {};

	render() {
		let fullaccessRoles = ['DCPU', 'CWC', 'PO'];
		console.log(this.props);
		return (
			<div>
				<h1>Welcome to Eudaemon</h1>
				<h1>This is your {this.props.organisation} Dashboard</h1>
				{this.state.data && fullaccessRoles.includes(this.props.role)
					? this.fullAccessMarkUp(this.props.role)
					: this.partialAccessMarkUp()}
				what do we show here
			</div>
		);
	}
}

export default Home;
