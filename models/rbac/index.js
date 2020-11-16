const {moduleActions} = require('./moduleActions')
const {roles, rolesSchema} = require('./roles')
module.exports = {
    Actions: require('./actions'),
    ModuleActions: moduleActions,
    Modules: require('./modules'),
    RolesSchema: rolesSchema,
    Roles: roles,
    RoleActions: require('./roleActions')
     
}