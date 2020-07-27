import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';

export class AuthRoute extends Component {
	render() {
		let { authenticated, component: Render, ...rest } = this.props;

		return (
			<Route
				{...rest}
				render={(props) =>
					authenticated === false ? (
						<Redirect to='/login' />
					) : (
						<Render {...props} />
					)
				}
			/>
		);
	}
}

export default AuthRoute;
