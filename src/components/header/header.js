import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import './header.css';
import { Button } from "primereact/button";
import { signOut } from "firebase/auth";
import { auth } from '../../Helper/Utils/utils';
import RoutingPaths from "Helper/routingPath";
import { toast, ToastContainer } from "react-toastify";
import CompanyLogo from 'assets/vi.png'


function HeaderComponent() {

    let authSession = localStorage.getItem('session');
    const navigate = useNavigate();

    const tapOnSignOutConfirm = () => {
        Swal.fire({
            title: 'Are you sure?',
            text: `You want to sign out.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#6366F1',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes!',
            cancelButtonText: 'No',

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

                    <img src={CompanyLogo} alt="Logo" width="120" height="80" className="vertical-align-middle ms-3 me-1" />
                    {/* <Link to="/" className="navbar-brand fw-bold fs-4 align-content-center">Vyzion Innovations</Link> */}
                </div>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent" style={{ justifyContent: "end" }}>
                    <Button label="Sign Out" type="button" onClick={tapOnSignOutConfirm} className='save-button me-3' />
                    <ToastContainer />
                </div>
            </div>
        </nav>
    );
}

export default HeaderComponent;