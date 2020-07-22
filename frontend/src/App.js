import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Login from './Pages/Login';

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
					</Switch>
				</Router>
			</div>
		);
	}
}

export default App;
