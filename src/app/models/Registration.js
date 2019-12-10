import Sequelize, { Model } from 'sequelize';
import { isBefore, isAfter } from 'date-fns';

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
        price: Sequelize.INTEGER,
        active: {
          type: Sequelize.VIRTUAL(Sequelize.BOOLEAN, [
            'start_date',
            'end_date',
          ]),
          get() {
            return (
              isBefore(this.get('start_date'), new Date()) &&
              isAfter(this.get('end_date'), new Date())
            );
          },
        },
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
