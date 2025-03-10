import React, { useState } from "react";
import arrow from 'assets/icons/Arrow.png';
import { Filter } from "interfaces/dashboard/metrics/metricFilter.interface";
import MetricCard from "components/dashboard/metrics/MetricCard";
import { MetricCardType } from "interfaces/dashboard/metricCardType.enum";
import EstimatedCard from "components/dashboard/metrics/EstimatedCard";

const ClientMetrics: React.FC = () => {
    const filters: Filter[] = [
        { label: "Current Week", value: "current_week", duration: "in the current week" },
        { label: "Last Week", value: "last_week", duration: "in the last week" },
        { label: "Last Month", value: "last_month", duration: "in the last Month" },
    ]
    const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
    const [selectedFilter, setSelectedFilter] = useState<Filter>(filters[0]);
    const toggleCountryCodeDropdown = () => setIsFilterOpen(!isFilterOpen);

    // const { data, isLoading } = getMetrics({
    //     period: selectedFilter.value,
    // });
    const isLoading = false;

    const handleSelectFilter = (filter: Filter) => {
        if (filter){
            setSelectedFilter(filter);
            setIsFilterOpen(false);
        }
    };

    return (
        <section className="px-10 py-6">
            <div className="border border-greys-300 rounded-lg">
                <div className="flex justify-between max-h-14 px-6 py-2.5 items-center border-b border-greys-300"> 
                    <h3 className="text-2xl font-medium font-figtree">Metrics</h3>
                    <div className="relative">
                        <button
                            onClick={toggleCountryCodeDropdown}
                            className="flex justify-between items-center max-h-12 w-60 px-6 py-3 rounded-lg border-greys-300 border gap-x-8"
                        >
                            {selectedFilter ? (
                                <span className="text-md font-figtree">{selectedFilter.label}</span>
                            ) : (
                                <span className="text-md font-figtree">Select</span>
                            )}
                            <img
                                src={arrow}
                                alt="arrow"
                                className={`ml-2 transform ${isFilterOpen ? 'rotate-180' : 'rotate-0'}`}
                            />
                        </button>
                        {isFilterOpen && (
                            <div className="absolute right-0 mt-2 w-60 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                                {filters.map((filter) => (
                                    <div
                                        key={filter.value}
                                        onClick={() => handleSelectFilter(filter)}
                                        className="px-6 py-3 cursor-pointer hover:bg-gray-100 text-md font-figtree"
                                    >
                                        {filter.label}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex flex-col p-6 gap-4" >
                    <p className="text-xl font-bold font-figtree text-neutrals-black">Dissolution</p>
                    <div className="grid grid-cols-3 gap-4 ">
                        <MetricCard
                            isLoading={isLoading}
                            label={"Pending tasks"}
                            total={"3"}
                            changeRate={-2}
                            tendencyUp={false}
                            cardType={MetricCardType.descriptiveCard}
                            description="less compared to last 7 days "
                        />
                        <MetricCard
                            isLoading={isLoading}
                            label={"Tasks Overdue"}
                            total={"0"}
                            changeRate={-2}
                            tendencyUp={false}
                            cardType={MetricCardType.descriptiveCard}
                            description="less compared to last 7 days"
                        />
                        <EstimatedCard
                            isLoading={isLoading}
                            title={"Estimated Closing & Progress"}
                            phase={1}
                            currentTaskName={"Name of task with a long name description"}
                            closed={65}
                            progress={35}
                        />
                    </div>
                    <p className="text-xl font-bold font-figtree text-neutrals-black">AI Chatbot</p>
                    <div className="grid grid-cols-3 gap-4">
                        <MetricCard
                            isLoading={isLoading}
                            label={"Chats peding lawyer review"}
                            total={"2"}
                            changeRate={1}
                            tendencyUp={true}
                            cardType={MetricCardType.descriptiveCard}
                            description="more compared to last 7 days"
                        />
                        <MetricCard
                            isLoading={isLoading}
                            label={"Bank Usage"}
                            total={"4/8 Hrs"}
                            changeRate={-2}
                            cardType={MetricCardType.noTendencyCard}
                            description="23 Chats have compsumed this amount of hours"
                        />
                        <MetricCard
                            isLoading={isLoading}
                            label={"Cost Saving"}
                            total={"#"}
                            changeRate={1}
                            cardType={MetricCardType.noTendencyCard}
                            description="Short Description"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};


export default ClientMetrics;

