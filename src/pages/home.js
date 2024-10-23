import { collection, getCountFromServer, query, where } from "firebase/firestore";
import { dbFirestore } from "Helper/Utils/utils";
import UtilsTableName from "Helper/Utils/UtilsDbTable";
import React, { useEffect, useState } from "react";


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
                        <h4 style={{alignSelf: "center"}}>Stock Count</h4>
                        <p style={{alignSelf: "center", fontSize: "3rem", fontWeight: "600", color: "#6366F1"}}>{stocksCount}</p>
                    </div>
                </div>

                <div className="col-3">
                    <div className="card p-4">
                    <h4 style={{alignSelf: "center"}}>Suppliers Count</h4>
                        <p  style={{alignSelf: "center", fontSize: "3rem", fontWeight: "600", color: "#6366F1"}}>{supplierCount}</p>
                    </div>
                </div>
                </div>
            </div>
        </>
    );
}

export default Home;
