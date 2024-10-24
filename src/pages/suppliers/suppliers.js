import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import Swal from 'sweetalert2';
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './suppliers.css';
import RoutingPaths from "Helper/routingPath";
import { collection, deleteDoc, doc, getDocs, where, query, and, or, Timestamp, orderBy, limitToLast, endBefore, startAfter, limit } from "firebase/firestore";
import { dbFirestore } from "Helper/Utils/utils";
import UtilsTableName from "Helper/Utils/UtilsDbTable";
import { toast } from "react-toastify";
import Moment from "react-moment";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { ButtonGroup } from "react-bootstrap";



const SuppliersList = () => {

    // variables start  
    const navigate = useNavigate();
    const [suppliersData, setSuppliersData] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [page, setPage] = useState(1);
    const perPage = 10;

    // variables end  

    // function start
    useEffect(() => {
        fetchSuppliersApi();

        const publishDate = new Date();
        console.log(Timestamp.fromDate(publishDate), Timestamp.fromDate(new Date()).toDate());
    }, [])

    async function fetchSuppliersApi() {

        let q = query(collection(dbFirestore, UtilsTableName.suppliers),
            orderBy('created_at', 'desc'),
            limit(perPage))
        const querySnapshot = await getDocs(q);
        querySnapshot.docs.forEach(element => {
            console.log()
        });
        setSuppliersData(querySnapshot.docs
            .map((docs) => ({ ...docs.data(), id: docs.id })))
        setLoading(false);
    };

    // pagination
    const showNext = ({ item }) => {
        if (suppliersData.length === 0) {
            alert("Thats all we have for now !")
        } else {
            const fetchNextData = async () => {
                let q = query(collection(dbFirestore, UtilsTableName.suppliers),
                    orderBy('created_at', 'desc'), startAfter(item.created_at),
                    limit(perPage)
                );
                const querySnapshot = await getDocs(q);

                setSuppliersData(querySnapshot.docs
                    .map((docs) => ({ ...docs.data(), id: docs.id })))
                setPage(page + 1);
            };
            fetchNextData();
        }
    };

    const showPrevious = ({ item }) => {
        const fetchPreviousData = async () => {
            let q = query(collection(dbFirestore, UtilsTableName.suppliers),
                orderBy('created_at', 'desc'),
                endBefore(item.created_at),
                limitToLast(perPage));
            const querySnapshot = await getDocs(q);
            setSuppliersData(querySnapshot.docs
                .map((docs) => ({ ...docs.data(), id: docs.id })))
            setPage(page - 1)

        };
        fetchPreviousData();
    };

    const searchSuppliersApi = async (e) => {
        const searchText = e.target.value;
        setGlobalFilterValue(searchText);
        if (searchText) {

            let q = query(collection(dbFirestore, UtilsTableName.suppliers), or(
                // query as-is:
                and(
                    where('name', '>=', searchText),
                    where('name', '<=', searchText + '\uf8ff')
                ), and(
                    where('name', '>=', searchText.charAt(0).toUpperCase() + searchText.slice(1)),
                    where('name', '<=', searchText.charAt(0).toUpperCase() + searchText.slice(1) + '\uf8ff')
                ),
                // lowercase:
                and(
                    where('name', '>=', searchText.toLowerCase()),
                    where('name', '<=', searchText.toLowerCase() + '\uf8ff')
                )
            ));
            const querySnapshot = await getDocs(q);

            // set data from docs
            setSuppliersData(querySnapshot.docs
                .map((docs) => ({ ...docs.data(), id: docs.id })));
        } else {
            fetchSuppliersApi();
        }
    };

    const tapOnAdd = () => {
        navigate(RoutingPaths.addSuppliers);
    }

    const tapOnDeleteconfirm = (suppliersData) => (event) => {
        Swal.fire({
            title: 'Are you sure?',
            text: `You want to delete this supplier "${suppliersData.name}"`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#6366F1',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes!',
            cancelButtonText: 'No'
        }).then((result) => {
            if (result.value) {
                deleteSuppliersApi(suppliersData);
                toast.success("Suppliers has been successfully deleted.");
            }
        })
    };

    const deleteSuppliersApi = async (suppliers) => {
        await deleteDoc(doc(dbFirestore, UtilsTableName.suppliers, suppliers.id));
        setSuppliersData(prevState => (
            prevState.filter(el => el.id !== suppliers.id)
        ));
    }

    const tapOnEdit = (suppliersData) => (event) => {
        navigate(RoutingPaths.editSuppliers, { state: suppliersData });
    };
    // function end

    //  UI start
    const searchBar = () => {
        return (
            <>
                <div className="flex justify-content-end" style={{ textAlign: 'end' }}>
                    <IconField iconPosition="left">
                        <InputIcon className="pi pi-search" />
                        <InputText value={globalFilterValue} onChange={searchSuppliersApi} placeholder="Search by name" />
                    </IconField>
                </div>
            </>
        );
    };

    const header = searchBar();

    if (isLoading) { return <div className="loading-div"> Loading ... </div> };

    return (
        <div className="grid text-start">
            <div className="col-12">
                <div className="card" style={{ padding: "2rem" }}>
                    <div className="main-content">
                        <h5 className="flex-grow-1">Suppliers List</h5>
                        <Button label="Add" type="button" onClick={tapOnAdd} className="add-button" />
                    </div>
                    {/* scrollable scrollHeight="400px" */}
                    <DataTable className="mt-5 mb-3" value={suppliersData}
                        header={header} emptyMessage="No data found.">
                        <Column field="name" header="Name" frozen className="font-bold"></Column>
                        <Column field="email" header="Email"></Column>
                        <Column field="phone" header="Phone Number"></Column>
                        <Column field="address" header="Address"></Column>
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
                    <ButtonGroup style={{ gap: "1rem", alignSelf: "center" }} className="mt-5">


                        {
                            //show previous button only when we have items
                            page === 1 ? '' :
                                <button onClick={() => showPrevious({ item: suppliersData[0] })} id="previous-button"><span className="pi pi-angle-left">Previous</span></button>
                        }


                        {
                            //show next button only when we have items
                            suppliersData.length < perPage ? '' :
                                <button onClick={() => showNext({ item: suppliersData[suppliersData.length - 1] })} id="previous-button">Next<span className="pi pi-angle-right"></span></button>
                        }

                    </ButtonGroup>
                </div>
            </div>
        </div>
    );
};
// UI end

export default SuppliersList;