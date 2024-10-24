import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { useEffect, useState } from "react";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import './addSuppliers.css';
import RoutingPaths from "Helper/routingPath";
import { addDoc, collection, doc, Timestamp, updateDoc } from "firebase/firestore";
import { dbFirestore } from "Helper/Utils/utils";
import UtilsTableName from "Helper/Utils/UtilsDbTable";
import { toast } from "react-toastify";
import { InputTextarea } from "primereact/inputtextarea";
import moment from 'moment';



const AddSuppliers = () => {

    // variables start  
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [loading1, setLoading1] = useState(false);
    const [loading2, setLoading2] = useState(false);
    const location = useLocation();
    const [suppliersHeading, setSuppliersHeading] = useState("Add Suppliers");
    const [suppliersID, setSuppliersID] = useState();
    const [buttonLabel, setButtonLabel] = useState("Save");
    const navigate = useNavigate();

    const [suppliersData, setSuppliersData] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
    })

    const [errors, setErrors] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
    })
    // variables end  

    const inputChange = (e) => {
        const { name, value } = e.target;

        setSuppliersData({
            ...suppliersData,
            [name]: value,
        });
    };

    const validateForm = (data) => {
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
        if (!data.address) {
            errors.address = "Please enter your address.";
        }

        return errors;
    };

    // function start
    useEffect(() => {
        //  edit functionality
        if (location.state) {
            setEditInventoryUI();
        }
    }, []);

    function setEditInventoryUI() {

        setSuppliersData((prevState) => ({
            ...prevState,
            name: location.state.name,
            email: location.state.email,
            phone: location.state.phone,
            address: location.state.address,
        }))
        setSuppliersHeading("Edit Suppliers");
        setButtonLabel("Update");
        setSuppliersID(location.state.id);
    };

    const tapOnSave = () => {
        const newErrors = validateForm(suppliersData);
        setErrors(newErrors);
        setIsSubmitted(true);
        if (Object.keys(newErrors).length === 0) {
            setLoading1(true);
            if (location.state) {
                updateSuppliersApi().then((response) => {
                    // Data saved successfully!
                    setLoading1(false);
                    navigate(RoutingPaths.suppliersList);
                    toast.success("Suppliers data has been updated successfully.");
                }).catch((error) => {
                    // The write failed...
                });
            } else {
                writeSuppliersApi().then((response) => {
                    // Data saved successfully!
                    setLoading1(false);
                    navigate(RoutingPaths.suppliersList);
                }).catch((error) => {
                    // The write failed...
                });
            }
        }
    };

    const tapOnSaveNext = () => {
        const newErrors = validateForm(suppliersData);
        setErrors(newErrors);
        setIsSubmitted(true);
        if (Object.keys(newErrors).length === 0) {
            setLoading2(true);
            writeSuppliersApi().then((response) => {
                // Data saved successfully!
                setLoading2(false);
                navigate(RoutingPaths.addSuppliers);
                window.location.reload();
            }).catch((error) => {
                // The write failed...
            });
        }
    };

    function payload() {
        const createdAt = Timestamp.fromDate(new Date()).toMillis();
        const object = { ...suppliersData, created_at:createdAt, updated_at:createdAt };
        return object;
    }

    async function writeSuppliersApi() {

        try {
            const response = await addDoc(collection(dbFirestore, UtilsTableName.suppliers), {
                ...payload(),
            });
            return response;
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    }

    async function updateSuppliersApi() {
        const updatedPayload = payload();
        updatedPayload.created_at = location.state.created_at;

        try {
            const response = await updateDoc(doc(dbFirestore, UtilsTableName.suppliers, suppliersID), {
                ...updatedPayload,
            });
            return response;
        } catch (e) {
            console.error("Error updating document: ", e);
        }
    };
    // function end

    // UI Start
    return (
        <div className="grid text-start">
            <div className="col-12">
                <div className="card" style={{ padding: "2rem" }}>
                    <h5 className='mb-4'>{suppliersHeading}</h5>
                    <div className="p-fluid">
                        <div className="field col-12 col-md-6" style={{ paddingRight: "1rem" }}>
                            <label htmlFor="name">Name</label>
                            <InputText name="name" value={suppliersData.name} onChange={inputChange}
                                id="name" type="text" placeholder="Enter your name" />
                            {isSubmitted && (<small id="name" className="p-error">{errors.name} </small>)}
                        </div>
                        <div className="field col-12 col-md-6">
                            <label htmlFor="email">Email</label>
                            <InputText name="email" value={suppliersData.email} onChange={inputChange}
                                id="email" type="email" placeholder="Enter your email" />
                            {isSubmitted && (<small id="email" className="p-error">{errors.email} </small>)}
                        </div>
                        <div className="field col-12 col-md-6">
                            <label htmlFor="phone">Phone Number</label>
                            <InputText name="phone" value={suppliersData.phone} onChange={inputChange}
                                id="phone" type="tel" placeholder="Enter your phone number" maxLength={10} />
                            {isSubmitted && (<small id="phone" className="p-error">{errors.phone} </small>)}
                        </div>
                        <div className="field col-12 col-md-6">
                            <label htmlFor="address">Address</label>
                            <InputTextarea name="address" value={suppliersData.address} onChange={inputChange} id="address"
                                placeholder="Enter your address" rows={1} cols={30} />
                            {isSubmitted && (<small id="address" className="p-error">{errors.address} </small>)}
                        </div>
                    </div>

                    <div className="flex mt-3">
                        <Button label={buttonLabel} type="button" loading={loading1} onClick={tapOnSave} className='save-button me-3' />
                        {!location.state && <Button label="Save + Next" type='button' severity="secondary" loading={loading2} onClick={tapOnSaveNext} className='save-next-button me-3' />}
                        <Button label="Back" severity="secondary" onClick={() => navigate(-1)} className="back-button" />
                    </div>
                </div>
            </div>
        </div>
    );
};
// UI End

export default AddSuppliers;