import { useState, MouseEvent, useEffect } from "react";
import { track } from "@amplitude/analytics-browser";

import './Row.css'

enum EventType {
    Generator = "Generators",
    ForeignKey = "Foreign Keys",
}

function createPropsEffect(
    prop: string,
    state: string,
    setState: React.Dispatch<string>
) {
    return useEffect(() => {
        if (prop !== state) {
            setState(prop);
        }
    }, [prop]);
}

export default function Row(props) {
    const [generators, setGenerators] = useState(props.generators);
    const [foreignKeys, setForeignKeys] = useState(props.foreignKeys);

    createPropsEffect(props.generators, generators, setGenerators);
    createPropsEffect(props.foreignKeys, foreignKeys, setForeignKeys);

    const handleTrackEvent = (type: EventType, company: string) => {
        return (_: MouseEvent<HTMLButtonElement>) => {
            track(type, { company });
            const dispatch =
                type === "Generators" ? setGenerators : setForeignKeys;
            dispatch((count: number) => count + 1);
        };
    };

    return (
        <tr>
            <td>{props.name}</td>
            <td>
                {generators}
                <button
                    onClick={handleTrackEvent(EventType.Generator, props.name)}
                >
                    +
                </button>
            </td>
            <td>
                {foreignKeys}
                <button
                    onClick={handleTrackEvent(EventType.ForeignKey, props.name)}
                >
                    +
                </button>
            </td>
        </tr>
    );
}
