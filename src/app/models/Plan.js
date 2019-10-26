/* title (nome do plano);
duration (duração em número de meses);
price (preço mensal do plano);
created_at;
updated_at; */

import Sequelize, { Model } from 'sequelize';

class Plan extends Model {
  static init (sequelize) {
    super.init(
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        title: Sequelize.STRING,
        duration: Sequelize.INTEGER,
        price: Sequelize.INTEGER
      },
      {
        tableName: "plans",
        createdAt: "created_at",
        updatedAt: "updated_at",
        sequelize
      }
    );

    return this;
  }
}

export default Plan;
