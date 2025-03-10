import { Form, Radio } from "antd";

interface QuestionYesNoProps {
  name: string;
}

const QuestionYesNo = ({ name }: QuestionYesNoProps) => {
  return (
    <Form.Item name={name} rules={[{ required: true, message: 'You must select an option' }]}>
      <Radio.Group>
        <Radio
          className="font-figtree font-medium text-neutrals-black text-base"
          value={true}
        >
          Yes
        </Radio>
        <Radio
          className="font-figtree font-medium text-neutrals-black text-base"
          value={false}
        >
          No
        </Radio>
      </Radio.Group>
    </Form.Item>
  );
};

export default QuestionYesNo;
