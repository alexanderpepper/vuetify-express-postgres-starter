import BaseService from './BaseService'
import api from '../constants/api.js'

class RoleService extends BaseService {
  static all () {
    return this.GET(api.roles)
  }

  static roleMapping (user, role) {
    return this.GET(api.roleMappings, {
      filter: JSON.stringify({
        where: {
          and: [
            { principalId: user.id },
            { roleId: role.id }
          ]
        }
      })
    }).then(roleMappings => roleMappings[0])
  }

  static addRole (user, role) {
    return this.PUT(api.roleMappings, {
      principalType: 'USER',
      principalId: user.id,
      roleId: role.id
    })
  }

  static removeRole (roleMapping) {
    return this.DELETE(api.roleMapping(roleMapping.id))
  }
}

export default RoleService
