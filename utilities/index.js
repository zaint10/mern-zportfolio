const Logger = require("./logger");
const uuid = require('uuid').v4
const _ = require('lodash')

const makeS3Key = (username, filename, filetypeName) => {
    const key = `${username}/${filetypeName}/${uuid()}-${filename}`

    return {
        get: () => {
            return key
        }
    }
    
}

const S3_BASE_URL = `https://${process.env.S3_BUKET_NAME}.s3-${process.env.S3_BUKET_REGION}.amazonaws.com`

const getCategorizedProjects = (projects) => {
    return _.groupBy(projects, (project) => {
        return project.category.name
    })
}
module.exports = {
    makeS3Key,
    S3_BASE_URL,
    getCategorizedProjects,
    Logger
}