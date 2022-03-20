module.exports = (sequelize, Sequelize) =>
  sequelize.define('role', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true
    },
    name: {
      type: Sequelize.STRING
    }
  },
  {
    underscored: true,
    freezeTableName: true
  })
