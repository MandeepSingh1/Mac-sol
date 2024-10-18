import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import './header.css';
import { Button } from "primereact/button";
import { signOut } from "firebase/auth";
import { auth } from '../../Helper/Utils/utils';
import RoutingPaths from "Helper/routingPath";
import { toast, ToastContainer } from "react-toastify";


function HeaderComponent() {

    let authSession = localStorage.getItem('session');
    const navigate = useNavigate();

    const tapOnSignOutConfirm = () => {
        Swal.fire({
            title: 'Are you sure?',
            text: `You want to sign out.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes!'
        }).then((result) => {
            if (result.value) {
                signOutApi();
            }
        })
    };


    const signOutApi = () => {
        signOut(auth).then(() => {
            if (authSession) {
                localStorage.clear(); 
              }
            // Sign-out successful.
            navigate(RoutingPaths.login);
            
        }).catch((error) => {
            console.log(error);
            // An error happened.
            toast.error(error);
        });
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-white">
            <div className="container-fluid">

                <div style={{ display: "flex", alignItems: "center" }}>

                    {/* <img src={""} alt="Logo" width="40" height="40" className="vertical-align-middle" /> */}
                    <Link to="/" className="navbar-brand ms-5 fw-bold fs-4 align-content-center">Mac Solutions</Link>
                </div>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent" style={{ justifyContent: "end" }}>
                    <Button label="Sign Out" type="button" onClick={tapOnSignOutConfirm} className='save-button me-3' />
                    <ToastContainer/>
                </div>
            </div>
        </nav>
    );
}

export default HeaderComponent;