import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import React from "react";
import {useState } from "react";

const Profile = () => {
    const [loading, setLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const [profileData, setProfileData] = useState({
        name: "",
        email: "",
        phone: "",
        role: "",
    })

    const [errors, setErrors] = useState({
        name: "",
        email: "",
        phone: "",
        role: "",
    })

    const inputChange = (e) => {
        const { name, value } = e.target;

        setProfileData({
            ...profileData,
            [name]: value,
        });
    };

    const validateForm = (name = '', data) => {
        const errors = {};

        if (!data.name) {
            errors.name = "First name is required";
        } 
        if (!data.email.trim()) {
            errors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(data.email)) {
            errors.email = "Email is invalid";
        }
        if (!data.phone) {
            errors.phone = "Please enter your phone number.";
        } else if (!/^\d*$/.test(data.phone)) {
            errors.phone = "Phone number must be in numeric value.";
        }
        if (!data.role) {
            errors.role = "Role is required";
        } 
        return errors;
    };

    const tapOnLSave= () => {
        const newErrors = validateForm("", profileData);
        setErrors(newErrors);
        setIsSubmitted(true);
        if (Object.keys(newErrors).length === 0) {
            setLoading(true);
          }
    };

    return (
        <div className="grid text-start">
            <div className="col-12">
                <div className="card" style={{ padding: "2rem"}}>
                    <h5 className='mb-4'>Profile</h5>
                    <div className="p-fluid">
                        <div className="field col-12 col-md-6" style={{ paddingRight: "1rem" }}>
                            <label htmlFor="name">First Name</label>
                            <InputText name="name" value={profileData.name} onChange={inputChange}
                             id="name" type="text" placeholder="Enter your name"/>
                            {isSubmitted && (<small id="name" className="p-error">{errors.name} </small>)}
                        </div>
                        <div className="field col-12 col-md-6">
                            <label htmlFor="email">Email</label>
                            <InputText name="email" value={profileData.email} onChange={inputChange}
                             id="email" type="email" placeholder="Enter your email"/>
                            {isSubmitted && (<small id="email" className="p-error">{errors.email} </small>)}
                        </div>
                        <div className="field col-12 col-md-6">
                            <label htmlFor="phone">Phone Number</label>
                            <InputText name="phone" value={profileData.phone} onChange={inputChange}
                             id="phone" type="tel" placeholder="Enter your phone number" maxLength={10}/>
                            {isSubmitted && (<small id="phone" className="p-error">{errors.phone} </small>)}
                        </div>
                        <div className="field col-12 col-md-6">
                            <label htmlFor="role">Role</label>
                            <InputText name="role" value={profileData.role} onChange={inputChange}
                             id="role" type="text" placeholder="Enter your role"/>
                            {isSubmitted && (<small id="role" className="p-error">{errors.role} </small>)}
                        </div>
                    </div>

                    <div className="flex mt-3">
                        <Button label="Save Profile" loading={loading} onClick={tapOnLSave} className='save-button me-3'/>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;