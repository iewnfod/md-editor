import MdView from "./components/MdView.tsx";
import {Box} from "@mui/joy";
import {ToastContainer} from "react-toastify";
import {useEffect, useState} from "react";

function App() {
    const [fp, setFp] = useState("");

    useEffect(() => {
        console.log(fp);
    }, [fp, setFp]);

    return (
        <Box>
            <MdView fp={fp} setFp={setFp}/>
            <ToastContainer/>
        </Box>
    );
}

export default App;
