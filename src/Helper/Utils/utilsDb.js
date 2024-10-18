import { getDatabase } from "firebase/database";
import firebaseApp from "./utils";

export const Utilsdb = getDatabase(firebaseApp);