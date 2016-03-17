var acl = require('acl')
    , mongoose = require('mongoose')
    , acl_role_name = require('./../models/acl_role_name')
    , roles = { //undeletable roles
        ROOT: 1000,
        SUPER_ADMIN: 400,
        ORGANIZATION_ADMIN: 300,
        ENTITY_ADMIN: 200,
        USER: 100
    }

    , resources = {
        USERS: 'users',
        SUPER_ADMIN_USERS: 'super_admin_users',
        ORGANIZATION_ADMIN_USERS: 'organizaion_admin_users',
        ENTITY_ADMIN_USERS: 'entity_admin_users',

    }
    , actions = {
        VIEW: 'view',
        LIST: 'list',
        EDIT: 'edit',
        CREATE: 'create',
        DELETE: 'delete',
    };

actions.ALL = [
    actions.VIEW,
    actions.LIST,
    actions.EDIT,
    actions.CREATE,
    actions.DELETE
];
acl = new acl(new acl.mongodbBackend(mongoose.connection.db, 'acl_'));
///////////////////////////////////////////// USERS //////////////////////////////////////////
acl.allow(
    roles.SUPER_ADMIN,
    [
        resources.SUPER_ADMIN_USERS,
        resources.ORGANIZATION_ADMIN_USERS,
        resources.ENTITY_ADMIN_USERS
    ],
    actions.ALL
);
//-----------
acl.allow(
    roles.ORGANIZATION_ADMIN,
    [
        resources.ORGANIZATION_ADMIN_USERS,
        resources.ENTITY_ADMIN_USERS
    ],
    actions.ALL
);
//-----------
acl.allow(
    roles.ENTITY_ADMIN,
    resources.ENTITY_ADMIN_USERS,
    actions.ALL
);
//////////////////////////////////////////////////////////////////////////////////////////////
acl.consts = {
    roles: roles,
    resources: resources,
    actions: actions,
}

module.exports = acl;