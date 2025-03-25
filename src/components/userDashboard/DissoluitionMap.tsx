import React, { useMemo, useState, useEffect } from "react";
import { Gantt } from "wx-react-gantt";
import "wx-react-gantt/dist/gantt.css";
import { Willow } from "wx-react-gantt";
import { DissolutionStyledWrapper } from "./Dissolution.styled";
import { getDissolutionTasks, getUser } from "api/dashboard.api";
import { CompanyResponse } from "interfaces/company/company.interface";

import { useParams } from "react-router-dom";

const columns = [
    { id: "text", header: "Task name", flexGrow: 2, width: 200 },
    {
        id: "start",
        header: "Start date",
        flexGrow: 1,
        align: "center",
    },
    {
        id: "duration",
        header: "Duration",
        width: 100,
        flexGrow: 1,
        align: "center",
    },
    {
        id: "action",
        header: "",
        width: 30,
        align: "center",
    },
];

const scales = [
    { unit: "month", step: 1, format: "MMMM yyy" },
    { unit: "day", step: 1, format: "d" },
];

interface ApiTask {
    id: string;
    taskPos: number;
    name: string;
    category: string;
    typeTask: string;
    status: string;
    isAssigned: boolean;
    adminAssigned: string | null;
    userAssigned: string | null;
    startDate: string;
    endDate: string;
    durationInDays: number;
    progress: number;
}

interface ApiStep {
    name: string;
    stepPos: number;
    startDate: string;
    endDate: string;
    durationInDays: number;
    progress: number;
    tasks: ApiTask[];
}

interface ParsedTask {
    id: number;
    text: string;
    start: Date;
    end: Date;
    duration: number;
    progress: number;
    type: string;
    parent?: number;
}

type DissolutionRoadmapProps = {
    isLoadingCompany: boolean;
    company?: CompanyResponse;
};

const DissolutionMap: React.FC = () => {
    const { data: userData } = getUser();
    const { data } = getDissolutionTasks(userData?.companies[0].id ?? "");

    const params = useParams()

    useEffect(() => {
        console.log("These are the params of where I'm being called======>>", params)
    }, [])

    function parseApiData(apiData: ApiStep[]): ParsedTask[] {
        const parsedTasks: ParsedTask[] = [];
        if (!apiData) return [];

        apiData.forEach((step, stepIndex) => {
            const parentId = stepIndex + 1;
            parsedTasks.push({
                id: parentId,
                text: step.name[0].toUpperCase() + step.name.slice(1, -1),
                start: new Date(step.startDate),
                end: new Date(step.endDate),
                duration: step.durationInDays,
                progress: step.progress,
                type: "summary",
            });

            step.tasks.forEach((task) => {
                parsedTasks.push({
                    id: parseInt(task.id, 16),
                    text: task.name[0].toUpperCase() + task.name.slice(1, -1),
                    start: new Date(task.startDate),
                    end: new Date(task.endDate),
                    duration: task.durationInDays,
                    progress: task.progress,
                    type: "task",
                    parent: parentId,
                });
            });
        });

        return parsedTasks;
    }

    const parsedTasks = useMemo(() => parseApiData(data), [data]);

    return (
        <DissolutionStyledWrapper>
            <div
                className={`rounded-lg bg-white p-[4px] max-w-[1520px] mx-auto ${
                    parsedTasks.length === 0
                        ? "min-h-[80dvh] flex items-center justify-center"
                        : ""
                }`}
            >
                {parsedTasks.length > 0 ? (
                    <Willow>
                        <Gantt
                            tasks={parsedTasks}
                            scales={scales}
                            columns={columns}
                        />
                    </Willow>
                ) : (
                    <p>Sorry, this company doesn't have tasks created yet</p>
                )}
            </div>
        </DissolutionStyledWrapper>
    );
};

export default DissolutionMap;
