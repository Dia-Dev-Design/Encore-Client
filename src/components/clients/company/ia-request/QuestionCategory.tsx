import clsx from "clsx";

interface QuestionCategoryProps {
    title: string;
    className?: string;
  }
  
  const QuestionCategory = ({ title, className }: QuestionCategoryProps) => {
    return (
        <div className={clsx("px-6 py-[7px] bg-primaryLinkWater-50", className)}>
        <p className="text-[#585E71] font-semibold font-figtree">
          {title}
        </p>
      </div>
    );
  };
  
  export default QuestionCategory;
  