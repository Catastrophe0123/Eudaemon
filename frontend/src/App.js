import React, { Component } from 'react';
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Redirect,
} from 'react-router-dom';
import AuthRoute from './Components/AuthRoute';

import Login from './Pages/Login';
import JwtDecode from 'jwt-decode';
import axios from 'axios';

export class App extends Component {
	state = { authenticated: false };

	setUserDataPostLogin = (role, token, organisation) => {
		this.setState({ role, token, organisation }, () => {
			setTimeout(() => {
				// logout
				localStorage.removeItem('token');
				localStorage.removeItem('role');
				localStorage.removeItem('organisation');
				this.setState({
					authenticated: false,
					role: '',
					token: '',
					organisation: '',
				});
				console.log('logging out');
				window.location.href = '/login';
			}, 3600 * 1000);
		});
	};

	componentDidMount = () => {
		let authenticated;
		const token = localStorage.token;
		if (token) {
			const decodedToken = JwtDecode(token);
			if (decodedToken.exp * 1000 < Date.now()) {
				console.log('expired token');
				authenticated = false;
			} else {
				authenticated = true;
			}
			this.setState({ authenticated });
		}
	};

	render() {
		// let x;
		// if (!this.state.authenticated) {
		// 	// let x = this.props.history.push('/login');
		// 	x = <Redirect to='/login' />;
		// }

		return (
			<div>
				<Router>
					<Switch>
						<Route
							exact
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
						<AuthRoute
							path='/CWC'
							exact
							authenticated={this.state.authenticated}
							component={() => <h1>hello from cwc route</h1>}
						/>
					</Switch>
				</Router>
			</div>
		);
	}
}

export default App;
