import React from "react";
import { Card } from "antd";

export interface MetricCardProps {
    isLoading: boolean,
    label: string,
    value: number,
}

const BigMetricCard: React.FC<MetricCardProps> = ({isLoading, label, value}) => {

    return (
        <Card
            className="row-span-2 mw-72 px-8 py-5 rounded-lg shadow-md bg-statesOrange-orange16 items-center justify-center border-b border-greys-300"
            loading={isLoading}
            style={{ padding: 0 }}
            styles={{ body: { height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" } }}
        >
            <p className="text-5xl font-semibold text-neutrals-black">
                {value}min
            </p>
            <p className="text-lg font-semibold text-greys-700 text-center">
                {label} 
            </p>
        </Card>
    );
};


export default BigMetricCard;

