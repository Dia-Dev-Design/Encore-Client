import { MenuProps } from "antd";
import {
  DISSOLUTION_CLIENTS,
  LAWYER_CHATBOT_CLIENTS,
  PROSPECT_CLIENTS,
} from "consts/query.const";

interface DropdownActionsProps<T> {
  handleAssignTo?: (record?: T) => void;
  handleChangeToDissolutionClient?: (record?: T) => void;
  handleChangeToLawyerChatbotClient?: (record?: T) => void;
  record?: T;
  currentContext?:
    | typeof DISSOLUTION_CLIENTS
    | typeof LAWYER_CHATBOT_CLIENTS
    | typeof PROSPECT_CLIENTS;
}

const menuItems = <T,>(
  handleAssignTo: (record?: T) => void,
  handleChangeToDissolutionClient: (record?: T) => void,
  handleChangeToLawyerChatbotClient: (record?: T) => void,
  record?: T,
  currentContext = PROSPECT_CLIENTS
) => {
  const items = [];

  if (currentContext !== LAWYER_CHATBOT_CLIENTS) {
    items.push({
      key: "1",
      label: (
        <p
          className="text-base font-medium font-figtree"
          onClick={() => handleAssignTo(record)}
        >
          Assign to
        </p>
      ),
    });
  }
  if (
    currentContext !== DISSOLUTION_CLIENTS &&
    handleChangeToDissolutionClient
  ) {
    items.push({
      key: "2",
      label: (
        <p
          className="text-base font-medium font-figtree"
          onClick={() => handleChangeToDissolutionClient(record)}
        >
          Change to Dissolution Client
        </p>
      ),
    });
  }

  if (
    currentContext !== LAWYER_CHATBOT_CLIENTS &&
    handleChangeToLawyerChatbotClient
  ) {
    items.push({
      key: "3",
      label: (
        <p
          className="text-base font-medium font-figtree"
          onClick={() => handleChangeToLawyerChatbotClient(record)}
        >
          Change to Lawyer Chatbot Client
        </p>
      ),
    });
  }

  return items;
};

const DropdownActions = <T,>(
  handleAssignTo: (record?: T) => void,
  handleChangeToDissolutionClient: (record?: T) => void,
  handleChangeToLawyerChatbotClient: (record?: T) => void,
  record?: T,
  currentContext = PROSPECT_CLIENTS
): MenuProps["items"] => [
  ...menuItems<T>(
    handleAssignTo,
    handleChangeToDissolutionClient,
    handleChangeToLawyerChatbotClient,
    record,
    currentContext
  ),
];

export default DropdownActions;
