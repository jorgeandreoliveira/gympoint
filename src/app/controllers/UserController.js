import * as Yup from 'yup';
import User from '../models/User';

class UserController {
  async store(req, res) {
    const schema = yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .required()
        .min(6)
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação' });
    }

    const userExists = await User.findOne({ email:req.body.email });

    if (userExists) {
      return res.status(400).json({
        error: 'Usuário já existe com o e-mail informado'
      });
    }

    const { id, name, email } = await User.create(req.body);

    return res.json({
      id,
      name,
      email
    });
  }

  async update(req, res){
    return res.json()
  }
}

export default new UserController();
