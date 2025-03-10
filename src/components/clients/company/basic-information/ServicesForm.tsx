import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { useQueryClient } from "@tanstack/react-query";
import { message, Switch } from "antd";
import { useToggleCompanyServices } from "api/company.api";
import { CompanyServicesMap } from "consts/clients.const";
import { COMPANY } from "consts/query.const";
import { ServicesType } from "interfaces/company/company.interface";
import { useParams } from "react-router-dom";

interface ServicesFormProps {
  services: ServicesType[];
}

const ServicesForm = ({ services }: ServicesFormProps) => {
  const { companyId } = useParams<{ companyId: string }>();
  const queryClient = useQueryClient();
  const [messageApi, contextHolder] = message.useMessage();
  const { mutate } = useToggleCompanyServices(companyId as string);

  const handleChange = (name: string, checked: boolean) => {
    const payload = {
      service: name,
      enabled: checked,
    };

    mutate(
      {
        ...payload,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: [COMPANY] });

          messageApi.open({
            type: "success",
            content: "Updated successfully",
            duration: 10,
          });
        },
        onError: (error, payload) => {
          messageApi.open({
            type: "error",
            content: "Error updating status service",
            duration: 10,
          });
        },
      }
    );
  };

  return (
    <>
      {contextHolder}
      <div className="flex flex-col gap-4">
        {/* <div className="flex w-full justify-between">
        <span className="text-neutrals-black text-sm font-figtree font-medium">
          Dissolution
        </span>
        <Switch
          checkedChildren={<CheckOutlined />}
          unCheckedChildren={<CloseOutlined />}
          defaultChecked
        />
      </div>
      <div className="flex w-full justify-between">
        <span className="text-neutrals-black text-sm font-figtree font-medium">
          Lawyer AI Chatbot
        </span>
        <Switch
          checkedChildren={<CheckOutlined />}
          unCheckedChildren={<CloseOutlined />}
          defaultChecked
        />
      </div> */}
        {services.map((service: ServicesType) => (
          <div className="flex w-full justify-between" key={service.name}>
            <span className="text-neutrals-black text-sm font-figtree font-medium">
              {CompanyServicesMap[service.name]}
            </span>
            <Switch
              checkedChildren={<CheckOutlined />}
              unCheckedChildren={<CloseOutlined />}
              defaultChecked={service.enabled}
              onChange={(checked) => handleChange(service.name, checked)}
            />
          </div>
        ))}
      </div>
    </>
  );
};

export default ServicesForm;
