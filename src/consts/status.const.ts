export enum StatusChipType {
  in_process = "in_process",
  requested = "requested",
  none = "none",
  done = "done",
}
export const LawyerChatbotClientsStatusMap: Record<string, string> = {
  [StatusChipType.in_process]: "In process",
  [StatusChipType.requested]: "Requested",
  [StatusChipType.none]: "N/A",
  [StatusChipType.done]: "Done",
};
