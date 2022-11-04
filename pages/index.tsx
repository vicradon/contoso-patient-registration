import fs from "fs";
import path from "path";
import { Box, Button, Icon, Image, Input } from "@chakra-ui/react";
import { useCallback, useState } from "react";
import { ObjectLiteral } from "./api/upload-document";
import FormDataTable from "../src/components/FormDataTable";
import { Spinner } from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import { pdfjs, Document, Page } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function Home() {
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [analysisResult, setAnalysisResult] = useState<ObjectLiteral>({});
  const [previewURL, setPreviewURL] = useState<string>("");
  const [fileIsImage, setFileIsImage] = useState<boolean>(false);
  const toast = useToast();

  const uploadFile = useCallback(async () => {
    if (file) {
      setAnalysisResult({});
      setUploading(true);

      const formData = new FormData();
      formData.append("patient-registration-form", file);

      const res = await fetch("api/upload-document", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setAnalysisResult(data);
        setUploading(false);
      } else {
        const resText = await res.text();
        toast({
          title: `${resText}`,
          status: "error",
          isClosable: true,
        });
        setUploading(false);
      }
    }
  }, [file]);

  const handleFileInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileToUpload = event.target.files?.[0];
    setFileIsImage(
      fileToUpload?.type === "image/png" || fileToUpload?.type === "image/jpeg"
    );
    setPreviewURL(URL.createObjectURL(fileToUpload as Blob));
    setFile(fileToUpload || null);
  };

  return (
    <Box>
      <Input
        onChange={handleFileInput}
        placeholder="Select Date and Time"
        size="md"
        type="file"
      />

      {file?.type === "application/pdf" && (
        <Document file={previewURL}>
          <Page pageIndex={0} />
        </Document>
      )}
      {fileIsImage && previewURL && (
        <Image src={previewURL} alt="Preview file" />
      )}

      <Button colorScheme="blue" onClick={uploadFile} disabled={uploading}>
        {uploading ? <Spinner /> : "Upload"}
      </Button>

      {Object.keys(analysisResult).length > 0 && (
        <Box>
          <FormDataTable data={analysisResult} />
        </Box>
      )}
    </Box>
  );
}

export async function getServerSideProps() {
  const patientFormsDirectory = path.join(process.cwd(), "tmp/patient-forms/");

  if (!fs.existsSync(patientFormsDirectory)) {
    fs.mkdirSync(patientFormsDirectory, { recursive: true });
  }

  return {
    props: {},
  };
}
