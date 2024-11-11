import { Buffer } from "node:buffer";
import { Readable } from "node:stream";

import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";

const streamToString = (stream: Readable): Promise<string> =>
  new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("error", reject);
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf-8")));
  });

const s3Client = new S3Client({
  region: "eu-north-1",
  credentials: {
    accessKeyId: process.env.ACCESS_KEY!,
    secretAccessKey: process.env.SECRET_ACCESS_KEY!,
  },
});

export const uploadFile = async <T extends string>(
  data: T,
  fileName: string,
) => {
  const upload = new Upload({
    client: s3Client,
    params: {
      Bucket: "alex-sitemapper-bucket",
      Key: fileName,
      Body: data,
      ContentType: "application/json",
    },
  });

  try {
    await upload.done();
  } catch (err) {
    console.error("Error uploading file:", err);
  }
};

export const readFileFromS3 = async (fileName: string) => {
  const command = new GetObjectCommand({
    Bucket: "alex-sitemapper-bucket",
    Key: fileName,
  });

  try {
    const response = await s3Client.send(command);
    if (response.Body instanceof Readable) {
      return streamToString(response.Body);
    } else {
      throw new TypeError("Response body is not a readable stream");
    }
  } catch {
    throw new Error("Error reading file from S3");
  }
};
