import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import React from "react";
import { useState } from "react";
import './login.css';
import {  useNavigate } from "react-router-dom";
import {  signInWithEmailAndPassword   } from 'firebase/auth';
import { auth } from '../../Helper/Utils/utils';
import RoutingPaths from "Helper/routingPath";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";



const LoginPage = () => {
const navigate = useNavigate();
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);


    const [loginData, setLoginData] = useState({
        email: "developer@vyzioninnovations.com",
        password: "Vyzion@2025!",
    })

    const [errors, setErrors] = useState({
        email: "",
        password: "",
    })

    const inputChange = (e) => {
        const { name, value } = e.target;

        setLoginData({
            ...loginData,
            [name]: value,
        });
    };

    const validateForm = (name = '', data) => {
        const errors = {};

        if (!data.email) {
            errors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(data.email)) {
            console.log("Email is invalid");
            errors.email = "Email is invalid";
        }
        if (!data.password) {
            errors.password = "Password is required";
        }

        return errors;
    };

    const tapOnLSignIn = () => {
        const newErrors = validateForm("", loginData);
        setErrors(newErrors);
        setIsSubmitted(true);
        if (Object.keys(newErrors).length === 0) {
            setLoading(true);
            loginApi();
        }
    };
   
 const loginApi = () => {
    signInWithEmailAndPassword(auth, loginData.email, loginData.password)
        .then((userCredential) => {
            setLoading(false);
            // Signed in
            const user = userCredential.user;
            // console.log(user);

            const loginData = JSON.stringify(user);
            localStorage.setItem('session', loginData);

            // to store multiple key on local storage 
            const loginToken = JSON.stringify(user["accessToken"]);
            localStorage.setItem('token', loginToken);
        
            navigate(RoutingPaths.home);
          
        })
        .catch((error) => {
            setLoading(false);
            // const errorCode = error.code;
            const errorMessage = error.message;
            toast.error(errorMessage);
            // console.log(errorCode, errorMessage)
        });
 }

    return (
        <div className="main-content-div">
        <div className="grid" style={{ maxWidth: "550px" }}>
            <div className="col">
                <div className="card" style={{ padding: "2rem" }}>
                    <h5 className='mb-4 text-center mt-4'>Welcome</h5>
                    <div className="p-fluid">
                        <div className="field col-12">
                            <label htmlFor="email">Email</label>
                            <InputText name="email" value={loginData.email} onChange={inputChange} id="email" type="text" placeholder='e.g. abc@mail.com' />
                            {isSubmitted && (<small id="email" className="p-error">{errors.email} </small>)}
                        </div>
                        <div className="field col-12">
                            <label htmlFor="password">Password</label>
                            <Password name="password" value={loginData.password} onChange={inputChange} id="confirmPassword" placeholder="Enter your password" toggleMask className="w-full"></Password>
                            {isSubmitted && (<small id="password" className="p-error">{errors.password} </small>)}
                        </div>
                        <Button label="Login" type='button' className="w-full mb-5 mt-3" loading={loading} onClick={tapOnLSignIn} />
                   <ToastContainer/>
                    </div>
                </div>
            </div>
        </div>
        </div>
    );
};

export default LoginPage;