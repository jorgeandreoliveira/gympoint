import Sequelize, { Model } from 'sequelize';

class HelpOrder extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        question: {
          type: Sequelize.STRING,
          allowNull: false
        },
        answer: {
          type: Sequelize.STRING
        },
        answer_at: {
          type: Sequelize.DATE
        }
      },
      {
        tableName: "help-orders",
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

export default HelpOrder;
