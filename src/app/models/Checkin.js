import Sequelize, { Model } from 'sequelize';

class Checkin extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
      },
      {
        tableName: "checkins",
        createdAt: "created_at",
        updatedAt: "updated_at",
        sequelize
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Students, { foreignKey: 'student_id' })
  };

}

export default Checkin;
