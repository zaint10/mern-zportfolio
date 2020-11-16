const uuid = require('uuid').v4


const makeS3Key = (username, filename, filetypeName) => {
    const key = `${username}/${filetypeName}/${uuid()}-${filename}`

    return {
        get: () => {
            return key
        }
    }
    
}

const S3_BASE_URL = `https://${process.env.S3_BUKET_NAME}.s3-${process.env.S3_BUKET_REGION}.amazonaws.com`


module.exports = {
    makeS3Key,
    S3_BASE_URL
}