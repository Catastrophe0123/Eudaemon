import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Login from './Pages/Login';
import JwtDecode from 'jwt-decode';

let authenticated;
const token = localStorage.token;
if (token) {
	const decodedToken = JwtDecode(token);
	if (decodedToken.exp * 1000 < Date.now()) {
		window.location.href = '/login';
		authenticated = false;
	} else {
		authenticated = true;
	}
}

export class App extends Component {
	setUserDataPostLogin = (role, token, organisation) => {
		this.setState({ role, token, organisation });
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
									setUserDataPostLogin={
										this.setUserDataPostLogin
									}
								/>
							)}
						/>

						{authenticated && <React.Fragment></React.Fragment>}
					</Switch>
				</Router>
			</div>
		);
	}
}

export default App;
