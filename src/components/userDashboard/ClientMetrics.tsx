import React, { useState } from "react";
import arrow from "assets/icons/Arrow.png";
import { Filter } from "interfaces/dashboard/metrics/metricFilter.interface";
import MetricCard from "components/dashboard/metrics/MetricCard";
import { MetricCardType } from "interfaces/dashboard/metricCardType.enum";
import EstimatedCard from "components/dashboard/metrics/EstimatedCard";
import { getCostMetrics } from "api/dashboard.api";

const ClientMetrics: React.FC = () => {
  const filters: Filter[] = [
    {
      label: "Current Week",
      value: "current_week",
      duration: "in the current week",
    },
    { label: "Last Week", value: "last_week", duration: "in the last week" },
    { label: "Last Month", value: "last_month", duration: "in the last Month" },
  ];
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [selectedFilter, setSelectedFilter] = useState<Filter>(filters[0]);
  const toggleCountryCodeDropdown = () => setIsFilterOpen(!isFilterOpen);

  const { data: costMetricsData, isLoading: costMetricsLoading } =
    getCostMetrics();

  console.log(costMetricsData);

  const isLoading = costMetricsLoading;

  const handleSelectFilter = (filter: Filter) => {
    if (filter) {
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
                <span className="text-md font-figtree">
                  {selectedFilter.label}
                </span>
              ) : (
                <span className="text-md font-figtree">Select</span>
              )}
              <img
                src={arrow}
                alt="arrow"
                className={`ml-2 transform ${
                  isFilterOpen ? "rotate-180" : "rotate-0"
                }`}
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
        <div className="flex flex-col p-6 gap-4">
          <div className="grid grid-cols-3 gap-4 ">
            <MetricCard
              isLoading={isLoading}
              label={"Questions Answered"}
              total={costMetricsData?.questionCount}
              changeRate={0}
              tendencyUp={true}
              cardType={MetricCardType.descriptiveCard}
              description="Since Account creation"
            />
            <MetricCard
              isLoading={isLoading}
              label={"Cost Savings"}
              total={`$${Math.round(costMetricsData?.costSavings)}`}
              changeRate={0}
              tendencyUp={true}
              cardType={MetricCardType.descriptiveCard}
              description={ `*Compared to $2883 non encore cost per hour`}
            />
           <MetricCard
              isLoading={isLoading}
              label={"Time Saved"}
              total={`${costMetricsData?.timeSaved.hours} Hrs`}
              changeRate={0}
              tendencyUp={true}
              cardType={MetricCardType.descriptiveCard}
              description={`${costMetricsData?.timeSaved.formatted} in business hours`}
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClientMetrics;
