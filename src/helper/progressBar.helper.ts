export const progressBar = (progress: number) => {
  if (progress < 50) return "#E23939";
  if (progress < 100) return "#E2A139";
  return "#1EAB88";
};
