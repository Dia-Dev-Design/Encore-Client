import { Breadcrumb, BreadcrumbItemProps, Tabs, TabsProps } from "antd";
import {
  BreadcrumbItemType,
  BreadcrumbSeparatorType,
} from "antd/es/breadcrumb/Breadcrumb";
import clsx from "clsx";
import { CompanyTypeChips, CompanyTypeInitialsMap } from "consts/clients.const";
import { LoadingType } from "consts/loading.const";
import Loading from "pages/Loading/Loading";

interface NavigationTabBarProps {
  breadcrumbItems: Partial<BreadcrumbItemType & BreadcrumbSeparatorType>[];
  companyName: string;
  type: string;
  tabs: TabsProps["items"];
  isLoading?: boolean;
}

const NavigationTabBar = ({
  breadcrumbItems,
  companyName,
  type,
  tabs,
  isLoading,
}: NavigationTabBarProps) => {
  return (
    <div className="flex flex-col">
      {!isLoading ? (
        <>
          <div className="pl-10">
            <Breadcrumb
              className="custom-breadcrumb"
              separator=">"
              items={breadcrumbItems}
            />
            <div className="flex items-center gap-4">
              <h1 className="mt-4 font-figtree text-primaryMariner-900 font-medium text-3xl mb-4">
                {companyName}
              </h1>
              <span
                className={clsx(
                  CompanyTypeChips[type],
                  "text-white w-[23px] h-[23px] flex items-center justify-center rounded-full"
                )}
              >
                {CompanyTypeInitialsMap[type]}
              </span>
            </div>
          </div>

          <Tabs items={tabs} className="custom-tabs custom-tabs-border-b" />
        </>
      ) : (
        <Loading type={LoadingType.BLOCK} />
      )}
    </div>
  );
};

export default NavigationTabBar;
