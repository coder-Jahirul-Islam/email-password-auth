import React, { useState } from 'react';
import { createUserWithEmailAndPassword, getAuth, sendEmailVerification, updateProfile } from 'firebase/auth'
import app from '../../firebase/firebase.config';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const auth = getAuth(app);

const Register = () => {

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('')

    const handleSubmit = (event) => {
        // 1. prevent page refresh 
        event.preventDefault();
        setSuccess('')
        setError('')

        // 2. collect form data
        const email = event.target.email.value;
        const password = event.target.password.value;
        const name = event.target.name.value;
        console.log(name, email, password);

        // validate
        if (!/(?=.*[A-Z])/.test(password)) {
            console.log();
            setError("Please add at least one Uppercase");
            return;
        } else if (!/[0-9]{2}/.test(password)) {
            setError('Please add at least Two numbers')
            return;
        } else if (password.length < 6) {
            setError('Please add at least 6 characters in your password!')
            return;
        }
        // create user in fb
        createUserWithEmailAndPassword(auth, email, password)
            .then(result => {
                const loggedUser = result.user
                console.log(loggedUser);
                setError('');
                event.target.reset();
                setSuccess("User has been created successfully");
                sendVerificationEmail(result.user);
                updateUserData(result.user, name);
            })
            .catch(error => {
                console.error(error.message);
                setError(error.message);
            })
    }

    const sendVerificationEmail = (user) => {
        sendEmailVerification(user)
            .then(result => {
                console.log(result);
                alert('Verity your mail! ')
                toast.success('Message sent successfully Please verify your mail!');
            })
    }

    const updateUserData = (user, name) => {
        updateProfile(user, {
            displayName:name
        })
        .then(()=>{
            console.log("User name updated");
        })
        .catch(error=>{
            setError(error.message)
            return;
        })

    }

    const handleEmailChange = (e) => {
        console.log(e.target.value);
        // setEmail(e.target.value)
    }
    const handlePasswordBlur = (event) => {
        // console.log(event.target.value);

    }

    return (
        <div className='w-50 mx-auto'>
            <h4>Please Register</h4>
            <form onSubmit={handleSubmit}>
                <input className='w-50 mb-4 p-1 ps-2 rounded' type="text" name="name" id="name" required placeholder='Your Name' /><br />
                <input className='w-50 mb-4 p-1 ps-2 rounded' onChange={handleEmailChange} type="email" name="email" id="email" required placeholder='Your Email' /><br />
                <input className='w-50 mb-4 p-1 ps-2 rounded' onBlur={handlePasswordBlur} type="password" name="password" id="password" required placeholder='Your Password' />
                <br />
                <input className='btn btn-primary' type="submit" value="Register" />
                <p><small>Already have an account? please <Link to='/login'>Login</Link></small></p>
            </form>
            <p className="text-danger">{error}</p>
            <p className='text-success'>{success}</p>
            <ToastContainer />
        </div>
    );
};

export default Register;
