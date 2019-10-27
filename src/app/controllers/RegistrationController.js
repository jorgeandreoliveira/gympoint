import * as Yup from 'yup';
import pt from 'date-fns/locale/pt';
import { addMonths, parseISO, format } from 'date-fns';

import Registration from '../models/Registration';
import Student from '../models/Students';
import Plan from '../models/Plan';

import Mail from '../../lib/Mail';

class RegistrationController {

  async index (req, res) {
    const registrations = await Registration.findAll();

    return res.json(registrations);
  }

  async store(req, res) {

    const schema = Yup.object().shape({
      student_id: Yup.number().integer().required(),
      plan_id: Yup.number().integer().required(),
      start_date: Yup.date().required()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação' });
    }

    const _alunoMatriculado = await Registration.findOne({
      where: {student_id: req.body.student_id}
    });

    if (_alunoMatriculado) {
        return res.status(400).json({ error: 'Aluno já matriculado' });
    }

    const _student = await Student.findByPk(req.body.student_id);
    if (!_student) {
      return res.status(400).json({ error: 'Aluno não encontrado' });
    }

    const _plan = await Plan.findByPk(req.body.plan_id);

    if (!_plan) {
      return res.status(400).json({ error: 'Plano não encontrado' });
    }

    //Cálculo da data de término
    const _dataTermino = addMonths(
      parseISO(req.body.start_date), _plan.duration);

    //Cálculo do preço
    const _preco = _plan.price * _plan.duration;

    const _registration = await Registration.create({
      student_id: req.body.student_id,
      plan_id: req.body.plan_id,
      start_date: req.body.start_date,
      end_date: _dataTermino,
      price: _preco
    });

    await Mail.sendMail({
      to: `${_student.nome} <${_student.email}>`,
      subject: 'Matrícula confirmada',
      template: 'registration',
      context: {
        aluno: _student.nome,
        plano: _plan.title,
        termino: format(_dataTermino, "dd 'de' MMMM 'de' yyyy', às' HH:mm'h'",
          { locale: pt }
        ),
        valor: _preco
      }
    });

    return res.json(_registration);
  }

  async update (req, res) {

    const { id } = req.params;

    const registration = await Registration.findByPk(id);

    if (!registration) {
      return res.status(400).json({ error: 'Matrícula não encontrada' });
    }

    //Aluno trocou de plano
    const { plan_id, start_date } = req.body;

    const _dataInicio = registration.start_date;
    let _dataTermino = registration.end_date;
    let _preco = registration.price;

    if (registration.plan_id != plan_id) {

      const _plan = await Plan.findByPk(plan_id);

      if (!_plan) {
        return res.status(400).json({ error: 'Plano não encontrado' });
      }

      //Cálculo da data de término
      _dataTermino = addMonths(
        parseISO(start_date), _plan.duration);

      //Cálculo do preço
      _preco = _plan.price * _plan.duration;

    }

    //Aluno alterou a data de início
    if (format(registration.start_date, 'yyyy-MM-dd') !=
        format(parseISO(start_date), 'yyyy-MM-dd')) {

      console.log('entrei');
      const _plan = await Plan.findByPk(registration.plan_id);

      //Cálculo da data de término
      _dataTermino = addMonths(
        parseISO(start_date), _plan.duration);

    }

    const _registration = await registration.update({
      plan_id: plan_id,
      start_date: start_date,
      end_date: _dataTermino,
      price: _preco
    });

    return res.json(_registration);
  }

  async destroy(req, res) {
    const { id } = req.params;

    const registration = await Registration.findByPk(id);

    if (!registration) {
      return res.status(400).json({ error: 'Matrícula não encontrada' });
    }

    await registration.destroy();

    return res.json(await Registration.findAll());
  }
}

export default new RegistrationController();
