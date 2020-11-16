const models = require("../models");


const createImageMetaData = (filename, filetype, key, fileurl) => {
    
    return models.Images.create({
        name: filename,
        type: filetype,
        key: key,
        url: fileurl
    }).then(docImage => {
        console.log('Image metadata created.')
        return docImage
    }).catch(err => {
        console.log('Error while creating image metadata')
    })
}

const updateImageMetadata = (_id, filename, filetype, key, fileurl) => {
    return new Promise((resolve, reject) => {
        models.Images.findByIdAndUpdate(
            _id,
            {
                name: filename,
                type: filetype,
                key: key,
                url: fileurl
    
            },
            {new: true}
        ).then(docImage => {
            console.log('Image metadata is updated.')
            resolve(docImage)
        }).catch(err => {
            console.log(err)
            reject(err)
        })
    })
    
}

module.exports = {
    createImageMetaData,
    updateImageMetadata
}