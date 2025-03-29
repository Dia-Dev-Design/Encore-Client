import { Tooltip, Modal, Row, Col, Card, Pagination, Spin } from "antd";
import DocIcon from "assets/icons/pdf.png";
interface PDFThumbnailProps {
  fileName: string;
  onClick: () => void;
}

const PDFThumbnail: React.FC<PDFThumbnailProps> = ({ fileName, onClick }) => {
  return (
    <Card
      hoverable
      className="pdf-thumbnail"
      onClick={onClick}
      cover={
        <div className="h-[150px] flex items-center justify-center bg-gray-50 overflow-hidden">
          <div className="flex flex-col items-center justify-center h-full">
            <img src={DocIcon} alt="Document" className="w-16 h-16 mb-2" />
            <span className="text-xs text-gray-500">PDF Document</span>
          </div>
        </div>
      }
    >
      <Card.Meta
        title={
          <Tooltip title={fileName}>
            <div className="truncate w-full">{fileName}</div>
          </Tooltip>
        }
      />
    </Card>
  );
};

export default PDFThumbnail;
