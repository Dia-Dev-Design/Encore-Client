import { Row, Col, Pagination } from "antd";
import React, { useState } from "react";
import DocIcon from "assets/icons/pdf.png";
import { Params } from "interfaces/clientDashboard/dochub/dochub.interface";
import { useQueryParams } from "helper/query.helper";
import { CLIENT_DOCS } from "consts/clientPanel/clientQuery.const";
import { getUserDocumentIds } from "api/clientDocHub.api";
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
    documentLimit: 6,
    documentPage: 1,
  });

  const [previewVisible, setPreviewVisible] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<DocumentType | null>(
    null
  );

  const { data, isLoading } = getUserDocumentIds(CLIENT_DOCS, {
    limit: params.documentLimit,
    page: params.documentPage,
  });

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

  return (
    <section className="w-full h-full p-0 m-0 md:px-10 md:pt-6">
      <div className="w-full h-full md:h-[76vh] flex flex-row md:gap-4">
        <section className="w-full px-10">
          <div className="border border-[#C2C9CE] rounded-lg">
            <div className="flex justify-between px-6 py-[14px] items-center border-b border-[#C2C9CE]">
              <h3 className="text-2xl font-semibold font-figtree">
                Uploaded Documents
              </h3>
            </div>

            <div className="p-6">
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  Loading documents...
                </div>
              ) : data?.data?.length > 0 ? (
                <>
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

                  <div className="mt-6 flex justify-end">
                    <Pagination
                      total={data?.meta?.totalCount || 0}
                      current={params.documentPage}
                      pageSize={params.documentLimit}
                      showSizeChanger
                      pageSizeOptions={[6, 12]}
                      onChange={(page: number, pageSize: number) => {
                        setParams({
                          documentPage: page,
                          documentLimit: pageSize,
                        });
                      }}
                      showTotal={(total: number) => `Total ${total} items`}
                    />
                  </div>
                </>
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
        </section>
      </div>

      {selectedDocument && (
        <PDFViewer
          url={
            `http://localhost:8080/api/dochub/documents/${selectedDocument.id}/stream`
          }
          fileName={selectedDocument.name}
          visible={previewVisible}
          onClose={handleClosePreview}
        />
      )}
    </section>
  );
};

export default DocHub;
