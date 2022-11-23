import { useEffect, useState, useReducer } from "react";
import Row from "./Row";
import "./Table.css";

type FeatureCount = {
    generators: number;
    foreignKeys: number;
};

type Action =
    | {
          type: "overwrite";
          data: FeatureCount[];
      }
    | {
          type: "increment";
          feature: "generators" | "foreignKeys";
          id: number;
      };

const amp_id = import.meta.env.VITE_AMPLITUDE_USER_ID;
const amp_secret = import.meta.env.VITE_AMPLITUDE_SECRET;
const auth = btoa(`${amp_id}:${amp_secret}`);

const fetchData = async (): Promise<[string[], FeatureCount[]] | undefined> => {
    // api is proxied to https://amplitude.com in vite.config.js
    const res = await fetch("/api/3/chart/pvjy11z/query", {
        headers: { Authorization: `Basic ${auth}` },
    });
    if (res.status === 200) {
        const { data } = await res.json();
        // first item is the aggregate, which is unneeded
        const companies: string[] = data.labels
            .slice(1, data.labels.length)
            .map(([name]: [name: string]): string => name);
        const featureCount: FeatureCount[] = data.values
            .slice(1, data.values.length)
            .map(
                ([generators, foreignKeys]: [
                    generators: number,
                    foreignKeys: number
                ]) => ({ generators, foreignKeys })
            );
        return [companies, featureCount];
    }
    return undefined;
};

const savedCompanies = localStorage.getItem("companies");
const savedFeatureCount = localStorage.getItem("featureCount");
const initCompanies = savedCompanies
    ? JSON.parse(savedCompanies)
    : ["ACME", "DataSticks", "Doppler Shift", "Twastter"];
const initFeatureCount = savedFeatureCount
    ? JSON.parse(savedFeatureCount)
    : initCompanies.map(() => ({ generators: 0, foreignKeys: 0 }));

function reducer(state: FeatureCount[], action: Action): FeatureCount[] {
    if (action.type === "overwrite") {
        return action.data as FeatureCount[];
    }
    if (action.type === "increment") {
        const update = [...state];
        update[action.id] = { ...update[action.id] };
        update[action.id][action.feature]++;
        return update;
    }
    return state;
}

export default function Table() {
    const [companies, setCompanies] = useState(initCompanies);
    const [featureCount, dispatchFeatureCount] = useReducer(
        reducer,
        initFeatureCount
    );

    useEffect(() => {
        fetchData().then((data) => {
            if (data) {
                const [companies, featureCount] = data;
                console.log("from amplitude", featureCount);
                setCompanies(companies);
                if (featureCount instanceof Array) {
                    dispatchFeatureCount({
                        type: "overwrite",
                        data: featureCount,
                    });
                }
            }
        });
    }, []);

    useEffect(() => {
        localStorage.setItem("companies", JSON.stringify(companies));
    }, [companies]);

    useEffect(() => {
        localStorage.setItem("featureCount", JSON.stringify(featureCount));
    }, [featureCount]);

    function handleFeatureIncrease(id: number) {
        return (feature: "generators" | "foreignKeys") => {
            const type: "increment" = "increment";
            const action = { type, feature, id };
            return dispatchFeatureCount(action);
        };
    }

    const rows = companies.map((companyName: string, i: number) => {
        return (
            <Row
                key={companyName + i}
                name={companyName}
                {...featureCount[i]}
                dispatch={handleFeatureIncrease(i)}
            />
        );
    });

    return (
        <table>
            <thead>
                <tr>
                    <th>Company</th>
                    <th>No. of Generators</th>
                    <th>No. of Foreign Keys</th>
                </tr>
            </thead>
            <tbody>{rows}</tbody>
        </table>
    );
}
