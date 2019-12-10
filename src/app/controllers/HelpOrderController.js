import Sequelize from 'sequelize';
import HelpOrder from "../models/HelpOrder";
import Student from '../models/Students';
import Mail from '../../lib/Mail';

class HelpOrderController {

  async index(req, res) {

    const { id } = req.params;

    if (id) {
      return res.json(await HelpOrder.findOne({ where: { id } }));
    }
    else
    {
      return res.json(await HelpOrder.findAll({
        attributes: ['id'],
        include: [
          {
            model: Student,
            attributes: ['nome']
          }
        ]
      }));
    }
  }

  async store(req, res) {

    const { id } = req.params;
    const { question } = req.body;

    const studentExists = await Students.findOne({ where: { id } });

    if (!studentExists) {
      return res.status(400).json({error: 'Aluno não encontrado'});
    }

    await HelpOrder.create({
      question,
      student_id: id
    });

    return res.json('Pedido de auxílio cadastrado');
  }

  async update(req, res) {
    const { id } = req.params;
    const { answer } = req.body;

    const helpOrder = await HelpOrder.findOne({ where: { id } });

    if (!helpOrder) {
      return res.status(400).json({error: 'Pedido de auxílio não encontrado'});
    }

    await HelpOrder.update({
      answer,
      answer_at: new Date()
      },
      {
        where: { id }
      }
    );

    const student = await Students.findOne({
       where: { id:helpOrder.student_id }
      });

    await Mail.sendMail({
      to: `${student.nome} <${student.email}>`,
      subject: 'Resposta do pedido de auxílio',
      template: 'answer',
      context: {
        aluno: student.nome,
        pergunta: helpOrder.question,
        resposta: answer
      }
    });

    return res.json('Pedido de auxílio alterado');
  }
}

export default new HelpOrderController();
