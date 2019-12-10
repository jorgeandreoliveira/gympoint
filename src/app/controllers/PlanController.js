import * as Yup from 'yup';

import Plans from '../models/Plan';

class PlanController {

  async index (req, res) {

    const { id } = req.params;

    let plans = [];

    if(id) {
      plans = await Plans.findByPk(id);
    }
    else {
      plans = await Plans.findAll();
    }
    return res.json(plans);
  };

  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      duration: Yup.string().required(),
      price: Yup.number().integer().required()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação' });
    }

    const planExists = await Plans.findOne({ where: {title: req.body.title } });

    if (planExists) {
      return res.status(400).json({ error: 'Plano já cadastrado' });
    }

    const { id, title, duration, price } = await Plans.create(req.body);

    return res.json({
      id,
      title,
      duration,
      price
    });
  }

  async update(req, res) {

    const { title } = req.body;
    const { id } = req.params;

    const plan = await Plans.findByPk(id);

    if (!plan) {
      return res.status(400).json({ error: 'Plano não encontrado' });
    }

    if (title != plan.title) {
      const planExists = await Plans.findOne({where: { title }});

      if (planExists) {
        return res.status(400).json({
           error: 'Plano já existe com o título informado'
        });
      }
    }

    const _plan = await plan.update(req.body);

    return res.json(_plan);
  }

  async destroy (req, res) {
    const { id } = req.params;

    const plan = await Plans.findByPk(id);

    if (!plan) {
      return res.status(400).json({ error: 'Plano não encontrado' });
    }

    await plan.destroy();

    return res.json(await Plans.findAll());
  }
}

export default new PlanController();
