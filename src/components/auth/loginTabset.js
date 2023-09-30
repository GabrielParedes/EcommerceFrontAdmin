import React, { Fragment, useState } from "react";
import { Tabs, TabList, TabPanel, Tab } from "react-tabs";
import { User, Unlock } from "react-feather";
import { useNavigate } from "react-router-dom";
import { Button, Form, FormGroup, Input, Label } from "reactstrap";
import { postData } from "../../helpers/apiCaller";
import Swal from "sweetalert2";

const LoginTabset = () => {
	const [formData, setFormData] = useState({username: '', password: '', type: 'admin'})
	const history = useNavigate();

	const clickActive = (event) => {
		document.querySelector(".nav-link").classList.remove("show");
		event.target.classList.add("show");
	};

	const login = (event) => {
		event.preventDefault()
		postData('clientes/username', formData)
			.then(resp => {
				if (!resp.message) {
					localStorage.setItem('user', JSON.stringify({ id: resp[0], name: resp[1], username: resp[2], email: resp[2] }))
					localStorage.setItem('isSessionActive', true)
					// router.push('/shop/list_view');
					history(`${process.env.PUBLIC_URL}/reports/report`);
				} else {
					Swal.fire(
						'Credenciales incorrectas',
						'Las credenciales proporcionadas son incorrectas',
						'error'
					)
				}
			})

	}

	const handleChange = (event) => {
		const { name, value } = event.target

		console.log(name, value)

		setFormData({
			...formData,
			[name]: value,
		});
	};




	// const routeChange = () => {
	// 	history(`${process.env.PUBLIC_URL}/reports/report`);
	// };
	return (
		<div>
			<Fragment>
				<Tabs>
					<TabList className="nav nav-tabs tab-coupon">
						<Tab className="nav-link" onClick={(e) => clickActive(e)}>
							<User />
							Login
						</Tab>
						{/* <Tab className="nav-link" onClick={(e) => clickActive(e)}>
							<Unlock />
							Register
						</Tab> */}
					</TabList>

					<TabPanel>
						<Form className="form-horizontal auth-form">
							<FormGroup>
								<Input
									required=""
									name="username"
									type="email"
									className="form-control"
									placeholder="Email"
									id="username"
									value={formData.username}
									onChange={(event) => handleChange(event)}
								/>
							</FormGroup>
							<FormGroup>
								<Input
									required=""
									name="password"
									type="password"
									className="form-control"
									placeholder="password"
									value={formData.password} 
									onChange={(event) => handleChange(event)}
								/>
							</FormGroup>
							{/* <div className="form-terms">
								<div className="custom-control custom-checkbox me-sm-2">
									<Label className="d-block">
										<Input
											className="checkbox_animated"
											id="chk-ani2"
											type="checkbox"
										/>
										Reminder Me{" "}
										<span className="pull-right">
											{" "}
											<a href="/#" className="btn btn-default forgot-pass p-0">
												lost your password
											</a>
										</span>
									</Label>
								</div>
							</div> */}
							<div className="form-button">
								<Button
									color="primary"
									type="submit"
									onClick={(e) => login(e)}
								>
									Iniciar sesión
								</Button>
							</div>
							{/* <div className="form-footer">
								<span>Or Login up with social platforms</span>
								<ul className="social">
									<li>
										<a href="/#">
											<i className="icon-facebook"></i>
										</a>
									</li>
									<li>
										<a href="/#">
											<i className="icon-twitter-alt"></i>
										</a>
									</li>
									<li>
										<a href="/#">
											<i className="icon-instagram"></i>
										</a>
									</li>
									<li>
										<a href="/#">
											<i className="icon-pinterest-alt"></i>
										</a>
									</li>
								</ul>
							</div> */}
						</Form>
					</TabPanel>
					<TabPanel>
						<Form className="form-horizontal auth-form">
							<FormGroup>
								<Input
									required=""
									name="login[username]"
									type="email"
									className="form-control"
									placeholder="Username"
									id="exampleInputEmail12"
								/>
							</FormGroup>
							<FormGroup>
								<Input
									required=""
									name="login[password]"
									type="password"
									className="form-control"
									placeholder="Password"
								/>
							</FormGroup>
							<FormGroup>
								<Input
									required=""
									name="login[password]"
									type="password"
									className="form-control"
									placeholder="Confirm Password"
								/>
							</FormGroup>
							<div className="form-terms">
								<div className="custom-control custom-checkbox me-sm-2">
									<Label className="d-block">
										<Input
											className="checkbox_animated"
											id="chk-ani2"
											type="checkbox"
										/>
										I agree all statements in{" "}
										<span>
											<a href="/#">Terms &amp; Conditions</a>
										</span>
									</Label>
								</div>
							</div>
							{/* <div className="form-button">
								<Button
									color="primary"
									type="submit"
									onClick={() => routeChange()}
								>
									Register
								</Button>
							</div> */}
							<div className="form-footer">
								<span>Or Sign up with social platforms</span>
								<ul className="social">
									<li>
										<a href="/#">
											<i className="icon-facebook"></i>
										</a>
									</li>
									<li>
										<a href="/#">
											<i className="icon-twitter-alt"></i>
										</a>
									</li>
									<li>
										<a href="/#">
											<i className="icon-instagram"></i>
										</a>
									</li>
									<li>
										<a href="/#">
											<i className="icon-pinterest-alt"></i>
										</a>
									</li>
								</ul>
							</div>
						</Form>
					</TabPanel>
				</Tabs>
			</Fragment>
		</div>
	);
};

export default LoginTabset;
