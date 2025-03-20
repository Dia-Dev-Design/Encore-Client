import { useState, useMemo, useEffect } from "react";
import { Modal, Spin } from "antd";
import { Document, Page, pdfjs } from "react-pdf";
import DocIcon from "assets/icons/pdf.png";

interface PDFViewerProps {
  url: string;
  fileName: string;
  visible: boolean;
  onClose: () => void;
}

interface OnDocumentLoadSuccessParams {
  numPages: number;
}

const PDFViewer: React.FC<PDFViewerProps> = ({
  url,
  fileName,
  visible,
  onClose,
}) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [loadError, setLoadError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [useIframe, setUseIframe] = useState<boolean>(false);
  const [documentReady, setDocumentReady] = useState<boolean>(false);

  const documentOptions = useMemo(
    () => ({
      cMapUrl: "/cmaps/",
      cMapPacked: true,
    }),
    []
  );

  useEffect(() => {
    if (visible) {
      setLoading(true);
      setLoadError(false);
      setUseIframe(false);
      setNumPages(null);
      setPageNumber(1);
      setDocumentReady(false);
    }
  }, [visible, url]);

  function onDocumentLoadSuccess({ numPages }: OnDocumentLoadSuccessParams) {
    setNumPages(numPages);
    setPageNumber(1);
    setLoadError(false);
    setTimeout(() => {
      setLoading(false);
      setDocumentReady(true);
    }, 500);
  }

  const handleDocumentLoadError = (error: Error) => {
    if (!useIframe && url.includes("amazonaws.com")) {
      console.log("Trying iframe fallback for S3 PDF");
      setUseIframe(true);
      setLoading(false);
    } else {
      setLoadError(true);
      setLoading(false);
    }
  };

  return (
    <Modal
      title={fileName}
      open={visible}
      onCancel={onClose}
      width={800}
      footer={[
        <div
          key="pagination"
          className="flex items-center justify-center w-full gap-4"
        >
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="pdf-nav-button"
          >
            Download
          </a>
        </div>,
      ]}
    >
      <div className="flex justify-center pdf-container h-[600px] overflow-auto">
        {loadError ? (
          <div className="pdf-loading-container">
            <img src={DocIcon} alt="Document" className="w-24 h-24 mb-4" />
            <p className="text-lg text-gray-600 mb-2">Unable to load PDF</p>
            <p className="text-sm text-gray-500">
              Please try downloading the document instead
            </p>
          </div>
        ) : useIframe ? (
          <iframe
            src={`https://docs.google.com/viewer?url=${encodeURIComponent(
              url
            )}&embedded=true`}
            className="w-full h-full border-0"
            title={fileName}
          />
        ) : (
          <div className="relative w-full h-full">
            {loading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white bg-opacity-80 z-10 pdf-loading-container">
                <Spin size="large" />
              </div>
            )}
            {visible && (
              <Document
                file={url}
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadError={handleDocumentLoadError}
                loading={<Spin size="large" />}
                options={documentOptions}
              >
                {numPages &&
                  documentReady &&
                  Array.from(new Array(numPages), (el, index) => (
                    <Page
                      key={`page_${index + 1}`}
                      pageNumber={index + 1}
                      renderTextLayer={true}
                      renderAnnotationLayer={true}
                      className="pdf-viewer-page mb-4"
                      width={720}
                      loading={
                        <div className="flex justify-center items-center p-4">
                          <Spin size="small" />
                        </div>
                      }
                      error={<div className="hidden"></div>}
                    />
                  ))}
              </Document>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default PDFViewer;
