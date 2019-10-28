import * as Yup from 'yup';
import Sequelize from 'sequelize';
import Checkin from '../models/Checkin';
import Students from '../models/Students';
import { getDay, addDays, subDays } from 'date-fns';

class CheckinController {

  async index(req, res) {

    const { id } = req.params;

    return res.json(await Checkin.findAll({
      where: {student_id:id}
    }));

  }

  async store(req, res) {

    const { id } = req.params;

    const studentExists = await Students.findOne({ where: { id } });

    if (!studentExists) {
      return res.status(400).json({error: 'Aluno não encontrado'});
    }

    /*
    O aluno só pode fazer 5 checkins dentro de um período de 7 dias corridos.
    1. Buscar o dia da semana do primeiro checkin
    2. Voltar para o data anterior da semana do primeiro checkin
    considerando a data do checkin realizado
    3. Validar desta data até 7 dias corridos
    Ex.:
    1. Primeiro checkin - 28/09/2019 (sábado)
    2. Data checkin - 28/10/2019 - (data anterior - 26/10/2019 (sábado))
    3. Período a ser validado - 26/10/2019 até 03/11/2019 (7 dias)
    */

    const primeiroCheckin = await Checkin.findAll({
      order: [
        ['created_at', 'ASC']
      ],
      attributes: ['created_at'],
      limit: 1
    });

    const dataCheckin = new Date();

    for(let index=1;index<=7;index++) {
      const dataPassada = subDays(dataCheckin, index);

      if (getDay(dataPassada) == getDay(primeiroCheckin[0].created_at)) {
        const datafinal = addDays(dataPassada, 8);

        const checkinNoPeriodo = await Checkin.findAndCountAll({
          where: {
            created_at: {
              [Sequelize.Op.between]: [dataPassada, datafinal]
            }
          }
        });

        if(checkinNoPeriodo.count == 5){
          return res.status(400).json({
            error: 'Excedeu 5 checkins no período de 7 dias'});
        }

      }

    }

    await Checkin.create({
      student_id: id
    });

    return res.json({ message: 'Checkin realizado' });
  }

}

export default new CheckinController();
