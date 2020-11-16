const Images = require('./Images')
module.exports = {
    Users: require("./User"),
    Projects: require("./Projects"),
    Images: Images.model,
    ProjectCatagories: require('./ProjectCategories').model,
    RbacModels: require('./rbac')
  };