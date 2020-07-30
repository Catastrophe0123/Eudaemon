import React, { Component } from 'react';
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Redirect,
} from 'react-router-dom';
import AuthRoute from './Components/AuthRoute';
import CCI from './Pages/CCI';
import DCPU from './Pages/DCPU';
import CWC from './Pages/CWC';
import PO from './Pages/PO';
import Home from './Pages/Home';
import Child from './Pages/Child';

import Login from './Pages/Login';
import JwtDecode from 'jwt-decode';
// import axios from 'axios';
import axios from './util/axiosinstance';

export class App extends Component {
	state = { authenticated: false, role: '', organisation: '', district: '' };

	setUserDataPostLogin = (role, token, organisation, district) => {
		axios.defaults.headers['Authorization'] = `Bearer ${token}`;
		this.setState(
			{ role, token, organisation, authenticated: true, district },
			this.setTokenTimer(3600 * 1000)
		);
	};

	setTokenTimer = (time) => () => {
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
				district: '',
			});
			console.log('logging out');
			window.location.href = '/login';
		}, time);
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
				let endTime = new Date(decodedToken.exp * 1000);
				let startTime = new Date();
				var milliseconds = endTime.getTime() - startTime.getTime();
				this.setTokenTimer(milliseconds);
				authenticated = true;
				this.setState({
					token: token,
					role: decodedToken.role,
					organisation: decodedToken.organisation,
					district: localStorage.district,
				});
				axios.defaults.headers['Authorization'] = token;
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
						<AuthRoute
							path='/'
							token={this.state.token}
							role={this.state.role}
							organisation={this.state.organisation}
							district={this.state.district}
							exact
							authenticated={this.state.authenticated}
							component={Home}
						/>

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
							path='/PO/:id'
							exact
							authenticated={this.state.authenticated}
							component={PO}
						/>
						<AuthRoute
							path='/CCI/:id'
							exact
							authenticated={this.state.authenticated}
							component={CCI}
						/>
						<AuthRoute
							path='/child/:id'
							exact
							authenticated={this.state.authenticated}
							component={Child}
						/>
						<AuthRoute
							path='/CWC'
							exact
							authenticated={this.state.authenticated}
							component={CWC}
						/>
						<AuthRoute
							path='/DCPU'
							exact
							authenticated={this.state.authenticated}
							component={DCPU}
						/>
					</Switch>
				</Router>
			</div>
		);
	}
}

export default App;
