import InitialSupportInformation from "./InitialSupportInformation";
import IntakeCallForm from "./IntakeCallForm";

const IARequest = () => {
  return (
    <div className="flex gap-6 mt-6 px-10">
      <div className="flex-[0_0_490px]">
      <InitialSupportInformation/>
      </div>
      <div className="flex-auto">
      <IntakeCallForm />
      </div>
    </div>
  );
};

export default IARequest;
