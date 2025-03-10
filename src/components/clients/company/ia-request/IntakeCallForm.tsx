import { Button, Checkbox, Form, Input, message, Radio, Select } from "antd";
import { useEffect, useState } from "react";
import QuestionTitle from "./QuestionTitle";
import QuestionYesNo from "./QuestionYesNo";
import { getIntakeCall, useSendFormIntakeCall } from "api/company.api";
import { useParams } from "react-router-dom";
import { INTAKE_CALL } from "consts/query.const";
import { countries, states } from "utils/constants";
import InputLabel from "./InputLabel";
import Loading from "pages/Loading/Loading";
import { LoadingType } from "consts/loading.const";
import QuestionCategory from "./QuestionCategory";
import { useQueryClient } from "@tanstack/react-query";

enum IntellectualProperty {
  PATENTS = "PATENTS",
  TRADEMARKS = "TRADEMARKS",
  COPYRIGHTS = "COPYRIGHTS",
  TRADE_SECRETS = "TRADE_SECRETS",
}

enum Structure {
  CORPORATION = "CORPORATION",
  LLC = "LLC",
  OTHER = "OTHER",
}

const IntakeCallForm = () => {
  const { companyId } = useParams();

  const { data, isLoading } = getIntakeCall(INTAKE_CALL, companyId as string);
  const { mutate, isPending } = useSendFormIntakeCall(companyId as string);
  const queryClient = useQueryClient();
  const [messageApi, contextHolder] = message.useMessage();

  const [form] = Form.useForm();

  const onSubmit = (values: any) => {
    const intellectualProperty = values.intellectualProperty.map(
      (item: string) => ({
        type: item,
        registrationNumber:
          item === IntellectualProperty.PATENTS
            ? values.patentsRegistrationNumber
            : item === IntellectualProperty.TRADEMARKS
            ? values.trademarksRegistrationNumber
            : "",
        jurisdiction:
          item === IntellectualProperty.PATENTS
            ? values.patentsJurisdiction
            : item === IntellectualProperty.TRADEMARKS
            ? values.trademarksJurisdiction
            : "",
      })
    );

    let valuesData = { ...values };

    delete valuesData.patentsJurisdiction;
    delete valuesData.patentsRegistrationNumber;
    delete valuesData.trademarksRegistrationNumber;
    delete valuesData.trademarksJurisdiction;


    const payload = {
      ...valuesData,
      intellectualProperty,
    };

    mutate(
      {
        ...payload,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: [INTAKE_CALL] });

          messageApi.open({
            type: "success",
            content: "Form Updated successfully",
            duration: 10,
          });
        },
        onError: (error, payload) => {
          messageApi.open({
            type: "error",
            content: "Error updating form",
            duration: 10,
          });
        },
      }
    );
  };

  const statesMap = () => {
    return states.map((state) => ({
      label: state.name,
      value: state.code,
    }));
  };

  const countryMap = () => {
    return countries.map((country) => ({
      label: country.name,
      value: country.code,
    }));
  };

  return !isLoading ? (
    <>
      {contextHolder}
      <div className="rounded-lg border border-greys-300 w-full h-[678px] overflow-y-auto custom-gray-scroll">
        <h2 className="border-b border-greys-300 py-[10px] px-6 font-figtree font-semibold text-neutrals-black text-2xl">
          Intake Call Form
        </h2>
        <Form
          className="custom-form"
          onFinish={onSubmit}
          form={form}
          initialValues={{
            structure: data.structure ?? Structure.CORPORATION,
            hasRaisedCapital: data.hasRaisedCapital ?? true,
            hasW2Employees: data.hasW2Employees ?? true,
            stateW2Employees: data.stateW2Employees,
            hasOperationOutsideUS: data.hasOperationOutsideUS ?? true,
            countryOperationOutsideUS: data.countryOperationOutsideUS,
            hasIntellectualProperty: data.hasIntellectualProperty ?? true,
            intellectualProperty: data.intellectualProperty.map(
              (item: { type: string }) => item.type
            ),
            patentsRegistrationNumber: data.intellectualProperty.find(
              (item: { type: string }) =>
                item.type === IntellectualProperty.PATENTS
            )?.registrationNumber,
            patentsJurisdiction: data.intellectualProperty.find(
              (item: { type: string }) =>
                item.type === IntellectualProperty.PATENTS
            )?.jurisdiction,
            trademarksRegistrationNumber: data.intellectualProperty.find(
              (item: { type: string }) =>
                item.type === IntellectualProperty.TRADEMARKS
            )?.registrationNumber,
            trademarksJurisdiction: data.intellectualProperty.find(
              (item: { type: string }) =>
                item.type === IntellectualProperty.TRADEMARKS
            )?.jurisdiction,
            hasPendingIPApplication: data.hasPendingIPApplication ?? true,
            pendingIPApplicationDetails: data.pendingIPApplicationDetails,
            areEmployeesInBargainingAgreements:
              data.areEmployeesInBargainingAgreements ?? true,
            employeesInBargainingAgreementsDetails:
              data.employeesInBargainingAgreementsDetails,
            hasEstatePropertyOrEquipment:
              data.hasEstatePropertyOrEquipment ?? true,
            estatePropertyOrEquipmentDetails:
              data.estatePropertyOrEquipmentDetails,
            hasFinancialObligations: data.hasFinancialObligations ?? true,
            finalcialObligationsDetails: data.finalcialObligationsDetails,
            hasIntendToHaveAsset: data.hasIntendToHaveAsset ?? true,
            intendToHaveAssetDetails: data.intendToHaveAssetDetails,
            hasOngoingNegotationsForSale:
              data.hasOngoingNegotationsForSale ?? true,
            ongoingNegotationsForSaleDetails:
              data.ongoingNegotationsForSaleDetails,
            hasReceivedOffers: data.hasReceivedOffers ?? true,
            hasReceivedOffersDetails: data.hasReceivedOffersDetails,
            hasSubsidiaries: data.hasSubsidiaries ?? true,
            otherStructure: data.otherStructure,
          }}
        >
          <QuestionCategory title="A. Company Structure and Ownership" />

          <div className="px-6 mt-2">
            <QuestionTitle title="1. How is your company structured" />

            <Form.Item
              name="structure"
              rules={[{ required: true, message: "You must select an option" }]}
            >
              <Radio.Group>
                <Radio
                  className="font-figtree font-medium text-neutrals-black text-base"
                  value={Structure.CORPORATION}
                >
                  {" "}
                  Corporation{" "}
                </Radio>
                <Radio
                  className="font-figtree font-medium text-neutrals-black text-base"
                  value={Structure.LLC}
                >
                  {" "}
                  LLC{" "}
                </Radio>
                <Radio
                  className="font-figtree font-medium text-neutrals-black text-base"
                  value={Structure.OTHER}
                >
                  {" "}
                  Other{" "}
                </Radio>
              </Radio.Group>
            </Form.Item>

            <Form.Item
              noStyle
              shouldUpdate={(prevValues, currentValues) =>
                prevValues.structure !== currentValues.structure
              }
            >
              {({ getFieldValue }) =>
                getFieldValue("structure") === "OTHER" ? (
                  <>
                    <InputLabel title="Other" />
                    <Form.Item name="otherStructure">
                      <Input
                        className="custom-input"
                        placeholder="Enter your company structure"
                      />
                    </Form.Item>
                  </>
                ) : null
              }
            </Form.Item>
          </div>
          <div className="px-6 mt-3">
            <QuestionTitle title="2. Have your company ever raised money or taken external capital?" />
            <QuestionYesNo name="hasRaisedCapital" />
          </div>
          <div className="px-6 mt-3">
            <QuestionTitle title="3. Have the company ever had W-2 employees? and where these employees are?" />
            <QuestionYesNo name="hasW2Employees" />
            <Form.Item
              noStyle
              shouldUpdate={(prevValues, currentValues) =>
                prevValues.hasW2Employees !== currentValues.hasW2Employees
              }
            >
              {({ getFieldValue }) =>
                getFieldValue("hasW2Employees") ? (
                  <>
                    <InputLabel title="State" />
                    <Form.Item
                      name="stateW2Employees"
                      rules={[
                        { required: true, message: "Please select state" },
                      ]}
                    >
                      <Select
                        className="custom-select w-full max-w-[240px]"
                        placeholder="Select state"
                        options={statesMap()}
                      />
                    </Form.Item>
                  </>
                ) : null
              }
            </Form.Item>
          </div>

          <div className="px-6 mt-3">
            <QuestionTitle title="4. Subsidiaries and Affiliates: Does your company have any subsidiaries or affiliated entities?" />
            <QuestionYesNo name="hasSubsidiaries" />
          </div>
          <div className="px-6 mt-3">
            <QuestionTitle title="4.1  Do you have employees or operations outside the U.S?" />
            <QuestionYesNo name="hasOperationOutsideUS" />

            <Form.Item
              noStyle
              shouldUpdate={(prevValues, currentValues) =>
                prevValues.hasOperationOutsideUS !==
                currentValues.hasOperationOutsideUS
              }
            >
              {({ getFieldValue }) =>
                getFieldValue("hasOperationOutsideUS") ? (
                  <>
                    <InputLabel title="Country" />

                    <Form.Item
                      name="countryOperationOutsideUS"
                      rules={[
                        { required: true, message: "Please select country" },
                      ]}
                    >
                      <Select
                        className="custom-select w-full max-w-[240px]"
                        placeholder="Select country"
                        options={countryMap()}
                      />
                    </Form.Item>
                  </>
                ) : null
              }
            </Form.Item>
          </div>

          <QuestionCategory title="B. Intellectual Property" className="mt-2" />

          <div className="px-6 mt-3">
            <QuestionTitle title="5. Does your company own any registered intellectual property?" />
            <QuestionYesNo name="hasIntellectualProperty" />

            <Form.Item
              noStyle
              shouldUpdate={(prevValues, currentValues) =>
                prevValues.intellectualProperty !==
                currentValues.intellectualProperty
              }
            >
              {({ getFieldValue }) =>
                getFieldValue("intellectualProperty") ? (
                  <>
                    <QuestionTitle
                      className="mt-2"
                      title="Indicate type of IP owned"
                      type="sub-title"
                    />

                    <Form.Item
                      name="intellectualProperty"
                      className="mt-3"
                      rules={[
                        {
                          required: true,
                          message: "Please select at least one option",
                        },
                      ]}
                    >
                      <Checkbox.Group className="flex flex-col gap-2">
                        <Checkbox
                          className="font-figtree font-medium text-neutrals-black flex items-center text-base"
                          value={IntellectualProperty.PATENTS}
                        >
                          <div className="grid grid-cols-10 items-center gap-0">
                            <span className="col-span-2 ">Patents</span>
                            <div className="flex gap-3 col-span-8">
                              <div className="flex flex-col">
                                <InputLabel
                                  title="Registration number"
                                  required={false}
                                />
                                <Form.Item name="patentsRegistrationNumber">
                                  <Input
                                    className="custom-input w-[263px]"
                                    placeholder="Registration number"
                                  />
                                </Form.Item>
                              </div>
                              <div className="flex flex-col">
                                <InputLabel
                                  title="Jurisdiction"
                                  required={false}
                                />
                                <Form.Item name="patentsJurisdiction">
                                  <Input
                                    className="custom-input w-[263px]"
                                    placeholder="Jurisdiction"
                                  />
                                </Form.Item>
                              </div>
                            </div>
                          </div>
                        </Checkbox>
                        <Checkbox
                          className="font-figtree font-medium text-neutrals-black text-base"
                          value={IntellectualProperty.TRADEMARKS}
                        >
                          <div className="grid grid-cols-10 items-center gap-0">
                            <span className="col-span-2 ">Trademarks</span>
                            <div className="flex gap-3 col-span-8">
                              <div className="flex flex-col">
                                <InputLabel
                                  title="Registration number"
                                  required={false}
                                />
                                <Form.Item name="trademarksRegistrationNumber">
                                  <Input
                                    className="custom-input w-[263px]"
                                    placeholder="Registration number"
                                  />
                                </Form.Item>
                              </div>
                              <div className="flex flex-col">
                                <InputLabel
                                  title="Jurisdiction"
                                  required={false}
                                />
                                <Form.Item name="trademarksJurisdiction">
                                  <Input
                                    className="custom-input w-[263px]"
                                    placeholder="Jurisdiction"
                                  />
                                </Form.Item>
                              </div>
                            </div>
                          </div>
                        </Checkbox>
                        <Checkbox
                          className="font-figtree font-medium text-neutrals-black mt-2 text-base"
                          value={IntellectualProperty.COPYRIGHTS}
                        >
                          Copyrights
                        </Checkbox>
                        <Checkbox
                          className="font-figtree font-medium text-neutrals-black mt-4 text-base"
                          value={IntellectualProperty.TRADE_SECRETS}
                        >
                          Trade secrets
                        </Checkbox>
                      </Checkbox.Group>
                    </Form.Item>
                  </>
                ) : null
              }
            </Form.Item>
          </div>

          <div className="px-6 mt-6">
            <QuestionTitle title="6. Are there any pending IP applications?" />
            <QuestionYesNo name="hasPendingIPApplication" />
            <Form.Item
              noStyle
              shouldUpdate={(prevValues, currentValues) =>
                prevValues.hasPendingIPApplication !==
                currentValues.hasPendingIPApplication
              }
            >
              {({ getFieldValue }) =>
                getFieldValue("hasPendingIPApplication") ? (
                  <>
                    <InputLabel title="Provide IP Application Details" />
                    <Form.Item
                      name="pendingIPApplicationDetails"
                      rules={[
                        { required: true, message: "This field is required" },
                      ]}
                    >
                      <Input
                        className="custom-input w-full"
                        placeholder="Type Application details "
                      />
                    </Form.Item>
                  </>
                ) : null
              }
            </Form.Item>
          </div>

          <QuestionCategory
            title="C. Employees & contractors"
            className="mt-2"
          />

          <div className="px-6 mt-6">
            <div className="flex gap-[2px]">
              <QuestionTitle title="7. Are any employees subject to collective bargaining agreements or unions? ">
                <span className="text-statesRed-red font-figtree font-semibold text-base">
                  {" "}
                  (this question shows up if question 1.1 Employees in other
                  coutries is yes)
                </span>
              </QuestionTitle>
            </div>
            <QuestionYesNo name="areEmployeesInBargainingAgreements" />
            <Form.Item
              noStyle
              shouldUpdate={(prevValues, currentValues) =>
                prevValues.areEmployeesInBargainingAgreements !==
                currentValues.areEmployeesInBargainingAgreements
              }
            >
              {({ getFieldValue }) =>
                getFieldValue("areEmployeesInBargainingAgreements") ? (
                  <>
                    <InputLabel title="Provide Details" />
                    <Form.Item
                      name="employeesInBargainingAgreementsDetails"
                      rules={[
                        { required: true, message: "This field is required" },
                      ]}
                    >
                      <Input
                        className="custom-input w-full"
                        placeholder="Type details"
                      />
                    </Form.Item>
                  </>
                ) : null
              }
            </Form.Item>
          </div>

          <QuestionCategory
            title="D. Real Estate and Equipment"
            className="mt-2"
          />

          <div className="px-6 mt-6">
            <QuestionTitle title="8. Does your company own or lease any real estate property or equipment?" />

            <QuestionYesNo name="hasEstatePropertyOrEquipment" />
            <Form.Item
              noStyle
              shouldUpdate={(prevValues, currentValues) =>
                prevValues.hasEstatePropertyOrEquipment !==
                currentValues.hasEstatePropertyOrEquipment
              }
            >
              {({ getFieldValue }) =>
                getFieldValue("hasEstatePropertyOrEquipment") ? (
                  <>
                    <QuestionTitle
                      className="mt-2 -mb-2"
                      title="Provide addresses, descriptions, and whether they are owned or leased."
                      type="sub-title"
                    />
                    <InputLabel title="Details" />
                    <Form.Item
                      name="estatePropertyOrEquipmentDetails"
                      rules={[
                        { required: true, message: "This field is required" },
                      ]}
                    >
                      <Input
                        className="custom-input w-full"
                        placeholder="Type addresses, descriptions, and whether they are owned or leased"
                      />
                    </Form.Item>
                  </>
                ) : null
              }
            </Form.Item>
          </div>

          <QuestionCategory title="E. Financials" className="mt-2" />

          <div className="px-6 mt-6">
            <QuestionTitle title="9. Does your company have any outstanding loans, lines of credit, or other financial obligations?" />

            <QuestionYesNo name="hasFinancialObligations" />

            <Form.Item
              noStyle
              shouldUpdate={(prevValues, currentValues) =>
                prevValues.hasFinancialObligations !==
                currentValues.hasFinancialObligations
              }
            >
              {({ getFieldValue }) =>
                getFieldValue("hasFinancialObligations") ? (
                  <>
                    <QuestionTitle
                      className="mt-2 -mb-2"
                      title="Provide details, including lenders and amounts owed."
                      type="sub-title"
                    />
                    <InputLabel title="Details" />
                    <Form.Item
                      name="finalcialObligationsDetails"
                      rules={[
                        { required: true, message: "This field is required" },
                      ]}
                    >
                      <Input
                        className="custom-input w-full"
                        placeholder="Type details, including lenders and amounts owed"
                      />
                    </Form.Item>
                  </>
                ) : null
              }
            </Form.Item>
          </div>

          <div className="px-6 mt-6">
            <QuestionTitle title="10.  Do you intend to have an asset sale?" />

            <QuestionYesNo name="hasIntendToHaveAsset" />

            <Form.Item
              noStyle
              shouldUpdate={(prevValues, currentValues) =>
                prevValues.hasIntendToHaveAsset !==
                currentValues.hasIntendToHaveAsset
              }
            >
              {({ getFieldValue }) =>
                getFieldValue("hasIntendToHaveAsset") ? (
                  <>
                    <QuestionTitle
                      className="mt-2 -mb-2"
                      title="Provide details, including lenders and amounts owed."
                      type="sub-title"
                    />
                    <InputLabel title="Details" />
                    <Form.Item
                      name="intendToHaveAssetDetails"
                      rules={[
                        { required: true, message: "This field is required" },
                      ]}
                    >
                      <Input
                        className="custom-input w-full"
                        placeholder="Type details, including lenders and amounts owed"
                      />
                    </Form.Item>
                  </>
                ) : null
              }
            </Form.Item>
          </div>

          <div className="px-6 mt-6">
            <QuestionTitle title="10.1 Are there any ongoing negotiations for the sale of assets or the company itself?" />

            <QuestionYesNo name="hasOngoingNegotationsForSale" />

            <Form.Item
              noStyle
              shouldUpdate={(prevValues, currentValues) =>
                prevValues.hasOngoingNegotationsForSale !==
                currentValues.hasOngoingNegotationsForSale
              }
            >
              {({ getFieldValue }) =>
                getFieldValue("hasOngoingNegotationsForSale") ? (
                  <>
                    <InputLabel title="Details" />
                    <Form.Item
                      name="ongoingNegotationsForSaleDetails"
                      rules={[
                        { required: true, message: "This field is required" },
                      ]}
                    >
                      <Input
                        className="custom-input w-full"
                        placeholder="Type details"
                      />
                    </Form.Item>
                  </>
                ) : null
              }
            </Form.Item>
          </div>

          <div className="px-6 mt-6">
            <QuestionTitle title="10.2  Have you received or issued any offers or letters of intent recently?" />

            <QuestionYesNo name="hasReceivedOffers" />

            <Form.Item
              noStyle
              shouldUpdate={(prevValues, currentValues) =>
                prevValues.hasReceivedOffers !== currentValues.hasReceivedOffers
              }
            >
              {({ getFieldValue }) =>
                getFieldValue("hasReceivedOffers") ? (
                  <>
                    <InputLabel title="Details" />
                    <Form.Item
                      name="hasReceivedOffersDetails"
                      rules={[
                        { required: true, message: "This field is required" },
                      ]}
                    >
                      <Input
                        className="custom-input w-full"
                        placeholder="Type details"
                      />
                    </Form.Item>
                  </>
                ) : null
              }
            </Form.Item>
          </div>
          <div className="flex justify-end mr-6 mt-6 mb-10">
            <Button
              className="text-white font-figtree font-medium text-base bg-primaryMariner-700 py-5 w-[233px] rounded-lg ml-auto"
              htmlType="submit"
              loading={isPending}
            >
              Save
            </Button>
          </div>
        </Form>
      </div>
    </>
  ) : (
    <Loading type={LoadingType.BLOCK} />
  );
};

export default IntakeCallForm;
