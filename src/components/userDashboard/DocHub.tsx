import { Row, Col, Pagination, message, Upload } from "antd";
import React, { useState, useRef, useEffect } from "react";
import DocIcon from "assets/icons/pdf.png";
import { Params } from "interfaces/clientDashboard/dochub/dochub.interface";
import { useQueryParams } from "helper/query.helper";
import { CLIENT_DOCS } from "consts/clientPanel/clientQuery.const";
import { getUserDocumentIds, uploadDocuments } from "api/clientDocHub.api";
import PDFThumbnail from "components/clients/company/doc-hub/PDFThumbnail";
import PDFViewer from "components/clients/company/doc-hub/PDFViewer";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import "./DocHub.css";
import { pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `${window.location.origin}/pdf.worker.min.js`;

interface DocumentType {
  id?: string;
  name: string;
  type: string;
  url: string;
  size: number;
  createdAt: string;
  [key: string]: any;
}

const DocHub: React.FC = () => {
  const [params, setParams] = useQueryParams<Params>({
    documentLimit: 4,
    documentPage: 1,
    limit: 4,
  });

  const [previewVisible, setPreviewVisible] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<DocumentType | null>(
    null
  );
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data, isLoading, refetch } = getUserDocumentIds(CLIENT_DOCS, {
    limit: params.limit || params.documentLimit,
    page: params.documentPage,
  });

  console.log("thes are data dochub", data)
  const uploadMutation = uploadDocuments();

  useEffect(() => {
    if (params.documentPage > 1 && data?.data?.length === 0) {
      setParams({
        ...params,
        documentPage: 1,
      });
    }
  }, [data?.data]);

  const handlePreviewDocument = (document: DocumentType) => {
    setSelectedDocument(document);
    setPreviewVisible(true);
  };

  const handleClosePreview = () => {
    setPreviewVisible(false);
    setTimeout(() => {
      setSelectedDocument(null);
    }, 300);
  };

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    const invalidFiles = files.filter(
      (file) => file.type !== "application/pdf"
    );
    if (invalidFiles.length > 0) {
      message.error("Only PDF files are allowed");
      return;
    }

    setIsUploading(true);
    try {
      await uploadMutation.mutateAsync(files);
      message.success("Documents uploaded successfully");
      refetch();
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      message.error("Failed to upload documents");
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handlePaginationChange = (page: number, pageSize: number) => {
    setParams({
      documentPage: page,
      documentLimit: pageSize,
      limit: pageSize,
    });
  };

  return (
    <section className="w-full h-full p-0 m-0 md:px-10 md:pt-6">
      <div className="w-full h-full md:h-[76vh] flex flex-col md:gap-4">
        <section className="w-full px-10 h-full flex flex-col">
          <div className="border border-[#C2C9CE] rounded-lg flex flex-col h-[calc(100%-3.5rem)]">
            <div className="flex justify-between px-6 py-[14px] items-center border-b border-[#C2C9CE] flex-shrink-0">
              <h3 className="text-2xl font-semibold font-figtree">
                Uploaded Documents
              </h3>
              <div className="flex items-center">
                <input
                  type="file"
                  accept="application/pdf"
                  multiple
                  onChange={handleFileSelect}
                  style={{ display: "none" }}
                  ref={fileInputRef}
                />
                <button
                  className={`bg-[#285464] text-white font-figtree font-medium py-2 px-4 rounded-md transition duration-300 ease-in-out ${
                    isUploading
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-[#1a3a47]"
                  }`}
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                >
                  {isUploading ? "Uploading..." : "Upload"}
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  Loading documents...
                </div>
              ) : data?.data?.length > 0 ? (
                <Row gutter={[16, 16]}>
                  {data.data.map((doc: DocumentType, index: number) => (
                    <Col key={doc.id || index} xs={24} sm={12} md={8} lg={6}>
                      <PDFThumbnail
                        fileName={doc.name}
                        onClick={() => handlePreviewDocument(doc)}
                      />
                    </Col>
                  ))}
                </Row>
              ) : (
                <div className="flex flex-col items-center justify-center h-64">
                  <img
                    src={DocIcon}
                    alt="No documents"
                    className="w-16 h-16 mb-4"
                  />
                  <p className="text-gray-500">No documents found</p>
                </div>
              )}
            </div>
          </div>

          {data?.data?.length > 0 && (
            <div className="h-14 flex items-center justify-end">
              <Pagination
                total={data?.meta?.totalCount || 0}
                current={params.documentPage}
                pageSize={params.limit || params.documentLimit}
                showSizeChanger
                pageSizeOptions={[4, 8, 12]}
                onChange={handlePaginationChange}
                showTotal={(total: number) => `Total ${total} items`}
              />
            </div>
          )}
        </section>
      </div>

      {selectedDocument && (
        <PDFViewer
          url={`http://localhost:8080/api/dochub/documents/${selectedDocument.id}/stream`}
          fileName={selectedDocument.name}
          visible={previewVisible}
          onClose={handleClosePreview}
        />
      )}
    </section>
  );
};

export default DocHub;
