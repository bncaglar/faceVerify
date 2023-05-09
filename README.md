Face Verification using Google Cloud Vision API
This README file provides an explanation of the provided face verification code, which uses Google Cloud Vision API to detect and compare faces in images.

Overview
The code is a Firebase Cloud Function that receives three images as input and returns a similarity score between the first two images and the third one. The verification process is done by comparing facial landmarks extracted from the images.

Code Explanation
The code consists of a main function verifyFace and a helper function calculateFaceSimilarity.

verifyFace function
verifyFace is an asynchronous Firebase Cloud Function that:

Checks if the incoming request is a POST request; if not, it sends a "Method Not Allowed" response.
Extracts the three images from the request body.
Calls the Google Cloud Vision API to detect faces in each of the images.
If any of the images do not have face annotations, it sends a "Bad Request" response with a message stating that all images must have faces.
Calls the calculateFaceSimilarity function to compute the similarity scores between the first and the third images, as well as the second and the third images.
Calculates the average similarity score.
Sends a "Success" response with the average similarity score.
calculateFaceSimilarity function
calculateFaceSimilarity is a helper function that takes two sets of facial landmarks as input and returns a similarity score between the two faces. It calculates the score as follows:

Verifies if both input faces have landmarks; if not, it returns 0.
Iterates through the landmarks, calculating the Euclidean distance between corresponding landmarks in the two faces.
Calculates the total distance and the average distance between the landmarks.
Normalizes the average distance by dividing it by the maximum possible distance in the image.
Calculates the similarity score by subtracting the normalized distance from 1 and multiplying the result by 100.
