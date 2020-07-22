import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Login from './Pages/Login';

export class App extends Component {
	render() {
		return (
			<div>
				<Router>
					<Switch>
						<Route path='/login' component={Login} />
					</Switch>
				</Router>
			</div>
		);
	}
}

export default App;
