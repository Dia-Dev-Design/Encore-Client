import clsx from "clsx";

interface CompanyInfoProps {
  content: string;
  type: "title" | "description";
  className?: string;
}

const CompanyInfoItem = ({ content, className, type }: CompanyInfoProps) => {
  return (
    <>
      <span
        className={clsx(
          { "text-greys-700": type === "title" },
          { "text-neutrals-black": type === "description" },
          className,
          "text-base font-medium font-figtree"
        )}
      >
        {content}
      </span>
    </>
  );
};

export default CompanyInfoItem;
