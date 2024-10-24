import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import './inventories.css';
import { Tag } from "primereact/tag";
import Moment from "react-moment";
import { InputText } from 'primereact/inputtext';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import RoutingPaths from "Helper/routingPath";
import UtilsTableName from "Helper/Utils/UtilsDbTable";
import { collection, deleteDoc, doc, getDocs, where, query, and, or, orderBy,limitToLast, endBefore, limit, startAfter } from "firebase/firestore";
import { dbFirestore } from "Helper/Utils/utils";
import { toast } from "react-toastify";
import { ButtonGroup } from "react-bootstrap";



function InventoryList() {

    // variables start  
    const navigate = useNavigate();
    const [inventories, setInventories] = useState([]);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [isLoading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const perPage = 5;
    const tabsData = [
        { id: 1, label: 'All' },
        { id: 2, label: 'Stock' },
        { id: 3, label: 'Sell' },
    ];

    const [activeTab, setActiveTab] = useState(tabsData[0].id);
    // variables end


    // function start

    useEffect(() => {
        fetchInventoriesApi();
    }, [])

    // fetch data with status
    async function fetchInventoriesApiWithStatus(id) {

        switch (id) {
            case 1:
                fetchInventoriesApi();
                break;

            default:
                let q = query(collection(dbFirestore, UtilsTableName.inventories),
                    where("status", "==", (id === 3) ? "sell" : "stock")
                );
                const querySnapshot = await getDocs(q);
                setInventories(querySnapshot.docs
                    .map((docs) => ({ ...docs.data(), id: docs.id })));
                break;
        }
    };

    // fetch data through api
    async function fetchInventoriesApi() {

        let q = query(collection(dbFirestore, UtilsTableName.inventories),
            orderBy('created_at', 'desc'),
            limit(perPage))
        const querySnapshot = await getDocs(q);
       
        setInventories(querySnapshot.docs
            .map((docs) => ({ ...docs.data(), id: docs.id })))
        setLoading(false);
    };


    // pagination
    const showNext = ({ item }) => {
        if (inventories.length === 0) {
            alert("Thats all we have for now!")
        } else {
            const fetchNextData = async () => {
                let q = query(collection(dbFirestore, UtilsTableName.inventories),
                    orderBy('created_at', 'desc'),
                    limit(perPage),

                    startAfter(item.created_at));
                const querySnapshot = await getDocs(q);
                setInventories(querySnapshot.docs
                    .map((docs) => ({ ...docs.data(), id: docs.id })))
                setPage(page + 1);
            };
            fetchNextData();
        }
    };

    const showPrevious = ({ item }) => {
        const fetchPreviousData = async () => {
            let q = query(collection(dbFirestore, UtilsTableName.inventories),
                orderBy('created_at', 'desc'),
                endBefore(item.created_at),
                limitToLast(perPage))
            const querySnapshot = await getDocs(q);
            setInventories(querySnapshot.docs
                .map((docs) => ({ ...docs.data(), id: docs.id })))
            setPage(page - 1)

        };
        fetchPreviousData();
    };

    // tabs are active
    const handleTabClick = async (id) => {
        setActiveTab(id);
        fetchInventoriesApiWithStatus(id);
    };



    const searchInventoriesApi = async (e) => {
        console.log(e)
        const searchText = e.target.value;
        setGlobalFilterValue(searchText);
        if (searchText) {
            // let q = query(collection(dbFirestore, UtilsTableName.inventories), where("inventory.item_code", "==", searchText),where("purchase_amount", "<=", 20000));

            let q = query(collection(dbFirestore, UtilsTableName.inventories), or(
                // query as-is:
                and(
                    where('item_code', '>=', searchText),
                    where('item_code', '<=', searchText + '\uf8ff')
                ), and(
                    where('item_code', '>=', searchText.charAt(0).toUpperCase() + searchText.slice(1)),
                    where('item_code', '<=', searchText.charAt(0).toUpperCase() + searchText.slice(1) + '\uf8ff')
                ),
                // lowercase:
                and(
                    where('item_code', '>=', searchText.toLowerCase()),
                    where('item_code', '<=', searchText.toLowerCase() + '\uf8ff')
                )
            ));
            const querySnapshot = await getDocs(q);

            // set data from docs
            setInventories(querySnapshot.docs
                .map((docs) => ({ ...docs.data(), id: docs.id })));
        } else {
            fetchInventoriesApi();
        }
    };

    const tapOnAdd = () => {
        navigate(RoutingPaths.addInventories);
    }

    const tapOnDeleteconfirm = (inventoryData) => (event) => {
        Swal.fire({
            title: 'Are you sure?',
            text: `You want to delete this id ${inventoryData.id}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#6366F1',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes!',
            cancelButtonText: 'No'
        }).then((result) => {
            if (result.value) {
                deleteInventoryApi(inventoryData);
                toast.success("Inventory has been successfully deleted.");
            }
        })
    };

    const deleteInventoryApi = async (inventory) => {
        await deleteDoc(doc(dbFirestore, UtilsTableName.inventories, inventory.id));
        setInventories(prevState => (
            prevState.filter(el => el.id !== inventory.id)
        ));
    }

    const tapOnEdit = (inventoryData) => (event) => {
        navigate(RoutingPaths.editInventories, { state: inventoryData });
    };
    // function end

    // UI start

    const searchBar = () => {
        return (
            <>
                <div className="flex justify-content-end" style={{ textAlign: 'end', display: 'flex' }}>
                    <div className="tabs">
                        {tabsData.map((tab) => (
                            <button
                                key={tab.id}
                                className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                                onClick={() => handleTabClick(tab.id)}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <IconField iconPosition="left">
                        <InputIcon className="pi pi-search" />
                        <InputText value={globalFilterValue} onChange={searchInventoriesApi} placeholder="Search by item code" />
                    </IconField>
                </div>
            </>
        );
    };

    const header = searchBar();

    if (isLoading) { return <div className="loading-div"> Loading ... </div> };

    return (
        <div className="grid">
            <div className="col-12">
                <div className="card" style={{ padding: "2rem" }}>
                    <div className="main-content">
                        <h5 className="flex-grow-1 text-start">Inventories List</h5>
                        <Button label="Add" type="button" onClick={tapOnAdd} className="add-button" />
                    </div>
                    {/* <div className="tabs mt-4">
                        {tabsData.map((tab) => (
                            <button
                                key={tab.id}
                                className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                                onClick={() => handleTabClick(tab.id)}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div> */}
                    <>

                        <DataTable className="mt-5" value={inventories}
                            header={header} emptyMessage="No data found." >
                            <Column field="item_code" header="Item Code"></Column>
                            <Column field="serial_number" header="Serial Number"></Column>
                            {/* <Column field="company_name" header="Company Name"></Column> */}
                            {/* <Column field="brand" header="Brand"></Column> */}
                            {/* <Column field="model_number" header="Model Number" alignFrozen="left" ></Column> */}
                            {/* <Column field="configuration" header="Configuration"></Column> */}
                            <Column field="purchase_date" header="Purchase Date" body={(data, props) => <Moment format="DD-MMM-YYYY">{data.purchase_date}</Moment>}></Column>
                            <Column field="purchase_amount" header="Amount" body={priceBodyTemplate}></Column>
                            <Column field="status" header="Status" body={statusBodyTemplate}></Column>
                            <Column field="created_at" header="Created at" body={(data, props) => <Moment format="DD-MMM-YYYY hh:mm:ss">{data.created_at}</Moment>}></Column>
                            <Column field="actions" header="Actions" body={(data, props) =>

                                <div className="flex mt-3 text-start">
                                    <Button type="button" className="edit-button me-2" onClick={tapOnEdit(data)}><span className="pi pi-pencil"></span>
                                    </Button>
                                    <Button severity="secondary" type="button" onClick={tapOnDeleteconfirm(data)} className="delete-button">
                                        <span className="pi pi-trash"></span> </Button>
                                </div>
                            }> </Column>
                        </DataTable>
                        <ButtonGroup style={{gap: "1rem", alignSelf: "center"}} className="mt-5">

                         
                            {
                                //show previous button only when we have items
                                page === 1 ? '' :
                                    <button onClick={() => showPrevious({ item: inventories[0] })} id="previous-button"><span className="pi pi-angle-left">Previous</span></button>
                            }


                            {
                                //show next button only when we have items
                                inventories.length < perPage ? '' :
                                    <button onClick={() => showNext({ item: inventories[inventories.length - 1] })} id="previous-button">Next<span className="pi pi-angle-right"></span></button>
                            }
                            
                        </ButtonGroup>
                    </>
                </div>
            </div>
        </div>
    );
};

const statusBodyTemplate = (inventory) => {
    return <Tag value={inventory.status} severity={getSeverity(inventory.status)} />;
};

const getSeverity = (status) => {
    switch (status) {
        case 'stock':
            return 'success';

        case 'sell':
            return 'warning';

        default:
            return null;
    }
};

const priceBodyTemplate = (inventory) => {
    return `Rs ${inventory.purchase_amount}`
};
// UI end

export default InventoryList;
