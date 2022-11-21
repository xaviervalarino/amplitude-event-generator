import { useEffect, useState } from "react";
import { init } from "@amplitude/analytics-browser";

import Table from "./components/Table";
import "./App.css";

const amp_id = import.meta.env.VITE_AMPLITUDE_USER_ID
const amp_secret = import.meta.env.VITE_AMPLITUDE_SECRET

// amplitude init
init(amp_id);
const auth = btoa(`${amp_id}:${amp_secret}`);

const fetchData = async () => {
    const res = await fetch("/api/3/chart/pvjy11z/query", {
        headers: { Authorization: `Basic ${auth}` },
    });
    if (res.status === 200) {
        const { data } = await res.json();
        // first item is the aggregate, which is unneeded
        console.log('DATA', data)
        return data.labels
            .map(([name]: [name: string], i: number) => {
                return {
                    name,
                    generators: data.values[i][0],
                    foreignKeys: data.values[i][1],
                };
            })
            .slice(1, data.labels.length);
    }
};

const COMPANIES = [
    { name: "ACME", generators: 0, foreignKeys: 0 },
    { name: "DataSticks", generators: 0, foreignKeys: 0 },
    { name: "Doppler Shift", generators: 0, foreignKeys: 0 },
    { name: "Twastter", generators: 0, foreignKeys: 0 },
];

function App() {
    const [companies, setCompanies] = useState(COMPANIES);
    useEffect(() => {
        fetchData().then((data) => {
            console.log(data);
            setCompanies(data);
        });
    }, []);
    return (
        <div className="App">
            <h1>Amplitude event generator</h1>
            <Table companies={companies} />
            <div>
                <button>Add Company</button>
            </div>
        </div>
    );
}

export default App;
