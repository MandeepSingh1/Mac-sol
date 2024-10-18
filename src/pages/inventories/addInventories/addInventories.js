import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './addInventories.css';
import { Utilsdb } from 'Helper/Utils/utilsDb';
import { ref } from "firebase/database";
import { child, push, update } from "firebase/database";
import moment from 'moment';
import RoutingPaths from 'Helper/routingPath';
import UtilsTableName from 'Helper/Utils/UtilsDbTable';




const AddInventory = () => {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [loading1, setLoading1] = useState(false);
    const [loading2, setLoading2] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const [inventoryHeading, setInventoryHeading] = useState("Add Inventory");
    const [buttonLabel, setButtonLabel] = useState("Save");
    const [date, setDate] = useState(new Date());



    const [addInventoryData, setAddInventoryData] = useState({
        item_code: "",
        company_name: "",
        brand: "",
        model_number: "",
        configuration: "",
        serial_number: "",
        purchase_date: "",
        purchase_amount: "",
        status: "",
        buyer_name: "",
        buyer_phone_number: "",
        buyer_address: "",
        seller_name: "",
        seller_phone_number: "",
        seller_address: "",
    })

    const [errors, setErrors] = useState({
        item_code: "",
        company_name: "",
        brand: "",
        model_number: "",
        configuration: "",
        serial_number: "",
        purchase_date: "",
        purchase_amount: "",
        status: "",
        buyer_name: "",
        buyer_phone_number: "",
        buyer_address: "",
        seller_name: "",
        seller_phone_number: "",
        seller_address: "",
    })

    const dropdownValues = [
        "stock", "sell"
    ];

    const toInputUppercase = (e) => {
        e.target.value = ("" + e.target.value).toUpperCase();
    };

    const inputChange = (e) => {
        var { name, value } = e.target;

        if (name === "purchase_date") {
            value = moment(value).format('YYYY-MM-DD');
        }

        setAddInventoryData({
            ...addInventoryData,
            [name]: value,
        });
    };

    const inputDropdownChange = (e) => {
        const { name, value } = e.target;

        setAddInventoryData({
            ...addInventoryData,
            [name]: value,
        });
    };

    const validateForm = (data) => {
        var errors = {};

        if (!data.item_code) {
            errors.item_code = "Item code is required";
        }
        if (!data.company_name) {
            errors.company_name = "Company name is required";
        }
        if (!data.brand) {
            errors.brand = "Please enter a particular brand";
        }
        if (!data.model_number) {
            errors.model_number = "Please enter a model number";
        }
        if (!data.configuration) {
            errors.configuration = "Please enter configuration";
        }
        if (!data.serial_number) {
            errors.serial_number = "Please enter serial number";
        }
        if (!data.purchase_date) {
            errors.purchase_date = "Please choose purchase date";
        }
        if (!data.purchase_amount) {
            errors.purchase_amount = "Please enter purchase amount";
        }
        if (!data.status) {
            errors.status = "Please choose status";
        }

        if (data.status === 'sell') {
            if (!data.buyer_name) {
                errors.buyer_name = "Buyer name is required";
            }

            if (!data.buyer_phone_number) {
                errors.buyer_phone_number = "Please enter buyer phone number.";
            } else if (!/^\d*$/.test(data.buyer_phone_number)) {
                errors.buyer_phone_number = "Phone number must be in numeric value.";
            }
            if (!data.buyer_address) {
                errors.buyer_address = "Enter buyer addresss";
            }
        } else {
            if (!data.seller_name) {
                errors.seller_name = "Seller name is required";
            }

            if (!data.seller_phone_number) {
                errors.seller_phone_number = "Please enter seller phone number.";
            } else if (!/^\d*$/.test(data.seller_phone_number)) {
                errors.seller_phone_number = "Phone number must be in numeric value.";
            }
            if (!data.seller_address) {
                errors.seller_address = "Enter seller addresss";
            }
        }
        return errors;
    };

    useEffect(() => {
        //  edit functionality
        if (location.state) {
            setEditInventoryUI();
        }
    }, []);

    function setEditInventoryUI() {

        const mydate = moment(location?.state?.purchase_date, 'YYYY-MM-DD').toDate();
        setDate(mydate);

        setAddInventoryData((prevState) => ({
            ...prevState,
            item_code: location.state.item_code,
            company_name: location.state.company_name,
            brand: location.state.brand,
            model_number: location.state.model_number,
            configuration: location.state.configuration,
            serial_number: location.state.serial_number,
            purchase_date: location.state.purchase_date,
            purchase_amount: location.state.purchase_amount,
            status: location.state.status,
            buyer_name: location.state.buyer_name,
            buyer_phone_number: location.state.buyer_phone_number,
            buyer_address: location.state.buyer_address,
            seller_name: location.state.seller_name,
            seller_phone_number: location.state.seller_phone_number,
            seller_address: location.state.seller_address,

        }))
        setInventoryHeading("Edit Inventory");
        setButtonLabel("Update");
    }

    const tapOnSave = (e) => {

        const newErrors = validateForm(addInventoryData);
        setErrors(newErrors);
        setIsSubmitted(true);
        if (Object.keys(newErrors).length === 0) {
            setLoading1(true);
            writeInventoriesApi().then((response) => {
                // Data saved successfully!
                setLoading1(false);
                navigate(RoutingPaths.inventoryList);
            }).catch((error) => {
                // The write failed...
            });
        }
    };

    const tapOnSaveNext = () => {
        
        const newErrors = validateForm(addInventoryData);
        setErrors(newErrors);
        setIsSubmitted(true);
        if (Object.keys(newErrors).length === 0) {
            setLoading2(true);
            writeInventoriesApi().then((response) => {
                // Data saved successfully!
                setLoading2(false);
                navigate(RoutingPaths.addInventories);
                window.location.reload();
            }).catch((error) => {
                // The write failed...
            });
        }

    };

    // for backend Api
    function writeInventoriesApi() {
        // const recentPostsRef = query(ref(Utilsdb, 'inventories'), equalTo(id));

        const inventoryId = push(child(ref(Utilsdb), UtilsTableName.inventories)).key;

        // Write the new post's data simultaneously in the posts list and the user's post list.
        const updates = {};
        updates[UtilsTableName.inventories + inventoryId] = addInventoryData;

        return update(ref(Utilsdb), updates);
    }


    return (
        <div className="grid text-start">

            <div className="col-12">
                <div className="card" style={{ padding: "2rem" }}>
                    <h5 className='mb-4'>{inventoryHeading}</h5>
                    <div className="p-fluid">
                        <div className="field col-12 col-md-6" style={{ paddingRight: "1rem" }}>
                            <label htmlFor="item_code">Item Code</label>
                            <InputText name="item_code" value={addInventoryData.item_code} onChange={inputChange} id="item_code" type="text" placeholder='Enter Item Code'
                                onInput={toInputUppercase} />
                            {isSubmitted && (<small id="item_code" className="p-error">{errors.item_code} </small>)}
                        </div>
                        <div className="field col-12 col-md-6" style={{ paddingRight: "1rem" }}>
                            <label htmlFor="company_name">Company name</label>
                            <InputText name="company_name" value={addInventoryData.company_name} onChange={inputChange} id="company_name" type="text" placeholder='Enter Company Name'
                                onInput={toInputUppercase} />
                            {isSubmitted && (<small id="company_name" className="p-error">{errors.company_name} </small>)}
                        </div>
                        <div className="field col-12 col-md-6">
                            <label htmlFor="brand">Brand</label>
                            <InputText name="brand" value={addInventoryData.brand} onChange={inputChange} id="brand" type="text" placeholder='e.g. google' />
                            {isSubmitted && (<small id="brand" className="p-error">{errors.brand} </small>)}
                        </div>
                        <div className="field col-12 col-md-6">
                            <label htmlFor="model-number">Model number</label>
                            <InputText name="model_number" value={addInventoryData.model_number} onChange={inputChange} id="model_number" type="text" placeholder='e.g. xxxx' />
                            {isSubmitted && (<small id="model_number" className="p-error">{errors.model_number} </small>)}
                        </div>
                        <div className="field col-12 col-md-6">
                            <label htmlFor="configuration">Configuration</label>
                            <InputText name="configuration" value={addInventoryData.configuration} onChange={inputChange} id="configuration" type="text" placeholder='Enter configuration' />
                            {isSubmitted && (<small id="configuration" className="p-error">{errors.configuration} </small>)}
                        </div>
                        <div className="field col-12 col-md-6">
                            <label htmlFor="serial_number">Serial number</label>
                            <InputText name="serial_number" value={addInventoryData.serial_number} onChange={inputChange} id="serial_number"
                                type="text" placeholder='e.g. xxxx'
                                onInput={toInputUppercase} />
                            {isSubmitted && (<small id="serial_number" className="p-error">{errors.serial_number} </small>)}
                        </div>
                        <div className="field col-12 col-md-6">
                            <label htmlFor="purchase_date">Purchase date</label>
                            <Calendar name="purchase_date" value={date} onChange={inputChange}
                                showIcon
                                showButtonBar
                                placeholder='dd/mm/yyyy' dateFormat="dd/mm/yy"

                            />
                            {isSubmitted && (<small id="purchase_date" className="p-error">{errors.purchase_date} </small>)}
                        </div>
                        <div className="field col-12 col-md-6">
                            <label htmlFor="purchase_amount">Purchase amount</label>
                            <InputText name='purchase_amount' value={addInventoryData.purchase_amount}
                                onChange={inputChange} placeholder='Enter purchase amount' />

                            {/* <InputText name="purchase_amount" value={addInventoryData.purchase_amount} onChange={inputChange} placeholder='Enter purchase amount' /> */}
                            {isSubmitted && (<small id="purchase_amount" className="p-error">{errors.purchase_amount} </small>)}
                        </div>
                        <div className="field col-12 col-md-6">
                            <label htmlFor="status">Status</label>
                            <Dropdown name="status"
                                value={addInventoryData.status}
                                onChange={inputDropdownChange}
                                options={dropdownValues}
                                optionLabel="name"
                                placeholder="Select status" />
                            {isSubmitted && (<small id="status" className="p-error">{errors.status} </small>)}
                        </div>
                    </div>

                    {addInventoryData.status === "stock" &&
                        <div >
                            <h5 className='mb-4 mt-4'>Seller</h5>
                            <div className="p-fluid" >
                                <div className="field col-12 col-md-6">
                                    <label htmlFor="seller_name">Name</label>
                                    <InputText name="seller_name" value={addInventoryData.seller_name} onChange={inputChange} id="name" type="text" placeholder='e.g. john' />
                                    {isSubmitted && (<small id="seller_name" className="p-error">{errors.seller_name} </small>)}
                                </div>
                                <div className="field col-12 col-md-6">
                                    <label htmlFor="seller_phone_number">Phone number</label>
                                    <InputText name="seller_phone_number" value={addInventoryData.seller_phone_number} onChange={inputChange}
                                        id="seller_phone_number" type="tel" placeholder='e.g. xxx-xxx-xxxx' maxLength={10}
                                    />
                                    {isSubmitted && (<small id="seller_phone_number" className="p-error">{errors.seller_phone_number} </small>)}
                                </div>
                                <div className="field col-12 col-md-6">
                                    <label htmlFor="seller_address">Address</label>
                                    <InputTextarea name="seller_address" value={addInventoryData.seller_address} onChange={inputChange}
                                        id="textarea"
                                        rows={3}
                                        cols={30}
                                        placeholder='Enter Address'
                                    />
                                    {isSubmitted && (<small id="seller_address" className="p-error">{errors.seller_address} </small>)}
                                </div>
                            </div>
                        </div>
                    }
                    {addInventoryData.status === "sell" &&
                        <div >
                            <h5 className='mb-4 mt-4'>Buyer</h5>
                            <div className="p-fluid" >
                                <div className="field col-12 col-md-6">
                                    <label htmlFor="buyer_name">Name</label>
                                    <InputText name="buyer_name" value={addInventoryData.buyer_name} onChange={inputChange} id="name" type="text" placeholder='e.g. john' />
                                    {isSubmitted && (<small id="buyer_name" className="p-error">{errors.buyer_name} </small>)}
                                </div>
                                <div className="field col-12 col-md-6">
                                    <label htmlFor="buyer_phone_number">Phone number</label>
                                    <InputText name="buyer_phone_number" value={addInventoryData.buyer_phone_number} onChange={inputChange}
                                        id="buyer_phone_number" type="tel" placeholder='e.g. xxx-xxx-xxxx' maxLength={10}
                                    />
                                    {isSubmitted && (<small id="buyer_phone_number" className="p-error">{errors.buyer_phone_number} </small>)}
                                </div>
                                <div className="field col-12 col-md-6">
                                    <label htmlFor="buyer_address">Address</label>
                                    <InputTextarea name="buyer_address" value={addInventoryData.buyer_address} onChange={inputChange}
                                        id="textarea"
                                        rows={3}
                                        cols={30}
                                        placeholder='Enter Address'
                                    />
                                    {isSubmitted && (<small id="buyer_address" className="p-error">{errors.buyer_address} </small>)}
                                </div>
                            </div>
                        </div>
                    }

                    <div className="flex mt-3">
                        <Button label={buttonLabel} type='button' loading={loading1} onClick={tapOnSave} className='save-button me-3' />
                        <Button label="Save + Next" type='button' severity="secondary" loading={loading2} onClick={tapOnSaveNext} className='save-next-button me-3' />
                        <Button label="Back" severity="secondary" onClick={() => navigate(-1)} className='back-button' />
                    </div>
                </div>
            </div>


        </div>
    );
};

export default AddInventory;
