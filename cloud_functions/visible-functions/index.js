const functions = require('firebase-functions');
const admin = require('firebase-admin');
const vision = require('@google-cloud/vision');

admin.initializeApp();
const client = new vision.ImageAnnotatorClient({
	projectId: process.env.GCLOUD_PROJECT
  });

  exports.verifyFace = functions.https.onRequest(async (req, res) => {
	if (req.method !== 'POST') {
	  res.status(405).send('Method Not Allowed');
	  return;
	}
  
	const { image1, image2, image3 } = req.body;
  
	try {
	  const [faces1] = await client.faceDetection({ image: { content: image1 } });
	  const [faces2] = await client.faceDetection({ image: { content: image2 } });
	  const [faces3] = await client.faceDetection({ image: { content: image3 } });
  
	  if (!faces1.faceAnnotations || !faces2.faceAnnotations || !faces3.faceAnnotations) {
		res.status(400).json({ success: false, message: 'All images must have faces' });
		return;
	  }
  
	  const similarity1 = calculateFaceSimilarity(faces1.faceAnnotations[0], faces3.faceAnnotations[0]);
	  const similarity2 = calculateFaceSimilarity(faces2.faceAnnotations[0], faces3.faceAnnotations[0]);
  
	  const similarity = (similarity1 + similarity2) / 2;
  
	  res.status(200).json({ success: true, similarity1 });
	} catch (error) {
	  console.error(error);
	  res.status(500).json({ success: false, message: 'Internal Server Error' });
	}
  });
  
  function calculateFaceSimilarity(face1, face2) {
	if (!face1 || !face2 || !face1.landmarks || !face2.landmarks) {
	  return 0;
	}
  
	const landmarks1 = face1.landmarks;
	const landmarks2 = face2.landmarks;
  
	let totalDistance = 0;
  
	for (let i = 0; i < landmarks1.length; i++) {
	  const landmark1 = landmarks1[i].position;
	  const landmark2 = landmarks2[i].position;
  
	  const distance = Math.sqrt(
		Math.pow(landmark1.x - landmark2.x, 2) +
		Math.pow(landmark1.y - landmark2.y, 2) +
		Math.pow(landmark1.z - landmark2.z, 2)
	  );
  
	  totalDistance += distance;
	}
  
	const averageDistance = totalDistance / landmarks1.length;
	const maxDistance = Math.sqrt(3 * Math.pow(256, 2));
	const normalizedDistance = averageDistance / maxDistance;
	const similarityScore = (1 - normalizedDistance) * 100;
  
	return similarityScore;
  }