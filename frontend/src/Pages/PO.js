import React, { Component } from 'react';
// import axios from 'axios';
import axios from '../util/axiosinstance';

export class PO extends Component {
	state = { data: null };

	componentDidMount = async () => {
		//do the async
		try {
			let id = this.props.match.params.id;
			let resp = await axios.get(`/po/${id}`);
			console.log(resp);
			this.setState({ data: resp.data });
		} catch (err) {
			console.error(err);
		}
	};

	formatData = () => {
		let x = [];
		for (const key in this.state.data) {
			let value = this.state.data[key];
			if (key === 'photo') {
				x.push(<img src={value} />);
			} else {
				x.push(
					<p>
						{key} : {value}
					</p>
				);
			}
		}

		return <div>{x}</div>;
	};

	render() {
		return <div>{this.state.data && this.formatData()}</div>;
	}
}

export default PO;
