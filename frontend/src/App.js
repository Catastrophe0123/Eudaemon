import React, { Component } from 'react';
import './styles/app.css';
import Footer from 'rc-footer';
import 'rc-footer/assets/index.css';
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Link,
	Redirect,
} from 'react-router-dom';
import Tilt from 'react-tilt';
import Login from './Pages/Login';
import JwtDecode from 'jwt-decode';
// import axios from 'axios';
import axios from './util/axiosinstance';

import Message from './Pages/Message';

import AuthRoute from './Components/AuthRoute';

import DCPU from './Pages/DCPU';

import CWC from './Pages/CWC';

import PO from './Pages/PO';

import Home from './Pages/Home';

import EditChild from './Pages/EditChild';
import CreateChild from './Pages/CreateChild';
import Child from './Pages/Child';

import CreateEmployee from './Pages/CreateEmployee';
import Employee from './Pages/Employee';
import EditEmployee from './Pages/EditEmployee';

import CreateCCI from './Pages/CreateCCI';
import CCI from './Pages/CCI';
import EditCCI from './Pages/EditCCI';

import CreateGuardian from './Pages/CreateGuardian';
import Guardian from './Pages/Guardian';
import EditGuardian from './Pages/EditGuardian';

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

	logout = () => {
		localStorage.clear();
		this.setState({
			authenticated: false,
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
				let endTime = new Date(decodedToken.exp * 1000);
				let startTime = new Date();
				var milliseconds = endTime.getTime() - startTime.getTime();
				this.setTokenTimer(milliseconds);
				authenticated = true;
				this.setState({
					token: token,
					role: decodedToken.role,
					organisation: decodedToken.organisation,
					district: decodedToken.district,
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
			<Router>
				<div className='mx-auto p-4'>
					<header class='header lg:px-16 px-6 bg-white flex flex-wrap items-center lg:py-0 py-2'>
						<div class='flex-1 flex justify-between items-center'>
							<Link to='/'>
								<Tilt
									className='Tilt pt-2 shadow-sm border-sm'
									options={{ max: 25 }}
									style={{ height: 150, width: 150 }}>
									<div className='Tilt-inner'>
										{' '}
										<img
											width='150'
											height='50'
											src='https://cdn.discordapp.com/attachments/693464622631747706/739441746403917904/logo.png'
											alt='Logo'
										/>{' '}
									</div>
								</Tilt>
							</Link>
						</div>

						<label
							for='menu-toggle'
							class='pointer-cursor lg:hidden block'>
							<svg
								class='fill-current text-gray-900'
								xmlns='http://www.w3.org/2000/svg'
								width='20'
								height='20'
								viewBox='0 0 20 20'>
								<title>menu</title>
								<path d='M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z'></path>
							</svg>
						</label>
						<input
							class='hidden'
							type='checkbox'
							id='menu-toggle'
						/>

						<div
							class='hidden lg:flex lg:items-center lg:w-auto w-full'
							id='menu'>
							<nav>
								<ul class='lg:flex items-center justify-between text-base text-gray-700 pt-4 lg:pt-0'>
									{this.state.authenticated && (
										<React.Fragment>
											<li
												onClick={this.logout}
												className='text-lg text-white '>
												Logout
											</li>
											<li className='text-lg text-white '>
												<Link to='/message'>
													Message
												</Link>
											</li>
										</React.Fragment>
									)}
								</ul>
							</nav>
						</div>
					</header>
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
							)} // login
						/>
						<AuthRoute
							path='/employee/create'
							exact
							axios={axios}
							authenticated={this.state.authenticated}
							component={CreateEmployee}
						/>{' '}
						{/* emp create */}
						<AuthRoute
							path='/employee/:id'
							exact
							role={this.state.role}
							axios={axios}
							authenticated={this.state.authenticated}
							component={Employee}
						/>{' '}
						{/* emp read */}
						<AuthRoute
							path='/employee/:id/edit'
							exact
							district={this.state.district}
							axios={axios}
							authenticated={this.state.authenticated}
							component={EditEmployee}
						/>{' '}
						{/* emp update */}
						<AuthRoute
							path='/PO/:id'
							exact
							authenticated={this.state.authenticated}
							component={PO}
						/>{' '}
						{/* PO read */}
						<AuthRoute
							path='/CCI/create/:empname/:empid'
							exact
							authenticated={this.state.authenticated}
							component={CreateCCI}
							organisation={this.state.organisation}
						/>{' '}
						{/* CCI create */}
						<AuthRoute
							path='/CCI/:id'
							exact
							role={this.state.role}
							district={this.state.district}
							authenticated={this.state.authenticated}
							component={CCI}
						/>{' '}
						{/* CCI read */}
						<AuthRoute
							path='/CCI/:id/edit'
							exact
							role={this.state.role}
							district={this.state.district}
							authenticated={this.state.authenticated}
							component={EditCCI}
						/>{' '}
						{/* CCI edit */}
						<AuthRoute
							path='/child/:id/edit'
							exact
							authenticated={this.state.authenticated}
							component={EditChild}
						/>{' '}
						{/* child update */}
						<AuthRoute
							path='/child/create'
							exact
							authenticated={this.state.authenticated}
							component={CreateChild}
						/>{' '}
						{/* child create */}
						<AuthRoute
							path='/child/:id'
							exact
							authenticated={this.state.authenticated}
							component={Child}
						/>{' '}
						{/* child create */}
						<AuthRoute
							path='/child/:id/guardian/create'
							exact
							axios={axios}
							authenticated={this.state.authenticated}
							component={CreateGuardian}
						/>{' '}
						{/* Guardian create */}
						<AuthRoute
							path='/guardian/:id'
							exact
							axios={axios}
							authenticated={this.state.authenticated}
							component={Guardian}
						/>{' '}
						{/* guardian read */}
						<AuthRoute
							path='/guardian/:id/edit'
							exact
							authenticated={this.state.authenticated}
							component={EditGuardian}
						/>{' '}
						{/* guardian edit */}
						<AuthRoute
							path='/DCPU/:id'
							exact
							authenticated={this.state.authenticated}
							component={DCPU}
						/>{' '}
						{/* dcpu read */}
						<AuthRoute
							path='/CWC'
							exact
							authenticated={this.state.authenticated}
							component={CWC}
						/>{' '}
						{/* cwc read */}
						<AuthRoute
							path='/message'
							exact
							district={this.state.district}
							organisation={this.state.organisation}
							authenticated={this.state.authenticated}
							component={Message}
						/>{' '}
					</Switch>{' '}
					<div className='pt-20'>
						<Footer
							columns={[
								{
									icon: (
										<img src='https://lh3.googleusercontent.com/proxy/3gaITqKtjermUA5ySU1F9-HK8i--HdgIeCJEShmUc0Yd2Dgq066y0mJN6E0Sy7DvmJI3MpjL_3wp5eJsKUb-7x21L2TLdTp2' />
									),
									title: 'CWC',
									url:
										'https://github.com/AquamanRanda/AS121_Code-Geass',
									description: 'SIH-2020',
									openExternal: true,
								},
								{
									icon: (
										<img src='data:image/jpeg;base64,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' />
									),
									title: 'DCPU',
									url:
										'https://github.com/AquamanRanda/AS121_Code-Geass',
									description: 'SIH-2020',
									openExternal: true,
								},
								{
									icon: (
										<img src='data:image/jpeg;base64,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' />
									),
									title: 'PO',
									url:
										'https://github.com/AquamanRanda/AS121_Code-Geass',
									description: 'SIH-2020',
									openExternal: true,
								},
								{
									icon: (
										<img src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQsAAAC9CAMAAACTb6i8AAABg1BMVEX///8ALlMAMFcAK1EAHUoAHEoAL1YAIkwAIEsAKE8AGEgAMllNaIMAO2cANmAAM1xlCEBdNEYAKVD19/lfMUZhLEZcNkZ6eRhjKEVkHkTQ1911cxSAgBydqrft8PJaOEZkIkSElKQAN12Pnq27xM0cPF50hZgAFUdlEUIDP2yyvMdvbA6FhiDa4OVlD0GotcBWb4gADUI5V3RmYwAAAEJjd4wAADrV2+F5eQBhADdcAC0LRHbZzdODhQD4+PLk6u4ALmUAMmEAPHMAJ1dSIjiUli3k49XQuMargZft4+kmSGlCXHd7jJ4xUG8AAEQAADJcfJo9ZomTqLwYUX4AJ11/mLFriKYXUIEANnIAGFJSdp2rn6OPfIN2XmhnS1a1qa05ZJGDaXSUfodRHDVyS1yFYnJtPFSoj5tVCTPd3sO1t3eOkA/MzKebnUKGVW5zMFS/wI7fz9mTXnuJSG2LiETMy7LCpLVWUgCgoFiZl2K6u4e6uJWQjlB4I1SOjTjWwMxTABgxNjNOAAAZ7klEQVR4nO2diX/TVrbH5UiyFosEdKdABVKxJcvFoEo2UZywRCRmKLHsDlDasnTvzGvpo9NpC53Sbd6f/s65Wix5CVnsBGXy+3wgtmRd3fvVueeeu0himMOToTX1Dz68+/jevXt37/ZN1+qQQ8zNocnQ7t99/+bNmxsbGyeo4MPGzQcb79v6fxeQwL370c3NExeHOpFocaN7s/ehZRx2Fg9Izcebm5sX8zqRFfA4cVc77GzOX8EHmw8piGvTWQCNxY0HF/WjXVecDx9uXkO9ggXAWFzsnjCPblUJPtyMSOyMBaVxRG3j/rWExE5ZLC51L1qHne05SPvo4bVru2UBNB4pwWFnfcYiH2RJ7IIFeNGue9i5n6mczzdHUJzY3MQgawcsFpce+EfIhzZTn3lt8+HDh5sffX7v8V2Mvd+/dhNjz1ESIyzAaziHXYRZKakfQOTeB66Wq/8k0NwP711MQ/GJLJbKj5qHlfnZ6u5Dag/XHt/Xptk69E6UE1n7GGGxtPRAP9A8z0fk8SZaxN1mlgMxjK2twDCy0UPQ9G5uLE5jUeGrB53zmQtQbD786H4KYuv6k48/+fStRJ9+8vGT6+lOQ3//wcZkFksV2T6cEsxOnz/cfBx3s4jz2Rdv3Tr91lCffvHk+vWtnHVY96hxjLMAGAW3jMcP4w4nuf71pzkOpz95cn1igK15DzYWJ7BYWuDNA837jHX384iE8eTTU1kQp05/vTX9KKv9YBKLSoUvcNR1/z79s/XxqVNv5Uh89ooul7uxMYlFmS/sqAahTnHri1zdeOv06SevPtS4290YZ7FQ7hY5At36coTErY93Vhyt3R1nURGUOed3jnpy+tTprE6dur7jY6uPlsZYFNd/bv39Vo7E6Vuf7MbGrchr5FiUu525ZXeeenLr1AiKL3eXQEDrSY7FgjSYT2bnKvLFiFGcvrUDpzmShtIdZbEgF69nAvXjVF5ffbaHZLzuKIuyXLS25PpfTs0CBcMo3REWC0LBOibXvxpFcevrvaVEwu4Ii7JYrJGdMau49cVekzIujrIQ/Flmdd767KsRGH/5+94nOrRHIyzKQpEM4+9/GdGtnYdY4zIfjLAQ+zPL6dx1/asRFF/t0VnEilzGkEVJKE5T8uUbIyz+Z3/pdUZYlPnCxBjGKIqv9lNDUP1unoXam0lGD0CfjVSRN/6x3xSNxTyLUqso3vMfI3Zxdr9mAe6zm2fBFaS7apydtVlAxPWgkmOhFqSH9p8Lb+R0Yf9mwTB2N8eiJBVj9v3Ls3kW+2xEInXkSo4FX4x1GXkSb5zdX2yRqK1mWZTFQowCb32TZ/HNLKoIes98HSlEQ3J9hMXZ2STb6S5kWLC1Qizk+jrvOi/sclxvmkivnGEhtWeT6pz1j7zr/ObdGaXrSxkWBRnP+efZrN74ZpvJwl0JHMaQRUFmE9/IsTh7YVYV2+oWLgbfupBn8c9ZJexsDFmwG7NKda4aYXFhBgF4JGNxIWVRkFG+62/mWcyoGQHVyykLuckwT9dnlvK8dP2bHIs3ZxN1ogZDFjjd/m0RWFzI6pvZsQjVhIUEVWT9r8cskIUMHbOn/1sAFu/MnYXag3b62/9qFqm/4KpQRf73rzNLeG4aYfHmnZmlnLYjasAwz24UgMXW23kWM4svSBJf0L7IXy9/N6uE56etN/OaedxZboFZPL1x+ZdZJTw/kQtzYqF1I7sQ0Sy+u3zj21klPEf9lGfx/azS1aO+WVk1qFnc+NesEp6jfnw7x+LtWfVT7YgFnT787vLlG89mlO489fVajsXajMYvyICOa6k4oPXsBrB4Opt056p3R1j8MJtkHTreWZY1DL8vX75cgFALGpIRFj/PJlmdjoPLOHf4LZhFEZpU0Mkci5MzCrYUnB+hQ75PEcXlIjQj4DzfeTurn2aSaPAA7xNYCuIaUgzXyTA/r+VYrM0kUbO7VFlo4MTht6uUxe2ZJDtvbY2wmInz7OJ9RdicPqM1pCDuAqKtkzkWs3Ceeje+3yxyFsWItFBf5wzj5AwcBrlYXqL3Ia5HKIpSRbCSZL3nOyf3H22BWfA49L3+XYTicgE67LH+efKdjNb2PYsYLC3x1Cq+W43NohitCOrdtSyLkz/uNz2/+wh9xfovMYrLN4oQdEYif2QN4+R+K0nz0QM6ffrd6vmYRTECrUhf5wxjny1J8GgRF+GsI4rzxfKcKLJ2Miscw9hzDScXFVzxfPvy6vmERQGGtDK6k4Nx9T8QGPy2x6Q8upTz6eXz5xMWhTILuJg5u6AhxvMXe0rpPl2k9q/V81QFNAvolFzNGQbE4bf/vRcYBIfFoAE5H7M4XzizAP2UrSVraBgv9wQD9OJGggJh3Ph1pvk8CP2Q8xhr4DHWr1zZi8+4/cuQBLIowJzymO6MGcZv/77ycreprP/rfBbF+fOrRRjnHFPOe17FGOP5lSvndlfZn11ePZNHUbwagtrKBxkQfN6+cmU39WQdSYCyLIoybjGqXFuyhr2S3xDGuZ250Nu/nqckcixWC9eGJMq5jKvYXf0dYVx5daix/uyX1ZhElkUxnUWkXMOKtWT9EoVx5cyLbVqD21kQWRirRRnNmiTyRwYGbUtuxzCuXHk5EcftZy/PX1o9d+bMBBYF9ZuJtnIwcKrkaUQCkVx6/tuL2+sJkfX1289+/fPcpXOgM5NYrBappz5JORi0YX3xb8oChX/PnXv+++8vf3/+/MyZiMO5KTBWi9YNGVceBoSfzIsrKYyMzl0akpjE4gigAJ/xfbaa4GTJi0kssiTGWJw5U3BfkYj8OIwz1uh430QY57aDsbrX0Y/XTndGYdyeWEmmsyhyXDGqd9fSerJGq8n681cYRo7En4WNNidp66erQxh0vuTlGIxpleSIuIqMfk5NY402rcyLSyMwJleS1T+PUP1ItPXj1bUEBp09Wh81jQmGsbr6WwGHbnagH76/GhnH2tU/6EKEF+eubMtidfXl0SSBehdpUEX1hPktSyPP4hyQOFI+c0z/+fFqhOPqT9Q01rM08ih+PdokUFt3TsY47tBlsOvPziR+Y+g9L/357OjWjpx+uPPHVeBxNZlovf3y3NA0Ll1a/fO3o28SGf3w84/fr139v7Wfo6dDrT/99Tnlceb5r9sN8xxVka0ffr7z4093khUJt1/gcMahZumwRQrx9IZjHetYx9q3iGX6Slux9UI8zGiecuxyQ5RAAteq9QvxUI55qSqKbKnEAgv8Izbm9bQW8to3tkbIsyVVlnueHy62OHU+Twk0XH9Qr9cHvvsaP2rO6Amlkthzo0sW6AOuMfvHiho2zwsqy7KqwDeU19YnhYCCy74rx2rP3C4sSSyxAi8KoiywJfF1fSKj3iiVRp9hT52nYVnW0JwJfItfgQCftNFP8XGW2fc9xfOrzVxFcGUAsNC3nMCxqr2GEKZ7NMvKvw1L0/t+GLZDX894cMfKaH5VjKhsafJje7QVfnn4OraAl5fjRzV35Vb0WDBSTj5FMmoyJ4AkQeClTEWwwB817LTI1mBoFxacJGuT+nKUAjRoohcMt/KJ5OX5tXI6B8Y7+YVLjexTJIMyK8aZrrHxI9JInc09LM2os6Var1dfEDiJlVp+nKxRYUv5JxtnHk7ZVtl65vSYnXqvXitzAisI2nBrSRCp5JCZm9pSSZz8Yq09sRD6+B4fR8emiQujQla5bZ4vNwBOmZcBQqlbBr5G0PKFktQj6dZy1Yw0v4d8BlBF5Mlufc8sqKwKtM207hEOWo9pcUVTLpWkzEt6YhaovlBqWOlWdf4tsSWX2MrkjO6PBRNAg9HC46G4wtSHwvfgWpT44XtpkEVc6kBOLfZgWOBZBnNhwViN6DGUYOyNaQGF1mLrpWwNyrAgXMrwYFiYYkma4o32ywLcYomDEgzUkjytiigS7/oCK6VtTIZFh0/b+oNhUd0pC1LZNQsoASZQY9nalLM7IlsjcB5OzxyTsABGQpBuPRi72KaOsL12qlJptyywkCZD2OksbAFfL5GFNfSdffhkDreWqzrVHB/y6fIlVp38hgcoCu26xto9iyCq8BVoRiafHBoxfO2IzqcNBpaac5ugNi8NX6KJ8YXIoVpzfDWHBmeRJzfZyEISEwl7YCFSFj02NfsRmZzk4WHgMLx4E5aak2WZl9jBMFvJVllenmO3zqixJWnykzOBhagHTixtYdcsOtAogpV7Ui6aGorU2MgeoKVJXkuDpeZlGePMTKmxjuhNqj2Wc0eCnJYaEy9b3ncaC7v2nVD/EAIUZLJ7hh5b1DHpiNlIgm9alt7KPSL7YHwnBltTsrrvNlWRShxc7qBVmhxggEnWyiqoBo6pHjmtxHeaEKANn5F9QCyYEAyDH/FI9Lz7ZaHFsRbjCSW1N95WYSw2dEZy1ECkbaonlrg0rYNi4TQgCub6mbwGPm3L9suip0YxOONwbElQsjBoOBFKklKNVUlsM2Vh9KThsMpBsWDcFotjfIlX0uxyi+ZhfyyMUCiJceuAw0VCL60mzR66CY1jhy94s5M4fRhrdaBLl7xz98BYwJlUqLCyoPSrdthtCCy3cxaS0nQjaRGLaNDC0CVAkQZxfZktqa22bmmW60syHdfyhUz75bTiAaVM3NmEWI9LvUhZdxPNjwTIqvN0SkAQBZwUkJZ3zqIkxeNNy1Y0liOooe+3RbioDW8Yw+noEiRObsgcdF85cCOOwGbfN9KWSg2DybFg+nwpfpsojbXiE7Xm/BpeYtYaFAMA4RrtqLpoK2J2jE9MYz6JS8b4KlwSivH4FiqjDKmoEg7RiY167vo5Pg/hEx0Hlzkf+uh2i8++uKq5LK6gl9JXxJW0NoSy2IqsZSWN+cR5RluRiNVvV0ReqHvpmGtQNavDsUUyHFKCT830k5kdbgqadrsm8lx50B+LZQPX65Wlcs+PxnpHR6jgO1qjBidNvawBG6udaGuqwrwG7VjHOtaxjnUkpKcyX5sX3wSmrh/G6osFLtHKa9Mcay2eO4zXxdZLpQpV+fV5Zxj0xRYOhwXfDKhenxf3auJhsRgfzzWMHZiIEeyla2wEO0j6FSzmtpJrlEVV6VVUla0repwbNwyTLg58jHsdHbsO/aqK4qbZ8pSQsiFtJSPYbSrp8ZpXk4RyGPlFEirKcEY1DDO5iFlU4RcpEl+JOnlBH/JXwxNrYeZEsLMZhtD3sbJbTYZ4StpZVRTovdmZ3VAakn5pO2MsJEEVBIHnodsUTb+Yciv5gdlo0WIRvyUIHM+JAt8w0n3RHIWxAp1lEXqf2DnHstp8fLyhtARO5mVBXqCpaILQSGZ4nFYrM2wdsyChKLYT2G2ZlklvcJgGt2Lj2hSeF+IzubgLF4/p8VYOt2oMqYmVJNkyB936QYvnOUkSsEvfxjUygkRnEBqVcbuosLWO42h6W2ajTrApysPZGbrmwOiJkuiZrm735HQEocmzC5hvYvf7fUWSFPhj405biI43eoJQNy1ND3k12mIL6QyAI8vjLHBGhksGcUIBWVgtVuhbmuu1+oyDZxqokg8nwnFHl8eBJQu39tgy/LGrOJkgpRNtSzimasIOX2V7mD2LznfWqn2UO4GFGrcnrsjSR5OPs1BEYRBN/RNrKWGB08JpgOJyXPo5YQFHxQOZOs+W8bC+UGKlznYsxFIpmRGLWAwkLqpwVj9JPR03j1hQKVIlttcxFqhATCecSEUajo1gO2LQdoTkWTBNjsVX+Y6xcOXMUHXixyxeVYevCtfHWVgNNj3KFugoHbBQ1bKxDQuupJZaboaFnL4hk7yCRbIaYRILh8uyqGdYlLgWKl7oNWTBeBK6jDEWA2nCG34VMfSkxnDR1BgLXDKQbDJEVgyQRS2UosVF01iwoRSP6kYseHbkLbKzZgHOR5Zb8d4MC4vHQ0ZZOPKEufCOKDctOV3kN87CqLALwzZYkbDofbES1CXR34YFZ9mcWgtSForAVprZJnUGLLJ1RKji5KPrjLEIOKwMoywsOU0okyVRZUhdKqeLIEZZOEJ2vUJVxNnTvsAyHYHlq9NZwKGhIOGREQtHADvpZTor+2fB1vo2ilDfmRshzbAgHK4hHGXh8uMr7QIOa1NVTFaHj7PQxOzso87h5AiwIOhHGu52LKA0iCFiwTgDGdpLyRymvm8WLDapdMh8ajsCdj2FxbhdVDnRwCVoycrCcRYdUcqsZjYTuyAYFrAtLZjOggkWWL6fsICaqwgC2/DT1PdvF7YPsrZnofF4LbMsRGChNcb8BREEG+9xADdgTWERlJMpYZRPHWnEAmeHKpYwnQVjQevuKkIaP3Z8rtRo7pBFfchi8dX+YioLqNV9ZJE2AFWBdxhDZUfbEQgY6qhasv5yQjuSa30W2IaTsgCHqNZK27Bg3AZbrmeXdsaN8k5Y9FQpKU85qabT25FpLOBSch0MJ9IJvLa0ROhCsZGp8Loq0WXHglRqOFNY6PywMC5Hc5WwIAMpv6J3lAVTHVnm6jSSYr2KBbblWnJQMoO7DYvJvtMYRM1dILBiHOvx9Go4Aiu0k0WmuCi9yfMuDdcMU4z86gQWpMwmIaSmsnRTwoIJKq9ggcsKkEWzk8DcqV3g4qYYmy8lS72ms8CAnsrGawq+BP8YLrT8UStoc2zNNYihl1WO5sVtsVK5bzla0y4vB+jikyXrEERxZDILbDBkXzMMx1TZBr1AKQtGk9ntWZC2gCysZRtSCHSVTYr1ShYQ2AiKRojji6nHybFQ69H9FU2LqbOsECmatIT+enmgtGu80Iq7D6QtS1ytXuOkOBxmmg1RFXjoqQrCSgAudnijlS/QhRA6z2dYxPm2BFGAdAROiu+o6IsJC0gx5y84lobmGp/WX6MmQkk6yyJXqZchJ/1h6ikLOb3DIBSGgZ3VkKBTWIdaXE+2ObyQaUdUOVrqZjI1NVGUZa8m8nKjwQuZAQWzgivjxHZamYx+DXvKnOppaL982kJosoBEdXnYT7PFpM9v2GVIB1KO07H51K0x5nKWhSzRxZOanC5ghKAMTV1ZEDEn9fTHNtdKA385XZASiuVhkOsoAo+r/ez0ZI4spizKUlR6SSWMMVTyS6vpNrX8uFIHTCjfEcD7d7RoAYWR+W30hWRGxkhmN9HgoGDSHiZ3viTJ7A+iXiBxIIlMTjJpZE6aSxmSwdNmt2Syl5b+tRntPdaxjnWsYx3rWP+tItbO7/h0ktjGyN+7vTt1MhHSDpIZO9d+FzXquqVp1qQ7lAJ1fKSTrpYwzbFnpHSTn2rLk+/vHVO/aUF8aOYSem84nGj9bWLBOr43nMh03ssPP2p/29/tuqSna6Gn6ZMeMNCfeCuNvhx0/NE9w1A7fOWjEOhPHbWptUzNz92HoGXmryfeG6MpTFAbFjh7LjzU2l9kbUDKmCHLYKIYPZ4OQmvt97PfGBLN2GiP4D8z+h6fO/mDf9tu8mv61xjuibdodOgNi92Fc7txsulsOsl0VtLPSfehCufVsEtG6FyXokfnxinF1ESMIH/o7njQi0N8fwAVperX4IrgpHYAn6v1noPjr14YOG3TpVMXyAI6Q1qv2q/1Asata56v9XSc+VZ8AtfKXgwNxuy5XtnXFBXz2PfaVcasucqSx5CluhdbVZfOKvlWTSNwWguSdBmzrnsbsL/aC4jXdgcS5KkTeqGnYC02awYtpu7bdTgYtpk9x1B6pNMaKLpex6FE3xt0mGZd9xdDwgS+PdiVF6EsFIvpdBnAYftM0A0gj0zVC0jdZJw6Yew+Y9eq9F4STbYs7LwrvmHU4LL22qbOQCm0RSinzoRVI3hkMQavE2tZJ03o4fdNhiwHgYBbgFLoBBkWrtC3g57FeJCJpSZDWjrRlh04i8E0FzTGbjNEwrPQymTUVXrzN9ToatdAFkYLfssTONwhTguuHzguv8aQehX4aIzfZKwdOrAhC4f3faWHtbRqMyYkGAQMzlz7Jlwi3+9VwUqiX2tys4mPsPDBFDy4WD3MXbtJvzsEPzF4o+BGQP8RyLLs+V4tIGWHMYSA0dORTMrCQk9l0RPRpLpwbRsOE0D5tB7dHeBomhc5FuKtgKHVdVztoDEhQILfOt3ocEMmRIKcae8FNAt1QFnbpTul/qIXPcrIMQdVxo4qH7LwTMbTaaXsxzUS60gAGYbNeGFInY57N5l2NLQCnxjYRB4EYBsBlMkIZAOTNgQooTzGokndh2Ni+TDjjzpgG1A+jkCeIhPo+06zG91TBHa0bDJ0iqBloRUTSFFbil6YFzRIgGM9HTi+h9NOGtT85frw+QA7ZNGRqZPx7aCPlhBtBxaKiZWGksmwYCyHOi68MDWsj70mE3sBvA1pCTLyCDg0ArA3g0Q3Mxg8sGgZ1OgyLFxcIuL1Dd9NWRhQRzoiYZq9aHfgmfGyITwF1IIuGgFYSy9mUYtYOMACpyK0RnQ5ljSwc0fJjKi/Wm0P21alo5kanCCsYpDguFD18X5ak9FWTKfpMl5cBgt+46hwlEmNlXTxIlVcxl1xHdNiVPiK/gLK48AvNfAQSk/rmEbwHmxZCcD/MdGCB4PesaXXMSgxCHrfVhNMv8MEK+ADGoTuMoFHve/ESyRCnTYedo3QBl+Crw2X0cEuFI8JOu8ZTAjslCr4GMiCrKEXdCdFSVMUKIriwSULa0oH3I6P1mr16lXGVRTrvgKuwa3Dt6ai3MWL04RGRQlt2BtqphI6VVwnBf91IOtQHvjk2IpCPMUzPHCvuLaKeLW2xdiKF8BWxmnXaVgArZNiEyfEQ726bdabfWi8fPorH66mDf9MTYGim8qgFy0MwOVZeLDfw8VfJs3cwqBa60OOe7oP7ZihDPAXSTbcgecdpeE8dBvgsQ87G6+FdGgqDH9XLePRlR6G/uwfDPT/GqvIK/LA/w8AAAAASUVORK5CYII=' />
									),
									title: 'CCI',
									url:
										'https://github.com/AquamanRanda/AS121_Code-Geass',
									description: 'SIH-2020',
									openExternal: true,
								},
							]}
							bottom='Made with ❤️ by Code Geass'
						/>
					</div>
				</div>
			</Router>
		);
	}
}

export default App;
