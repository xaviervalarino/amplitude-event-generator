import { init } from "@amplitude/analytics-browser";

import Table from "./components/Table";
import "./App.css";

// amplitude init
init(import.meta.env.VITE_AMPLITUDE_USER_ID);

function App() {
    return (
        <div className="App">
            <h1>Amplitude event generator</h1>
            <Table />
            <div>
                <button>Add Company</button>
            </div>
        </div>
    );
}

export default App;
