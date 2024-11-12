import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { User, University } from 'lucide-react';
import { formLogin, googleLogin, loginFailure } from '../../redux/actions/uiActionCreators';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import $ from 'jquery';

export default function Login({ setType }) {
    const [adminLogin, setAdminLogin] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isLoading = useSelector((state) => state.ui.get('isLoading'));
    const isLoggedIn = useSelector(state => state.ui.get('isLoggedIn'));

    useEffect(() => {
        $('.input100').each(function() {
            $(this).on('blur', function() {
                if ($(this).val().trim() !== "") {
                    $(this).addClass('has-val');
                } else {
                    $(this).removeClass('has-val');
                }
            });
        });

        const input = $('.validate-input .input100');

        $('.validate-form').on('submit', function() {
            let check = true;
            for (let i = 0; i < input.length; i++) {
                if (validate(input[i]) === false) {
                    showValidate(input[i]);
                    check = false;
                }
            }
            return check;
        });

        $('.validate-form .input100').each(function() {
            $(this).focus(function() {
                hideValidate(this);
            });
        });

        // function validate(input) {
			// Commenting out the email validation for now
            // if ($(input).attr('type') === 'email' || $(input).attr('name') === 'email') {
            //     return !!$(input).val().trim().match(
            //         /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/
            //     );
            // } else {
            //     return $(input).val().trim() !== '';
            // }
		// }
		
		function validate (input) {
			// will delete this when done ( use above function)
			// This part is still valid and checks if any input field is empty
			if($(input).val().trim() == ''){
				return false;
			}
		}
		

        function showValidate(input) {
            $(input).parent().addClass('alert-validate');
        }

        function hideValidate(input) {
            $(input).parent().removeClass('alert-validate');
        }

        return () => {
            $('.input100').off('blur');
            $('.validate-form').off('submit');
            $('.validate-form .input100').off('focus');
        };
    }, []);

    if (isLoggedIn) {
        const intendedPath = sessionStorage.getItem('intendedPath');

        if (intendedPath) {
            sessionStorage.removeItem('intendedPath');
            navigate(intendedPath, { replace: true });
        } else {
            navigate('/');
        }
    }

    function handleSubmit(event) {
        event.preventDefault();

        const email = event.target.email.value;
        const password = event.target.password.value;

        dispatch(formLogin(email, password, adminLogin));
    }

    function handleGoogleLoginSuccess(response) {
        dispatch(googleLogin(response.credential, adminLogin));
    }

    function handleGoogleLoginFailure(error) {
        dispatch(loginFailure('Google login failure!'));
        console.error(error);
    }

{/* May be put this in top right corner, needed to switch between admin & student */}
// 	 <button type="button" onClick={() => setAdminLogin(!adminLogin)}>
// 	 {adminLogin ? (
// 		 <>
// 		 <University />
// 		 'Admin Login'
// 		 </>
// 	 ) : (
// 		 <>
// 		 <User />
// 		 'Student Login' 
// 		 </>
// 	 )
//  }
//  </button>
//  <h1>ProLearningHub</h1>
//  <p>Please login to continue as {adminLogin ? 'admin' : 'student'}</p>

    return (
        <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
		    <div className="limiter">
                <div className="container-login100">
                    <div className="wrap-login100">
                        <form className="login100-form validate-form" onSubmit={handleSubmit}>
                            <span className="login100-form-title p-b-43">
                                Login to continue
                            </span>

                            <div className="wrap-input100 validate-input" data-validate="Valid email is required: ex@abc.xyz">
                                <input className="input100" type="text" name="email"/>
                                <span className="focus-input100"></span>
                                <span className="label-input100">Email</span>
                            </div>

                            <div className="wrap-input100 validate-input" data-validate="Password is required">
                                <input className="input100" type="password" name="password"/>
                                <span className="focus-input100"></span>
                                <span className="label-input100">Password</span>
                            </div>

                            <div className="flex-sb-m w-full p-t-3 p-b-32 justify-content-end">
                                    <a href="#" className="txt1">
                                        Forgot Password?
                                    </a>
                            </div>

                            <div className="container-login100-form-btn">
                                <button className="login100-form-btn" type="submit" disabled={isLoading}>
                                    Login
                                </button>
                            </div>

                            <div className="p-2 mt-3 text-center p-t-15">
                                <a href="#" className="txt1" onClick={() => navigate('/register')}>
                                    Create new Account
                                </a>
                            </div>

                            <div className="text-center p-t-26 p-b-20">
                                <span className="txt2">
                                    or sign up using
                                </span>
                            </div>

                            <div className="login100-form-social flex-c-m">
                                <GoogleLogin
                                    onSuccess={handleGoogleLoginSuccess}
                                    onError={handleGoogleLoginFailure}
                                    theme="filled_blue"
                                    size="large"
                                    shape="circle"
                                    text="signin_with"
                                    buttonText="Continue with Google"
                                    logo_alignment="left"
                                    width="300"
                                />
                            </div>
                        </form>

                        <div className="login100-more" style={{ backgroundImage: "url('books.jpg')" }}></div>
                    </div>
                </div>
            </div>
        </div>
    );
}