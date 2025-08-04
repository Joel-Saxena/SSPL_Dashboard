import * as Minio from 'minio'
import { writeFile } from 'fs/promises';

const minioClient = new Minio.Client({
    endPoint: process.env.MINIO_ENDPOINT,
    port: process.env.MINIO_API_PORT,
    useSSL: false, // Set to true in production
    accessKey: process.env.MINIO_ACCESS_KEY,
    secretKey: process.env.MINIO_SECRET_KEY,
});

// Top Level IIFE to Check Connection
;(async () => {
    try {
        const buckets = await minioClient.listBuckets()
        console.log('Successfully connected to MinIO')
    } catch (err) {
        console.log(err.message)
    }
})();

// Function to upload profile picture
export async function uploadProfilePicture(file, userId) {
    return new Promise((resolve, reject) => { 
        const metaData = {
            'Content-Type': 'image/jpeg',
            'Additional-Metadata': 'profile-picture',
        }
        minioClient.putObject(process.env.MINIO_BUCKET, `${userId}/profile_pic.jpg`, file.buffer, metaData, (err, objInfo) => {
            if (err) {
                console.error('Error uploading profile picture:', err)
                resolve(false);
            }
            console.log('Successfully uploaded profile picture:', objInfo)
            resolve(true);
        })
        
        // For testing: Save file to local "./controllers/test" directory as "{userId}_profile_pic.jpg". You have to Manually Create "./controllers/test" directory.
        // const path = `./controllers/test/${userId}_profile_pic.jpg`;
        // await writeFile(path, file.buffer);
        // console.log(`Saved profile picture locally at ${path}`);
        // return true;
    })
}

// Function to retrieve profile picture
export async function getProfilePicture(userId) {
    let size = 0;
    const dataStream = await minioClient.getObject(process.env.MINIO_BUCKET, `${userId}/profile_pic.jpg`)
    dataStream.on('data', function (chunk) {
        size += chunk.length;
    })
    dataStream.on('end', function () {
        console.log(`Retrieved profile picture of size: ${size} bytes`);
    })
    dataStream.on('error', function (err) {
        console.log(err);
    })
    return dataStream;
}



