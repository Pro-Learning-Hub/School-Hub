import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { formLogin, googleLogin, loginFailure } from '../../redux/actions/uiActionCreators';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';

export default function Login({ setType }) {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const isLoading = useSelector((state) => state.ui.get('isLoading'));
	const isLoggedIn = useSelector(state => state.ui.get('isLoggedIn'));
	
	if (isLoggedIn) {
		const intendedPath = sessionStorage.getItem('intendedPath');

		if (intendedPath) {
			sessionStorage.removeItem('intendedPath');
			navigate(intendedPath, {replace: true});
		} else {
			navigate('/');
		}
	}

	function handleSubmit(event) {
		event.preventDefault();

		const email = event.target.email.value;
		const password = event.target.password.value;

		dispatch(formLogin(email, password));
	}

	function handleGoogleLoginSuccess(response) {
		dispatch(googleLogin(response.credential));
	}

	function handleGoogleLoginFailure(error) {
		dispatch(loginFailure('Google login failure!'));
		console.error(error);
	}

	return <>
	<h1>ProLearningHub</h1>
	<p>Please login to continue</p>
	<form onSubmit={handleSubmit}>
		<label htmlFor='email'>Email</label>
		<input name='email' id='email' type='text' placeholder='Here insert your mail please' />
		<hr />
		<label htmlFor='password'>Password</label>
		<input name='password' id='password' type='password' placeholder='And here.. Your password!' />
		<hr />
		<button type='submit' disabled={isLoading}>Login</button>
	</form>

	<button type="button" onClick={() => setType('register')}>Register</button>

	<GoogleLogin
  onSuccess={handleGoogleLoginSuccess}
  onError={handleGoogleLoginFailure}
  theme="filled_blue"
  size="large"
  shape="circle"
  text="signin_with"
	buttonText="Continue with Google"
  logo_alignment="left"
  width="300"                // Width of the button in pixels (optional)
/>
	</>
}
