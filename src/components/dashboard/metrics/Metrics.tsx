import React, { useState } from "react";
import { getMetrics } from "api/dashboard.api";
import arrow from 'assets/icons/Arrow.png';
import MetricCard from "./MetricCard";
import BigMetricCard from "./BigMetricCard";
import ProspectCard from "./ProspectCard";
import { Filter } from "interfaces/dashboard/metrics/metricFilter.interface";
import { MetricCardType } from "interfaces/dashboard/metricCardType.enum";

const Metrics: React.FC = () => {
    const filters: Filter[] = [
        { label: "Current Week", value: "current_week", duration: "in the current week" },
        { label: "Last Week", value: "last_week", duration: "in the last week" },
        { label: "Last Month", value: "last_month", duration: "in the last Month" },
    ]
    const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
    const [selectedFilter, setSelectedFilter] = useState<Filter>(filters[0]);
    const toggleCountryCodeDropdown = () => setIsFilterOpen(!isFilterOpen);

    const { data, isLoading } = getMetrics({
        period: selectedFilter.value,
    });

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
                    <h3 className="text-2xl font-semibold font-figtree">Metrics</h3>
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
                <div className="grid grid-cols-6 gap-4 px-6 py-9">
                    {data && (
                        <>
                            <MetricCard
                                isLoading={isLoading}
                                label={"Sign Ups"}
                                total={data.signups.total.toString()}
                                changeRate={data.signups.changeRate}
                                tendencyUp={data.signups.changeRate >= 0}
                                cardType={MetricCardType.basicCard}
                            />
                            <MetricCard
                                isLoading={isLoading}
                                label={"Other Metric Option"}
                                total={"25"}
                                changeRate={6}
                                tendencyUp={true}
                                cardType={MetricCardType.basicCard}
                            />
                            <MetricCard
                                isLoading={isLoading}
                                label={"Other Metric Option"}
                                total={"3"}
                                changeRate={-2}
                                tendencyUp={false}
                                cardType={MetricCardType.basicCard}
                            />
                            <ProspectCard
                                isLoading={isLoading}
                                prospects={data.rate_prospects_clients.prospects}
                                clients={data.rate_prospects_clients.clients}
                                changeRate={data.rate_prospects_clients.change_rate}
                                prospects_to_clients={data.rate_prospects_clients.prospects_to_clients}
                                tendencyUp={data.rate_prospects_clients.change_rate >= 0}
                                duration={selectedFilter.duration}
                            />
                            <BigMetricCard
                                isLoading={isLoading}
                                label={"Time to resolution"}
                                value={15}
                            />
                            <MetricCard
                                isLoading={isLoading}
                                label={"Active Onboardings"}
                                total={data.onboardings.total.toString()}
                                changeRate={data.onboardings.changeRate}
                                tendencyUp={data.onboardings.changeRate >= 0}
                                cardType={MetricCardType.basicCard}
                            />
                            <MetricCard
                                isLoading={isLoading}
                                label={"Active Dissolutions"}
                                total={data.dissolutions.total.toString()}
                                changeRate={data.dissolutions.changeRate}
                                tendencyUp={data.dissolutions.changeRate >= 0}
                                cardType={MetricCardType.basicCard}
                            />
                            <MetricCard
                                isLoading={isLoading}
                                label={"Overdue Tasks"}
                                total={"3"}
                                changeRate={0}
                                cardType={MetricCardType.basicCard}
                            />
                        </>
                    )}
                </div>
            </div>
        </section>
    );
};


export default Metrics;

