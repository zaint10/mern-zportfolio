const { reject } = require("lodash");
const models = require("../models");



const getAllCategories = () => {
    return new Promise((resolve, reject) => {
        models.ProjectCatagories.find({})
        .then(docCategories => {
            resolve(docCategories)
        }).catch(err => {
            reject(err)
        })

    })
}

module.exports = {
    getAllCategories
}