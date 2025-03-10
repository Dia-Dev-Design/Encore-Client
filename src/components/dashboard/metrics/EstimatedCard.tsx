import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Text } from "recharts";
import { Card } from "antd";

export interface MetricCardProps {
    isLoading: boolean;
    title: string;
    phase: number;
    currentTaskName: string;
    closed: number;
    progress: number;
}

const EstimatedCard: React.FC<MetricCardProps> = ({
    isLoading,
    title,
    phase,
    currentTaskName,
    closed,
    progress,
}) => {
    const pieData = [
        { name: "Progress", value: progress, fill: "#B2E4EF" },
        { name: "Closed", value: closed, fill: "#6ECADF" },
    ];

    return (
        <Card
            className="px-4 py-5 rounded-lg shadow-md bg-primaryLinkWater-50 items-center justify-center border-b border-greys-300"
            loading={isLoading}
            style={{ padding: 0 }}
            styles={{
                body: {
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                },
            }}
        >
            <div className="flex flex-col w-full gap-1">
                <p className="text-lg font-semibold text-neutrals-black">{title}</p>
                <div className="flex flex-col">
                    <p className="text-sm font-semibold text-greys-700">Phase #</p>
                    <p className="text-base font-semibold text-neutrals-black">{phase}</p>
                </div>
                <div className="flex flex-col">
                    <p className="text-sm font-semibold text-greys-700">Current Task:</p>
                    <p className="text-base font-semibold text-neutrals-black">{currentTaskName}</p>
                </div>
            </div>
            <div className="flex items-center space-x-4 gap-4 w-52 h-36">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart height={100}>
                        <Pie
                            data={pieData}
                            dataKey="value"
                            innerRadius={40}
                            outerRadius={60}
                            startAngle={90}
                            endAngle={450}
                            labelLine={false}
                        >
                            {pieData.map((entry, index: number) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                        </Pie>

                        <text
                            x="50%"
                            y="50%"
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fontSize="18"
                            fill="#1C538C"
                            fontWeight="bold"
                        >
                            {`${closed}%`}
                        </text>
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
};

export default EstimatedCard;
