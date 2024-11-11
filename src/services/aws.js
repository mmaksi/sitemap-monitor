"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readFileFromS3 = exports.uploadFile = void 0;
const node_buffer_1 = require("node:buffer");
const node_stream_1 = require("node:stream");
const client_s3_1 = require("@aws-sdk/client-s3");
const lib_storage_1 = require("@aws-sdk/lib-storage");
const streamToString = (stream) => new Promise((resolve, reject) => {
    const chunks = [];
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("error", reject);
    stream.on("end", () => resolve(node_buffer_1.Buffer.concat(chunks).toString("utf-8")));
});
const s3Client = new client_s3_1.S3Client({
    region: "eu-north-1",
    credentials: {
        accessKeyId: process.env.ACCESS_KEY,
        secretAccessKey: process.env.SECRET_ACCESS_KEY,
    },
});
const uploadFile = (data, fileName) => __awaiter(void 0, void 0, void 0, function* () {
    const upload = new lib_storage_1.Upload({
        client: s3Client,
        params: {
            Bucket: "alex-sitemapper-bucket",
            Key: fileName,
            Body: data,
            ContentType: "application/json",
        },
    });
    try {
        yield upload.done();
    }
    catch (err) {
        console.error("Error uploading file:", err);
    }
});
exports.uploadFile = uploadFile;
const readFileFromS3 = (fileName) => __awaiter(void 0, void 0, void 0, function* () {
    const command = new client_s3_1.GetObjectCommand({
        Bucket: "alex-sitemapper-bucket",
        Key: fileName,
    });
    try {
        const response = yield s3Client.send(command);
        if (response.Body instanceof node_stream_1.Readable) {
            return streamToString(response.Body);
        }
        else {
            throw new TypeError("Response body is not a readable stream");
        }
    }
    catch (_a) {
        throw new Error("Error reading file from S3");
    }
});
exports.readFileFromS3 = readFileFromS3;
