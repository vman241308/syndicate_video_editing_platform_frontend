import { progress } from '@material-tailwind/react';
import AWS from 'aws-sdk';
import { PutObjectRequest } from 'aws-sdk/clients/s3';
import { Progress } from 'aws-sdk/lib/request';

const accessKeyId = import.meta.env.VITE_AWS_ACCESS_KEY_ID;
const secretAccessKey = import.meta.env.VITE_AWS_SECRET_ACCESS_KEY;
const region = import.meta.env.VITE_AWS_BUCKET_REGION;

export function uploadToS3(
  keyPath: string,
  body: Buffer | Uint8Array | Blob | string | ReadableStream,
  onProgress: { (progress: Progress): void } | undefined = undefined
) {
  const s3 = new AWS.S3({
    accessKeyId,
    secretAccessKey,
    region,
  });
  const bucket = import.meta.env.VITE_AWS_BUCKET_NAME;

  const params: PutObjectRequest = {
    Bucket: bucket,
    Key: keyPath,
    Body: body,
  };

  if (onProgress) {
    return s3.upload(params).on('httpUploadProgress', onProgress).promise();
  }
  return s3.upload(params).promise();
}

export function sendMessageToSQS(message: Record<string, string>) {
  const sqs = new AWS.SQS({
    apiVersion: '2012-11-05',
    accessKeyId,
    secretAccessKey,
    region,
  });
  const params = {
    MessageBody: JSON.stringify(message),
    QueueUrl: import.meta.env.VITE_VIDEO_EXPORT_TRIGGER_URL,
  };

  return sqs.sendMessage(params).promise();
}

export function receiveMessageFromSQS() {
  // AWS.config.update({ region });
  // const sqs = new AWS.SQS({
  //   apiVersion: '2012-11-05',
  //   accessKeyId,
  //   secretAccessKey,
  //   region,
  // });
  // const queueURL = import.meta.env.VITE_VIDEO_EXPORT_TRIGGER_URL;
  // const params = {
  //   AttributeNames: ['SentTimestamp'],
  //   MaxNumberOfMessages: 10,
  //   MessageAttributeNames: ['All'],
  //   QueueUrl: queueURL,
  //   VisibilityTimeout: 20,
  //   WaitTimeSeconds: 0,
  // };
  // sqs.receiveMessage(params, function (err, data) {
  //   if (err) {
  //     console.log('Receive Error', err);
  //   } else if (data.Messages) {
  //     const deleteParams = {
  //       QueueUrl: queueURL,
  //       ReceiptHandle: data.Messages[0].ReceiptHandle,
  //     };
  //     sqs.deleteMessage(deleteParams, function (err, data) {
  //       if (err) {
  //         console.log('Delete Error', err);
  //       } else {
  //         console.log('Message Deleted', data);
  //       }
  //     });
  //   }
  // });
}
