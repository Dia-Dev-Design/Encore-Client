import React, { Dispatch, SetStateAction } from "react";
import { CompanyResponse } from "interfaces/company/company.interface";
import { ReactComponent as CloseIcon } from "assets/icons/BlackX.svg";
import { countries, states } from "utils/constants";

type CompanyInfoAsideProps = {
    dataCompany?: CompanyResponse;
    closeAside: Dispatch<SetStateAction<boolean>>
}

const CompanyInfoAside: React.FC<CompanyInfoAsideProps> = ({dataCompany, closeAside}) => {
    return (
        <div className="company-info-side">
            <button className="absolute z-[5] top-3 right-3" onClick={() => {console.log('hola');;closeAside(false)}}>
                <CloseIcon />
            </button>
            <div className="content pt-5 w-full relative">
                <div className="px-4 pb-4">
                    <h3 className="text-primaryMariner-900 font-semibold text-lg md:text-2xl">
                        Company Info
                    </h3>
                    <h4 className="text-base md:text-lg font-medium text-primaryMariner-900 mt-2">
                        Company name
                    </h4>
                    <span className="block font-normal mt-2 text-sm md:text-base text-primaryMariner-900">
                        {dataCompany?.name}
                    </span>
                </div>
                <div className="bg-primaryLinkWater-50 p-3 pl-4">
                    <h4 className="text-[#585E71] font-semibold text-sm md:text-base font-figtree">
                        Contact Info
                    </h4>
                </div>
                <div className="p-4 grid grid-cols-2 w-[60%] gap-3">
                    <span className="block font-figtree text-sm md:text-base text-greys-700">
                        Contact Name
                    </span>
                    <span className="block font-figtree text-sm md:text-base text-neutrals-black">
                        {dataCompany?.contactName}
                    </span>
                    <span className="block font-figtree text-sm md:text-base text-greys-700">
                        Email Address
                    </span>
                    <span className="block font-figtree text-sm md:text-base text-neutrals-black">
                        {dataCompany?.emailAddress}
                    </span>
                    <span className="block font-figtree text-sm md:text-base text-greys-700">
                        Phone
                    </span>
                    <span className="block font-figtree text-sm md:text-base text-neutrals-black">
                        {dataCompany?.phone ?? "-"}
                    </span>
                </div>
                <div className="bg-primaryLinkWater-50 p-3 pl-4">
                    <h4 className="text-[#585E71] font-semibold text-sm md:text-base font-figtree">
                        Company Info
                    </h4>
                </div>
                <div className="p-4 grid grid-cols-2 w-[60%] gap-3">
                    <span className="block font-figtree text-sm md:text-base text-greys-700">
                        Industry Type
                    </span>
                    <span className="block font-figtree text-sm md:text-base text-neutrals-black">
                        {dataCompany?.industryType.name ?? "-"}
                    </span>
                    <span className="block font-figtree text-sm md:text-base text-greys-700">
                        Company Location
                    </span>
                    <div className="grid gap-1 font-figtree text-sm md:text-base text-neutrals-black">
                        {dataCompany?.states.map((state, index) => {
                            const foundState = states.find(
                                (st) => st.code === state
                            );
                            return foundState ? (
                                <div key={index}>
                                    {state.includes("US")
                                        ? `US: ${foundState.name}`
                                        : state}
                                </div>
                            ) : (
                                ""
                            );
                        })}
                        <div className="flex gap-1">
                            Other countries:{" "}
                            {dataCompany?.otherCountries.map((country, i) => {
                                const foundCountry = countries.find(
                                    (ct) => ct.code === country
                                );

                                return foundCountry
                                    ? foundCountry.name +
                                          (i <
                                          dataCompany.otherCountries.length - 1
                                              ? ", "
                                              : "")
                                    : country;
                            })}
                        </div>
                    </div>
                    <span className="block font-figtree text-sm md:text-base text-greys-700">
                        Structure
                    </span>
                    <span className="block font-figtree text-sm md:text-base text-neutrals-black">
                        {dataCompany?.type ?? "-"}
                    </span>
                    <span className="block font-figtree text-sm md:text-base text-greys-700">
                        Raised external capital
                    </span>
                    <span className="block font-figtree text-sm md:text-base text-neutrals-black">
                        -
                    </span>
                    <span className="block font-figtree text-sm md:text-base text-greys-700">
                        W 2 employees
                    </span>
                    <span className="block font-figtree text-sm md:text-base text-neutrals-black">
                        -
                    </span>
                    <span className="block font-figtree text-sm md:text-base text-greys-700">
                        W 2 employees locations
                    </span>
                    <span className="block font-figtree text-sm md:text-base text-neutrals-black">
                        -
                    </span>
                </div>
            </div>
        </div>
    );
};

export default CompanyInfoAside;
