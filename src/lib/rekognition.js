import { 
  RekognitionClient, 
  DetectLabelsCommand,
  IndexFacesCommand,
  SearchFacesByImageCommand
} from "@aws-sdk/client-rekognition";

const rekognition = new RekognitionClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.MY_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.MY_AWS_SECRET_ACCESS_KEY,
  },
});

export async function detectLabelsForImage(key) {
  try {
    const command = new DetectLabelsCommand({
      Image: {
        S3Object: {
          Bucket: process.env.AWS_S3_BUCKET,
          Name: key,
        },
      },
      MaxLabels: 10,
      MinConfidence: 75,
    });

    const response = await rekognition.send(command);
    return response.Labels || [];
  } catch (error) {
    console.error("Rekognition Label Error:", error);
    return [];
  }
}

export async function indexFace(key) {
  try {
    const command = new IndexFacesCommand({
      CollectionId: process.env.AWS_REKOGNITION_COLLECTION_ID,
      Image: {
        S3Object: { Bucket: process.env.AWS_S3_BUCKET, Name: key },
      },
      MaxFaces: 1,
      QualityFilter: "AUTO",
      DetectionAttributes: ["DEFAULT"],
    });

    const response = await rekognition.send(command);
    if (response.FaceRecords && response.FaceRecords.length > 0) {
      return response.FaceRecords[0].Face.FaceId;
    }
    return null;
  } catch (error) {
    console.error("Rekognition Index Error:", error);
    return null;
  }
}

export async function searchFaces(key) {
  try {
    const command = new SearchFacesByImageCommand({
      CollectionId: process.env.AWS_REKOGNITION_COLLECTION_ID,
      Image: {
        S3Object: { Bucket: process.env.AWS_S3_BUCKET, Name: key },
      },
      MaxFaces: 5,
      FaceMatchThreshold: 90,
    });

    const response = await rekognition.send(command);
    return response.FaceMatches || [];
  } catch (error) {
    console.error("Rekognition Search Error:", error);
    return [];
  }
}
