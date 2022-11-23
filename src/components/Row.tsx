import { MouseEvent } from "react";
import { track } from "@amplitude/analytics-browser";

import "./Row.css";

export default function Row(props) {
    const handleTrackEvent = (type: string, company: string) => {
        return (_: MouseEvent<HTMLButtonElement>) => {
            track(type, { company });
            props.dispatch(type);
        };
    };

    return (
        <tr>
            <td>{props.name}</td>
            <td>
                {props.generators}
                <button
                    onClick={handleTrackEvent("generators", props.name)}
                >
                    +
                </button>
            </td>
            <td>
                {props.foreignKeys}
                <button
                    onClick={handleTrackEvent("foreignKeys", props.name)}
                >
                    +
                </button>
            </td>
        </tr>
    );
}
