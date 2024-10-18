import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import './inventories.css';
import { ref, query, limitToLast, onValue, equalTo, orderByChild} from "firebase/database";
import { Utilsdb } from "Helper/Utils/utilsDb";
import { Tag } from "primereact/tag";
import Moment from "react-moment";
import { InputText } from 'primereact/inputtext';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import RoutingPaths from "Helper/routingPath";
import UtilsTableName from "Helper/Utils/UtilsDbTable";




function InventoryList() {
    const navigate = useNavigate();
    const [inventories, setInventories] = useState([]);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [isLoading, setLoading] = useState(true);
    const perPage = 15;
    const tapOnAdd = () => {
        navigate(RoutingPaths.addInventories);
    }

    const statusBodyTemplate = (rowData) => {
        return <Tag value={rowData.status} severity={rowData.status} />;
    };

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
        // deleteDataFromApi();
    };

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        setGlobalFilterValue(value);
        if (value) {
            const recentPostsRef = query(ref(Utilsdb, UtilsTableName.inventories), orderByChild('item_code'), equalTo(value), limitToLast(perPage));

            onValue(recentPostsRef, (snapshot) => {
                setDataFromApi(snapshot);
            });
        } else {
            FetchInventories();
        }

    };

    const searchBar = () => {
        return (
            <div className="flex justify-content-end" style={{ textAlign: 'end' }}>
                <IconField iconPosition="left">
                    <InputIcon className="pi pi-search" />
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Keyword Search" />
                </IconField>
            </div>
        );
    };

    const header = searchBar();

    const tapOnEdit = (inventoryData) => (event) => {
        navigate(RoutingPaths.addInventories, { state: inventoryData });
    };

    const priceBodyTemplate = (inventory) => {
        return `Rs ${inventory.purchase_amount}`
    };
    

    useEffect(() => {
        FetchInventories();
    }, [])

    function setDataFromApi(snapshot) {
        const List = [];

        snapshot.forEach((childSnapshot) => {
            // console.log(childSnapshot.val());
            const childKey = childSnapshot.key;
            const childData = childSnapshot.val();
            childData["id"] = childKey;
            List.push(childData);
        });
        setInventories(List);
        setLoading(false);
    }

    function FetchInventories() {
        const recentPostsRef = query(ref(Utilsdb, UtilsTableName.inventories), limitToLast(perPage));

        onValue(recentPostsRef, (snapshot) => {
            setDataFromApi(snapshot);
        }, {
            onlyOnce: true
        });
    }

//     function deleteDataFromApi() {
//         const recentPostsRef = query(ref(Utilsdb, 'inventories'), equalTo('inventoryId'));;
//         remove(ref(recentPostsRef, 'inventories/inventoryId'))
//   .then(() => {
//     // Run code after successful deletion
//   })
//   .catch((error) => console.log(error));
//     }

    if (isLoading) { return <div className="loading-div"> Loading ... </div> };


    return (
        <div className="grid">
            <div className="col-12">
                <div className="card" style={{ padding: "2rem" }}>
                    <div className="main-content">
                        <h5 className="flex-grow-1 text-start">Inventories List</h5>
                        <Button label="Add" type="button" onClick={tapOnAdd} className="add-button" />
                    </div>
                    <>
                        <DataTable className="mt-5 mb-5" value={inventories} paginator rows={perPage}
                            filterDisplay="row"
                            globalFilterFields={['item_code', 'serial_number']} header={header} emptyMessage="No data found." >
                            <Column field="item_code" header="Item Code"></Column>
                            <Column field="serial_number" header="Serial Number"></Column>
                            {/* <Column field="company_name" header="Company Name"></Column> */}
                            {/* <Column field="brand" header="Brand"></Column> */}
                            <Column field="model_number" header="Model Number" alignFrozen="left" ></Column>
                            <Column field="configuration" header="Configuration"></Column>
                            <Column field="purchase_date" header="Purchase Date" body={(data, props) => <Moment format="DD-MMM-YYYY">{data.purchase_date}</Moment>}></Column>
                            <Column field="purchase_amount" header="Amount" body={priceBodyTemplate}></Column>
                            <Column field="status" header="Status" body={statusBodyTemplate}></Column>
                            <Column field="actions" header="Actions" body={(data, props) =>

                                <div className="flex mt-3 text-start">
                                    <Button type="button" className="edit-button me-2" onClick={tapOnEdit(data)}><span className="pi pi-pencil"></span>
                                    </Button>
                                    <Button severity="secondary" type="button" onClick={tapOnDeleteconfirm} className="delete-button">
                                        <span className="pi pi-trash"></span> </Button>
                                </div>
                            }> </Column>
                        </DataTable>
                    </>

                </div>
            </div>
        </div>
    );
};

export default InventoryList;