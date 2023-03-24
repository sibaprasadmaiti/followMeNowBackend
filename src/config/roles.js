const roles = ['user', 'admin','guest','leadership','ministries'];

const roleRights = new Map();

roleRights.set(roles[0], ['manageProfile']);
roleRights.set(roles[1], ['getUsers','manageAdmin','manageProfile']);
roleRights.set(roles[2], ['manageProfile']);
roleRights.set(roles[3], ['manageProfile']);
roleRights.set(roles[4], ['manageProfile']);

module.exports = {
  roles,
  roleRights,
};
