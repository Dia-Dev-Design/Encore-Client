import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Card } from "antd";
import RightArrowIcon from 'assets/icons/blueArrowRight.svg';

export interface MetricCardProps {
    isLoading: boolean,
    prospects: number,
    clients: number,
    changeRate: number,
    prospects_to_clients: number,
    tendencyUp: boolean,
    duration: string
}

const ProspectCard: React.FC<MetricCardProps> = ({isLoading, prospects, clients, changeRate, prospects_to_clients, tendencyUp, duration}) => {

    const pieData = [
        { "name": "Prospects", "value": prospects, "fill": "#6ECADF" },
        { "name": "Clients", "value": clients, "fill": "#9CE9CC" },
    ];

    const RADIAN = Math.PI / 180;
    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: { cx: number, cy: number, midAngle: number, innerRadius: number, outerRadius: number, percent: number, index: number }) => {
      const radius = innerRadius + (outerRadius - innerRadius) * 0.3;
      const x = cx + radius * Math.cos(-midAngle * RADIAN);
      const y = cy + radius * Math.sin(-midAngle * RADIAN);
    
        return (
            <text x={x} y={y} fill="#1C538C" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
            {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    return (
        <Card
            className="row-span-2 col-span-2 mw-72 px-8 py-5 rounded-lg shadow-md bg-primaryLinkWater-50 items-center justify-center border-b border-greys-300"
            loading={isLoading}
            style={{ padding: 0 }}
            styles={{ body: { 
                height: "100%", 
                display: "flex", 
                flexDirection: "column", 
                alignItems: "center", 
                justifyContent: "center",
            } }}
        >
            <div className="flex items-center space-x-4 gap-4 px-14">
                <div className="w-52 h-56">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart height={100}>
                            <Pie
                                data={pieData}
                                dataKey="value"
                                innerRadius={40}
                                outerRadius={90}
                                startAngle={90}
                                endAngle={450}
                                labelLine={false}
                                label={renderCustomizedLabel}
                            >
                                {pieData.map((entry, index:number) => (
                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="text-sm">
                    <p className="flex flex-row text-md font-figtree gap-2">Prospect <img className="w-3.5" src={RightArrowIcon}/> Clients</p>
                    <p className="text-7xl font-semibold mt-2 font-figtree text-center">{prospects_to_clients}</p>
                </div>
            </div>

            <div className="flex flex-row items-center w-full justify-between px-4">
                <div className="pl-6">
                    <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 rounded-full bg-primaryViking-300"></div>
                        <span className="text-md font-figtree text-primaryMariner-900">Prospects</span>
                    </div>
                    <div className="flex items-center space-x-2 mt-2">
                        <div className="w-4 h-4 rounded-full bg-primaryMagicMint-200"></div>
                        <span className="text-md font-figtree text-primaryMariner-900">Clients</span>
                    </div>
                </div>
                <span className="text-md font-figtree text-gray-500 text-center w-24 items-center justify-center">{changeRate}% {duration}</span>
            </div>
        </Card>
    );
};


export default ProspectCard;
