import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const region = process.env.AWS_REGION;
const bucket = process.env.S3_BUCKET_NAME;
if (!region) throw new Error("AWS_REGION environment variable is required");
if (!bucket) throw new Error("S3_BUCKET_NAME environment variable is required");

export const s3 = new S3Client({
  region,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? "",
  },
  requestChecksumCalculation: "WHEN_REQUIRED",
});

const BUCKET = bucket;

export async function presignPutUrl(
  key: string,
  contentType: string,
  expiresIn = 300
): Promise<{ uploadUrl: string; objectUrl: string }> {
  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    ContentType: contentType,
  });

  const uploadUrl = await getSignedUrl(s3, command, { expiresIn });
  const objectUrl = `https://${BUCKET}.s3.${region}.amazonaws.com/${key}`;

  return { uploadUrl, objectUrl };
}
