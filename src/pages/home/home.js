import { collection, getCountFromServer, query, where } from "firebase/firestore";
import RoutingPaths from "Helper/routingPath";
import { dbFirestore } from "Helper/Utils/utils";
import UtilsTableName from "Helper/Utils/UtilsDbTable";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import './home.css';

function Home() {

    const [stocksCount, setStocksCount] = useState(null);
    const [supplierCount, setSupplierCount] = useState(null);


    useEffect(() => {
        inventoryStocksCount();
        suppliersCount();
    }, [])

    async function inventoryStocksCount() {
        const q = query(collection(dbFirestore, UtilsTableName.inventories), where("status", "==", "stock"));
        const snapshot = await getCountFromServer(q);

        setStocksCount(snapshot.data().count);
    }

    async function suppliersCount() {
        const coll = collection(dbFirestore, UtilsTableName.suppliers);
        const snapshot = await getCountFromServer(coll);
        
        setSupplierCount(snapshot.data().count);
    }

    return (
        <>
            <div className="grid text-start ms-5 mt-1">
                <div className="d-flex" style={{gap: "4rem"}}>
                <div className="col-3">
                    <div className="card p-4">
                        <h5 style={{alignSelf: "center"}}>Stock Count</h5>
                        <p style={{alignSelf: "center", fontSize: "2.5rem", fontWeight: "600", color: "#6366F1"}}>{stocksCount}</p>
                    </div>
                </div>

                <div className="col-3">
                    <div className="card p-4">
                    <h5 style={{alignSelf: "center"}}>Suppliers Count</h5>
                        <p  style={{alignSelf: "center", fontSize: "2.5rem", fontWeight: "600", color: "#6366F1"}}>{supplierCount}</p>
                    </div>
                </div>

                <div className="col-3">
                    <div className="card p-4">
                        <h5 className="mb-3" style={{alignSelf: "center"}}>Quick Actions</h5>
                      
                        <ul className="ul-lists">
                            <li>
                            <Link to={RoutingPaths.addInventories} className="dashboard-link">Add Inventory</Link>
                            </li>
                            <hr className="solid mb-3"></hr>
                            <li>
                            <Link to={RoutingPaths.addSuppliers} className="dashboard-link">Add Suppliers</Link>
                            </li>
                            <hr className="solid"></hr>
                        </ul>
                
                    </div>
                </div>

                </div>
            </div>
        </>
    );
}

export default Home;