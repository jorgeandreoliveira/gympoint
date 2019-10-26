import * as Yup from 'yup';
import Students from '../models/Students';

class StudentsController {

  async index(req, res) {

    const students = await Students.findAll();

    return res.json(students);
  };

  async store(req, res) {
    const schema = Yup.object().shape({
      nome: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      idade: Yup
        .number()
        .integer()
        .required()
        .positive(),
      peso: Yup
        .number()
        .integer()
        .positive(),
      altura: Yup
        .number()
        .integer()
        .positive()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação' });
    }

    const studentExists = await Students.findOne({
       where: {email: req.body.email }
      });

    if (studentExists) {
      return res.status(400).json({ error: 'Aluno já cadastrado' });
    }

    const { id, nome, email, idade, peso } = await Students.create(req.body);

    return res.json({
      id,
      nome,
      email,
      idade,
      peso
    });
  }

  async update(req, res) {

    const { email } = req.body;
    const { id } = req.params;

    const student = await Students.findByPk(id);

    if (!student) {
      return res.status(400).json({ error: 'Aluno não encontrado' });
    }

    if (email != student.email) {
      const studentExists = await Students.findOne({where: { email }});

      if (studentExists) {
        return res.status(400).json({
           error: 'Aluno já existe com o e-mail informado'
        });
      }
    }

    const _student = await student.update(req.body);

    return res.json(_student);
  }
}

export default new StudentsController();
