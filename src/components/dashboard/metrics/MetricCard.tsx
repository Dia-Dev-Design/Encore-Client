import React from "react";
import UpArrowIcon from 'assets/icons/UpArrow.svg';
import DownArrowIcon from 'assets/icons/DownArrow.svg';
import { Card } from "antd";
import { MetricCardType } from "interfaces/dashboard/metricCardType.enum";

export interface MetricCardProps {
    isLoading: boolean,
    label: string,
    total: string,
    changeRate: number,
    tendencyUp?: boolean,
    cardType: MetricCardType,
    description?: string,
}

const MetricCard: React.FC<MetricCardProps> = ({isLoading, label, total, changeRate, tendencyUp, cardType, description}) => {

    switch (cardType) {
        case MetricCardType.descriptiveCard:
            return (
                <Card
                    className={`px-8 py-2 rounded-lg shadow-md border-b border-greys-300 ${tendencyUp ? 'bg-primaryMagicMint-50' : 'bg-statesRed-red16'}`}
                    loading={isLoading}
                    style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}
                    styles={{ body: { height: "auto", display: "flex", flexDirection: "column", padding: "0", justifyContent: "center", gap: "16px" } }}
                >
                    <p className="text-5xl font-semibold text-neutrals-black">
                        {total}
                    </p>
                    <p className="text-lg font-semibold text-greys-700">
                        {label} 
                    </p>
                    {tendencyUp !== undefined && 
                        <div className="flex flex-row items-center gap-2">
                            {(changeRate > 0 || changeRate < 0) && (<img className="w-3.5" src={tendencyUp ? UpArrowIcon : DownArrowIcon}/>)}
                            <p className="mt-0.5 text-base font-figtree">
                             {description}
                            </p>
                        </div>
                    }
                </Card>
            );
        case MetricCardType.noTendencyCard:
            return (
                <Card
                    className={`px-8 py-2 rounded-lg shadow-md border-b border-greys-300 bg-statesOrange-orange16`}
                    loading={isLoading}
                    style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}
                    styles={{ body: { height: "auto", display: "flex", flexDirection: "column", padding: "0", justifyContent: "center" } }}
                >
                    <p className="text-lg font-semibold text-greys-950">
                        {label} 
                    </p>
                    <p className="2xl:text-7xl text-5xl font-semibold text-neutrals-black">
                        {total}
                    </p>
                    <div className="flex flex-row items-center gap-2">
                        <p className="mt-1 text-lg font-figtree text-greys-700">
                            {description}
                        </p>
                    </div>
                </Card>
            );
        default:
        case MetricCardType.basicCard:
            return (
                <Card
                    className={`px-8 py-2 rounded-lg shadow-md border-b border-greys-300 ${tendencyUp ? 'bg-primaryMagicMint-50' : 'bg-statesRed-red16'}`}
                    loading={isLoading}
                    style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}
                    styles={{ body: { height: "auto", display: "flex", flexDirection: "column", padding: "0", justifyContent: "center" } }}
                >
                    <p className="2xl:text-7xl text-5xl font-semibold text-neutrals-black">
                        {total}
                    </p>
                    <p className="text-lg font-semibold text-greys-700">
                        {label} 
                    </p>
                    {tendencyUp !== undefined && 
                        <div className="flex flex-row items-center gap-2">
                            {(changeRate > 0 || changeRate < 0) && (<img className="w-3.5" src={tendencyUp ? UpArrowIcon : DownArrowIcon}/>)}
                            <p className="mt-0.5 text-md font-figtree">
                                {Math.abs(changeRate)}%
                            </p>
                        </div>
                    }
                </Card>
            );
    }
    
};


export default MetricCard;

