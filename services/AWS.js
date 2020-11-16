const aws = require('aws-sdk')

class AWS {
    constructor(){
        this.AWSSecretKey = process.env.AWSSecretKey
        this.AWSAccessKeyId = process.env.AWSAccessKeyId
        this.S3_BUKET_REGION = process.env.S3_BUKET_REGION

        this.setAWSConfig();
        
    }

    setAWSConfig(){
        aws.config.update({
            secretAccessKey: this.AWSSecretKey,
            accessKeyId: this.AWSAccessKeyId,
            region: this.S3_BUKET_REGION,

        })
    }
    getS3(){
        return new aws.S3()
    }
}

module.exports = AWS;