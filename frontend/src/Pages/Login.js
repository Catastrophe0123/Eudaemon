import React, { Component } from 'react';
import axios from '../util/axiosinstance';
import { Redirect } from 'react-router-dom';
import Axios from 'axios';
import '../styles/Login.css';

export class Login extends Component {
	state = {
		district: '',
		loading: false,
		error: null,
		email: '',
		password: '',
		organisation: '',
		role: 'DCPU',
		hideButton: false,
	};

	componentDidMount = () => {
		// initial get route
		// let resp = await axios.get('/login');
	};

	onInputChangeHandler = (event) => {
		let value = event.target.value;
		let name = event.target.name;
		this.setState({ [name]: value });
	};

	onSelectInputHandler = (event) => {
		let name = event.target.name;
		// this.setState({ [name]: value });
		let role = event.target.value;

		this.setState((st) => {
			return { ...st, role, organisation: st.data[role][0].id };
		});
	};

	onDistrictLookUpHandler = async () => {
		// search for the district
		let { email } = this.state;
		try {
			this.setState({ loading: true });
			let resp = await axios.post('/getLogin', { email: email });
			// console.log(resp);

			let data = resp.data.result;
			console.log(data);
			if (data['CWC'].length <= 0) {
				this.setState({
					error: 'Invalid District. Try again',
					loading: false,
				});
			} else {
				console.log(data['DCPU']);
				this.setState({
					hideButton: true,
					loading: false,
					error: null,
					data: data,
					organisation: data['DCPU'][0].id,
				});
			}
		} catch (err) {
			console.error(err.response);
			this.setState({ error: err.message });
		}
	};

	onLoginSubmitHandler = async (e) => {
		// do the post request
		try {
			e.preventDefault();
			let { email, password, organisation, role } = this.state;
			const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			if (
				email === '' ||
				password === '' ||
				organisation === '' ||
				role === ''
			) {
				this.setState({ error: "Values can't be left Blank" });
			} else if (!re.test(String(email).toLowerCase())) {
				this.setState({ error: 'Provide a valid E-mail' });
			} else {
				// send the request
				this.setState({ loading: true });

				let resp = await axios.post('/login', {
					email,
					password,
					organisation,
					role,
				});
				console.log(resp.data);
				let token = resp.data.token;
				localStorage.setItem('token', `Bearer ${token}`);
				localStorage.setItem('role', role);
				localStorage.setItem('organisation', organisation);
				localStorage.setItem('district', this.state.district);
				axios.defaults.headers['Authorization'] = `Bearer ${token}`;
				this.props.setUserDataPostLogin(
					role,
					token,
					organisation,
					this.state.district
				);
				this.setState({ loading: false, error: null }, () => {
					// this.props.history.push(`/${role}`);
					this.props.history.push(`/`);
				});
			}
		} catch (err) {
			console.log(err.response);
			if (err.response.data[0]) {
				this.setState({
					error: err.response.data[0].msg,
					loading: false,
				});
			} else if (err.response.data.error) {
				this.setState({
					error: err.response.data.error,
					loading: false,
				});
			}
		}
	};

	render() {
		if (this.props.authenticated) {
			return <Redirect to={'/'} />;
		}
		return (
            <div>
			<div className="container1 p-10 justify-center">
				<strong><h1 className='center pt-2'>LOGIN PAGE</h1></strong> <br />
				<div>
					<div className='center'>
						<label htmlFor='district'>Email:</label>
						<input
							className='border-2 ml-2'
							id='district'
							name='email'
							onChange={this.onInputChangeHandler}
							value={this.state.email}
							type='text'
						/>
					</div>
					<br />
				</div>
				<div className='center'>
					{!this.state.hideButton && (
						<button
							className='text-white font-bold px-6 py-4 rounded outline-none focus:outline-none mr-1 mb-2 bg-blue-500 active:bg-blue-600 uppercase text-sm shadow hover:shadow-lg'
							onClick={this.onDistrictLookUpHandler}>
							Submit
						</button>
					)}
				</div>
				{this.state.loading ? (
					<p className='center'>Loading...</p>
				) : null}
				{/* role, organisation, email, password */}
				{this.state.data && (
					<form action=''>
						<div className='center py-2'>
							<label className='pr-4' htmlFor='email'>
								Password :{' '}
							</label>
							<input
								className='border-2 ml-2'
								id='password'
								name='password'
								onChange={this.onInputChangeHandler}
								type='password'
							/>{' '}
						</div>

						<div className='center py-2'>
							<label className='pr-4' htmlFor='role'>
								Select your role
							</label>
							<select
								className='border-2'
								value={this.state.role}
								onChange={this.onSelectInputHandler}
								name='role'
								id='role'>
								<option value='DCPU'>DCPU</option>
								<option value='CCI'>CCI</option>
								<option value='CWC'>CWC</option>
								<option value='PO'>PO</option>
							</select>{' '}
						</div>

						<div className='center py-2'>
							<label className='pr-4' htmlFor='organisation'>
								Choose the name of your Organisation
							</label>
							<select
								className='border-2'
								value={this.state.organisation}
								onChange={this.onInputChangeHandler}
								name='organisation'
								id='organisation'>
								{this.state.data
									? this.state.data[this.state.role].map(
											(el) => {
												if (this.state.role === 'PO') {
													return (
														<option value={el.id}>
															{el.name}
														</option>
													);
												}
												return (
													<option value={el.id}>
														{el.id}
													</option>
												);
											}
									  )
									: null}
							</select>
						</div>

						<div className='center py-2'>
							<button
								className='text-white font-bold px-6 py-4 rounded outline-none focus:outline-none mr-1 mb-2 bg-blue-500 active:bg-blue-600 uppercase text-sm shadow hover:shadow-lg'
								onClick={this.onLoginSubmitHandler}
								type='submit'>
								submit
							</button>
							{this.state.error ? (
								<p className='center'>{this.state.error}</p>
							) : null}
						</div>
					</form>
				)}
			</div>
            </div>
		);
	}
}

export default Login;
