import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import Swal from 'sweetalert2';
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './users.css';
import { ref, query, limitToLast, onValue } from "firebase/database";
import { Utilsdb } from "Helper/Utils/utilsDb";
import RoutingPaths from "Helper/routingPath";


const UsersList = () => {
    const navigate = useNavigate();
    const [usersData, setUsersData] = useState([]);


    const tapOnAdd = () => {
        navigate(RoutingPaths.addUsers);
    }

    const tapOnDeleteconfirm = () => {
        Swal.fire({
            title: 'Are you sure?',
            text: `You want to delete it.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes!'
        })
    };

    useEffect(() => {
        FetchUsers();
    }, [])

    function FetchUsers() {
        const recentPostsRef = query(ref(Utilsdb, 'users'), limitToLast(100));

        const List = [];
        onValue(recentPostsRef, (snapshot) => {
            snapshot.forEach((childSnapshot) => {
                const childKey = childSnapshot.key;
                const childData = childSnapshot.val();
                List.push(childData);
                // ...
            });
            setUsersData(List);
            console.log(List)
        }, {
            onlyOnce: true
        });
    }

    return (
        <div className="grid text-start">
            <div className="col-12">
                <div className="card" style={{ padding: "2rem" }}>
                    <div className="main-content">
                        <h5 className="flex-grow-1">Users List</h5>
                        <Button label="Add" type="button" onClick={tapOnAdd} className="add-button" />
                    </div>
                    <DataTable scrollable scrollHeight="400px" className="mt-5 mb-5" value={usersData} paginator rows={5}>
                        <Column field="name" header="Name" frozen className="font-bold"></Column>
                        {/* <Column field="lastname" header="Last Name" alignFrozen="left" ></Column> */}
                        <Column field="email" header="Email"></Column>
                        <Column field="phone" header="Phone Number"></Column>
                        <Column field="role" header="Role"></Column>
                        <Column field="actions" header="Actions" body={

                            <div className="flex mt-3 text-start">
                                <Button type="button" className="edit-button me-2"><span className="pi pi-pencil"></span>
                                </Button>
                                <Button severity="secondary" type="button" onClick={tapOnDeleteconfirm} className="delete-button">
                                    <span className="pi pi-trash"></span> </Button>
                            </div>
                        }> </Column>
                    </DataTable>
                </div>
            </div>
        </div>
    );
};

export default UsersList;