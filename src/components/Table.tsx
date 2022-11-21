import Row from "./Row";
import './Table.css'

type Company = {
    name: string;
    generators: number;
    foreignKeys: number;
};

export default function Table({ companies }: { companies: Company[] }) {
    const rows = companies.map((company: Company) => {
        return <Row key={company.name} {...company} />;
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
