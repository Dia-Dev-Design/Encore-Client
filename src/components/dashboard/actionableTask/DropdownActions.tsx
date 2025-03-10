import { MenuProps } from "antd";
import { isNil } from "lodash";

interface DropdownActionsProps<T> {
  handleAssignTo: (record?: T) => void;
  handleMarkAsComplete: (record?: T) => void;
  handleDeleteTask: (record?: T) => void;
  record?: T;
}

const menuItems = <T,>(
  handleAssignTo: (record?: T) => void,
  handleMarkAsComplete: (record?: T) => void,
  handleDeleteTask: (record?: T) => void,
  record?: T
) => {
  const items = [];

  if (handleAssignTo && handleAssignTo.toString() !== "() => {}") {
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
  if (handleMarkAsComplete) {
    items.push({
      key: "2",
      label: (
        <p
          className="text-base font-medium font-figtree"
          onClick={() => handleMarkAsComplete(record)}
        >
          Mark as Complete
        </p>
      ),
    });
  }

  if (handleDeleteTask) {
    items.push({
      key: "3",
      label: (
        <p
          className="text-base font-medium font-figtree text-statesRed-red"
          onClick={() => handleDeleteTask(record)}
        >
          Delete Task
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
  record?: T
): MenuProps["items"] => [
  ...menuItems<T>(
    handleAssignTo,
    handleChangeToDissolutionClient,
    handleChangeToLawyerChatbotClient,
    record
  ),
];

export default DropdownActions;
