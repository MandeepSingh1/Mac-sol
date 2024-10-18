import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { useState } from "react";
import { Password } from "primereact/password";
import React from "react";
import { useNavigate } from "react-router-dom";
import './addUsers.css';
import { Utilsdb } from 'Helper/Utils/utilsDb';
import { ref} from "firebase/database";
import { child, push, update } from "firebase/database";
import RoutingPaths from "Helper/routingPath";


const AddUsers = () => {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [loading1, setLoading1] = useState(false);
    const [loading2, setLoading2] = useState(false);

    const navigate = useNavigate();

    const [usersData, setUsersData] = useState({
        name: "",
        email: "",
        phone: "",
        role: "",
        password: "",
        confirmPassword: "",
    })

    const [errors, setErrors] = useState({
        name: "",
        email: "",
        phone: "",
        role: "",
        password: "",
        confirmPassword: "",
    })

    const inputChange = (e) => {
        const { name, value } = e.target;

        setUsersData({
            ...usersData,
            [name]: value,
        });
    };

    const validateForm = (name = '', data) => {
        const errors = {};

        if (!data.name) {
            errors.name = "Please enter your name";
        }
        if (!data.email.trim()) {
            errors.email = "Please enter an email address.";
        } else if (!/\S+@\S+\.\S+/.test(data.email)) {
            errors.email = "Please enter valid email, e.g. abc@mail.com.";
        }
        if (!data.phone) {
            errors.phone = "Please enter your phone number.";
        } else if (!/^\d*$/.test(data.phone)) {
            errors.phone = "Phone number must be in numeric value.";
        }
        if (!data.role) {
            errors.role = "Role is required";
        }
        if (!data.password) {
            errors.password = "Password is required";
        }
        if (!data.confirmPassword) {
            errors.confirmPassword = "Re-enter your new password";
        } else if (data.confirmPassword !== data.password) {
            errors.confirmPassword = "Passowrd does not match";
        }
        return errors;
    };

    const tapOnSave = () => {
        const newErrors = validateForm("", usersData);
        setErrors(newErrors);
        setIsSubmitted(true);
        if (Object.keys(newErrors).length === 0) {
            setLoading1(true);
            writeUserApi().then((response) => {
                // Data saved successfully!
                setLoading1(false);
                navigate(RoutingPaths.usersList);
            }).catch((error) => {
                    // The write failed...
            });
        }
    };

    const tapOnSaveNext = () => {
        const newErrors = validateForm("", usersData);
        setErrors(newErrors);
        setIsSubmitted(true);
        if (Object.keys(newErrors).length === 0) {
            setLoading2(true);
            writeUserApi().then((response) => {
                // Data saved successfully!
                setLoading1(false);
                navigate(RoutingPaths.addUsers);
            }).catch((error) => {
                    // The write failed...
            });
        }
    };

     // for backend Api
     function writeUserApi() {
        const usersId = push(child(ref(Utilsdb), 'users')).key;
        // Write the new post's data simultaneously in the posts list and the user's post list.
        const updates = {};
        updates['/users/' + usersId] = usersData;

        return update(ref(Utilsdb), updates);
    }

    return (
        <div className="grid text-start">
            <div className="col-12">
                <div className="card" style={{ padding: "2rem" }}>
                    <h5 className='mb-4'>Add Users</h5>
                    <div className="p-fluid">
                        <div className="field col-12 col-md-6" style={{ paddingRight: "1rem" }}>
                            <label htmlFor="name">First Name</label>
                            <InputText name="name" value={usersData.name} onChange={inputChange}
                                id="name" type="text" placeholder="Enter your name" />
                            {isSubmitted && (<small id="name" className="p-error">{errors.name} </small>)}
                        </div>
                        <div className="field col-12 col-md-6">
                            <label htmlFor="email">Email</label>
                            <InputText name="email" value={usersData.email} onChange={inputChange}
                                id="email" type="email" placeholder="Enter your email" />
                            {isSubmitted && (<small id="email" className="p-error">{errors.email} </small>)}
                        </div>
                        <div className="field col-12 col-md-6">
                            <label htmlFor="phone">Phone Number</label>
                            <InputText name="phone" value={usersData.phone} onChange={inputChange}
                                id="phone" type="tel" placeholder="Enter your phone number" maxLength={10} />
                            {isSubmitted && (<small id="phone" className="p-error">{errors.phone} </small>)}
                        </div>
                        <div className="field col-12 col-md-6">
                            <label htmlFor="role">Role</label>
                            <InputText name="role" value={usersData.role} onChange={inputChange}
                                id="role" type="text" placeholder="Enter your role" />
                            {isSubmitted && (<small id="role" className="p-error">{errors.role} </small>)}
                        </div>
                        <div className="field col-12 col-md-6">
                            <label htmlFor="password">Password</label>
                            <Password name="password" value={usersData.password} onChange={inputChange} id="password"
                                placeholder="Enter your password" toggleMask className="w-full"></Password>
                            {isSubmitted && (<small id="password" className="p-error">{errors.password} </small>)}
                        </div>
                        <div className="field col-12 col-md-6">
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <Password name="confirmPassword" value={usersData.confirmPassword} onChange={inputChange} id="confirmPassword"
                                placeholder="Re-enter your password" toggleMask className="w-full"></Password>
                            {isSubmitted && (<small id="confirmPassword" className="p-error">{errors.confirmPassword} </small>)}
                        </div>
                    </div>

                    <div className="flex mt-3">
                        <Button label="Save" type="button" loading={loading1} onClick={tapOnSave} className='save-button me-3' />
                        <Button label="Save + Next" type='button' severity="secondary" loading={loading2} onClick={tapOnSaveNext} className='save-next-button me-3' />
                        <Button label="Back" severity="secondary" onClick={() => navigate(-1)} className="back-button" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddUsers;