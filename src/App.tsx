import MdView from "./components/MdView.tsx";
import {Box} from "@mui/joy";
import {ToastContainer} from "react-toastify";
import {useState} from "react";
import {listen} from "@tauri-apps/api/event";

function App() {
    const [fp, setFp] = useState("");
    const [saved, setSaved] = useState(false);

    listen('open-file', (event) => {
        if (event.payload) {
            const path = event.payload as string;
            setFp(path);
            setSaved(true);
            console.log("Open file:", path);
        }
    }).then();

    return (
        <Box>
            <MdView fp={fp} setFp={setFp} saved={saved} setSaved={setSaved}/>
            <ToastContainer/>
        </Box>
    );
}

export default App;
