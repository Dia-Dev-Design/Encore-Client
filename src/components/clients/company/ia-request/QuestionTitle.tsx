import clsx from "clsx";

interface QuestionTitleProps {
  title: string;
  className?:string;
  type?: "title" | "sub-title";
  children?: React.ReactNode;
}

const QuestionTitle = ({ title,className ,children ,type="title"}: QuestionTitleProps) => {
  return (
    <p className={clsx("font-figtree text-base text-neutrals-black", 
      {"font-semibold": type === "title"},
      {"font-medium": type === "sub-title"},
      className)}>{title}
      {children && children}
      </p>
  );
};

export default QuestionTitle;
