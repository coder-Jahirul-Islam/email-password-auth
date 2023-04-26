import { getAuth, sendPasswordResetEmail, signInWithEmailAndPassword } from 'firebase/auth';
import React, { useRef, useState } from 'react';
import app from '../../firebase/firebase.config';
import { Link } from 'react-router-dom';
const auth = getAuth(app);

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const emilRef = useRef();

    const handleSubmit = (event) => {
        event.preventDefault();
        const form = event.target;
        const email = form.email.value;
        const password = form.password.value;
        console.log(email, password);
        // validation 
        setError('');
        setSuccess('');

        if (!/(?=.*?[A-Z])/.test(password)) {
            setError('Please add at least one uppercase');
            return;

        } else if (!/(?=.*?[#?!@$%^&*-])/.test(password)) {
            setError('Please add at least one specials character')
            return;
        } else if (password.length < 6) {
            setError('password must be 6 character long')
            return;
        }


        signInWithEmailAndPassword(auth, email, password)
            .then(result => {
                const loggedUser = result.user;
                console.log(logged);
                if (!loggedUser.emailVerified) {
                    alert('Your emil is not verified')
                }
                setSuccess("User login successful");
                setError('');

            })
            .catch(error => {
                setError(error.message)
            })
    }

    // password reset 

    const handleResetPassword = () => {
        const email = (emilRef.current.value);
        if (!email) {
            toast("Please provide your email address to reset!")
            return;
        }
        sendPasswordResetEmail(auth, email)
            .then(() => {
                toast('Please check your email')
            })
            .catch(error => {
                console.log(error);
                setError(error.message);
            })

    }
    return (

        <div className="container">
            <ToastContainer />

            <div className="row">

                <div className="col-md-12">
                    <form onSubmit={handleSubmit} className="w-25 mx-auto">

                        <h2>Please login</h2>
                        <div className="form-group mb-3">
                            <label htmlFor="email ">Email address</label>
                            <input type="email" className="form-control" id="email" ref={emilRef} required placeholder="Enter email" />
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor="password">Password</label>
                            <input type="password" className="form-control" id="password" required placeholder="Password" />
                        </div>
                        <button type="submit" className="btn btn-primary">Submit</button>
                        <p><small>Forget Password?<button onClick={handleResetPassword} className='btn btn-link'>Reset Password</button></small></p>
                        <p className=''><small>New to this website? please <Link to='/register'>Register</Link></small></p>
                        <p className='text-danger mb-3'>{error}</p>
                        <p className='text-success'>{success}</p>
                    </form>

                </div>
            </div>

        </div>


    );
};

export default Login;