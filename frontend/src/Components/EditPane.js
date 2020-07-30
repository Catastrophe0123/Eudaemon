import React, { Component } from 'react';
import EditLabel from './EditLabel';

export class EditPane extends Component {
	state = { keys: null, values: null };

	// we have the data
	// key: value
	// key : label - editable
	//

	componentDidMount = () => {
		// sort the data and setstate
		this.setState({
			keys: Object.keys(this.props.data),
			values: Object.values(this.props.data),
		});
	};

	displayData = () => {
		return (
			<div>
				{this.state.keys.map((el, id) => {
					return (
						<div style={{ display: 'flex' }}>
							<EditLabel
								onChange={(event) => {
									let val = event.target.value;
									this.setState((st) => {
										let keys = [...st.keys];
										keys[id] = val;
										console.log(val);
										return {
											...st,
											keys,
										};
									});
								}}>
								{el}
							</EditLabel>{' '}
							:{' '}
							<EditLabel
								onChange={(event) => {
									let val = event.target.value;
									this.setState((st) => {
										let values = [...st.values];
										values[id] = val;
										console.log(val);
										return {
											...st,
											values,
										};
									});
								}}>
								{this.state.values[id]}
							</EditLabel>
						</div>
					);
				})}
			</div>
		);
	};

	onAddAnotherHandler = () => {
		// add another entry
		this.setState((st) => {
			return {
				keys: [...st.keys, ''],
				values: [...st.values, ''],
			};
		});
	};

	render() {
		return (
			<div>
				{this.state.keys && this.state.values && this.displayData()}
				<button onClick={this.onAddAnotherHandler}>
					Add another value
				</button>
				<button
					onClick={this.props.onSubmitHandler.bind(
						this,
						this.state.keys,
						this.state.values
					)}>
					Submit
				</button>
				{this.props.onCreateGuardianHandler && (
					<button
						onClick={this.props.onCreateGuardianHandler.bind(
							this,
							this.state.keys,
							this.state.values
						)}>
						Submit and Create Guardian Profile
					</button>
				)}
			</div>
		);
	}
}

export default EditPane;
