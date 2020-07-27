import React, { Component } from 'react';
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Redirect,
} from 'react-router-dom';

import Login from './Pages/Login';
import JwtDecode from 'jwt-decode';
import axios from 'axios';

export class App extends Component {
	state = { authenticated: false };

	setUserDataPostLogin = (role, token, organisation) => {
		this.setState({ role, token, organisation });
	};

	componentDidMount = () => {
		let authenticated;
		const token = localStorage.token;
		if (token) {
			const decodedToken = JwtDecode(token);
			if (decodedToken.exp * 1000 < Date.now()) {
				// window.location.href = '/login';
				console.log('expired token');
				authenticated = false;
			} else {
				authenticated = true;
			}
			this.setState({ authenticated });
		}
	};

	render() {
		return (
			<div>
				<Router>
					<Switch>
						<Route
							path='/login'
							render={(props) => (
								<Login
									{...props}
									authenticated={this.state.authenticated}
									setUserDataPostLogin={
										this.setUserDataPostLogin
									}
								/>
							)}
						/>

						{this.state.authenticated && (
							<React.Fragment>
								<Route />
							</React.Fragment>
						)}
					</Switch>
				</Router>
			</div>
		);
	}
}

export default App;
