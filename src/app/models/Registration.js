import Sequelize, { Model } from 'sequelize';

class Registration extends Model {
  static init (sequelize) {
    super.init(
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },

        start_date: Sequelize.DATE,
        end_date: Sequelize.DATE,
        price: Sequelize.INTEGER
      },
      {
        tableName: "registrations",
        createdAt: "created_at",
        updatedAt: "updated_at",
        sequelize
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Students, { foreignKey: 'student_id' });
    this.belongsTo(models.Plan, { foreignKey: 'plan_id' });
  }

}

export default Registration;
