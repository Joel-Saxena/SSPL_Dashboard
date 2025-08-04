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

export async function uploadFileToStorage(file, userId, uploaded_file_type) {
    return new Promise((resolve, reject) => { 
        
        let metaData = null;
        if (uploaded_file_type === 'profile_pic') {
            metaData = {
            'Content-Type': 'image/jpeg',
            'Additional-Metadata': 'profile-picture',
            };
        } else if (uploaded_file_type === 'document_aadhaar') {
            metaData = {
            'Content-Type': 'application/pdf',
            'Additional-Metadata': 'document-aadhaar',
            };
        } else if (uploaded_file_type === 'document_pan') {
            metaData = {
            'Content-Type': 'application/pdf',
            'Additional-Metadata': 'document-pan',
            };
        } else {
            console.error('Error uploading profile picture: Invalid file type');
            resolve(false);
            return;
        }
        

        minioClient.putObject(process.env.MINIO_BUCKET, `${userId}/${uploaded_file_type}`, file.buffer, metaData, (err, objInfo) => {
            if (err) {
                console.error('Error uploading profile picture:', err)
                resolve(false);
            }
            console.log('Successfully uploaded profile picture:', objInfo)
            resolve(true);
        })
        
        // For testing: Save profile pic to local "./controllers/test" directory as "{userId}_profile_pic.jpg". You have to Manually Create "./controllers/test" directory.
        // const path = `./controllers/test/${userId}_profile_pic.jpg`;
        // await writeFile(path, file.buffer);
        // console.log(`Saved profile picture locally at ${path}`);
        // return true;
    })
}

// Function to retrieve profile picture
export async function getFileFromStorage(userId, fileType) {
    let size = 0;
    const dataStream = await minioClient.getObject(process.env.MINIO_BUCKET, `${userId}/${fileType}`)
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



