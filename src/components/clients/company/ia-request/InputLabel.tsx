interface InputLabelProps {
  title: string;
  required?: boolean;
}

const InputLabel = ({ title, required = true }: InputLabelProps) => {
  return (
    <p className="text-xs font-figtree font-medium text-greys-700 mt-3">
      {title}
      {required && <span className="text-statesRed-red">*</span>}
    </p>
  );
};

export default InputLabel;
