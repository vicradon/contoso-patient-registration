// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import multer from "multer";
import {
  DocumentAnalysisClient,
  AzureKeyCredential,
} from "@azure/ai-form-recognizer";
import path from "path";
import fs from "fs";

const formRecognizerEndpoint = process.env.FORM_RECOGNIZER_ENDPOINT || "";
const formRecognizerAPIKey = process.env.FORM_RECOGNIZER_API_KEY || "";
const modelId = process.env.MODEL_ID || "";

export interface ObjectLiteral {
  [key: string]: string;
}

type Data = {
  name: string;
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "tmp/patient-forms");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return cb(new Error("Wrong file type"));
    }
    cb(null, true);
  },
  limits: {
    fileSize: 2 * 1024 * 1024,
    files: 1,
  },
});

const allowedMimeTypes = ["image/png", "image/jpeg", "application/pdf"];

const apiRoute = nextConnect<NextApiRequest, NextApiResponse>({
  onError(error, req, res) {
    res.status(501).json({ error: `${error.message}` });
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

const uploadMiddleware = upload.single("patient-registration-form");
apiRoute.use(uploadMiddleware);

apiRoute.post(async (req: NextApiRequest, res: NextApiResponse) => {
  const client = new DocumentAnalysisClient(
    formRecognizerEndpoint,
    new AzureKeyCredential(formRecognizerAPIKey)
  );

  const patientFormsDirectory = path.join(process.cwd(), "tmp/patient-forms/");

  const file = fs.createReadStream(patientFormsDirectory + req.file.filename);

  const poller = await client.beginAnalyzeDocument(modelId, file);

  const { documents = [] } = await poller.pollUntilDone();

  const fields = documents[0].fields ? documents[0].fields : {};

  const result: ObjectLiteral = {};

  Object.keys(fields).forEach((field) => {
    result[field] = fields[field].value;
  });

  res.status(200).json({ ...result });
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default apiRoute;
