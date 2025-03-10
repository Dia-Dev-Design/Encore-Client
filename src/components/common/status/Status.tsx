import clsx from "clsx";
import { StatusChipType } from "consts/status.const";

interface StatusProps {
  type: string;
  text: string;
}

const StatusChipTypeClass: Record<string, string> = {
  [StatusChipType.in_process]:
    "bg-statesYellow-yellow16 text-statesYellow-yellow border border-statesYellow-yellow",
  [StatusChipType.requested]:
    "bg-statesRed-red16 text-statesRed-red border border-statesRed-red",
  [StatusChipType.none]: "bg-greys-100 text-greys-700 border border-greys-700",
  [StatusChipType.done]:
    "bg-primaryMagicMint-100 text-primaryMagicMint-600 border border-primaryMagicMint-600",
};

const Status = ({ type, text }: StatusProps) => {
  return (
    <div
      className={clsx(
        "border rounded-md text-center py-[6px] text-sm font-figtree font-medium",
        StatusChipTypeClass[type]
      )}
    >
      {text}
    </div>
  );
};

export default Status;
