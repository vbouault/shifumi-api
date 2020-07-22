const User = require('../models/user.model.js');

class usersController {
  static async create (req, res) {
    const userExists = await User.userAlreadyExists(req.body.email);
    if (userExists) {
      res.status(400).send({ errorMessage: 'Email already used' });
    } else {
      const clientPayloadInfos = { name: req.body.name, email: req.body.email };
      const clientPayloadPassword = { password: req.body.password };

      const isNotEmptyStirng = (str) => {
        return typeof str === 'string' && str.length > 0;
      };
      if (!isNotEmptyStirng(clientPayloadInfos.name) || !isNotEmptyStirng(clientPayloadInfos.email) || !isNotEmptyStirng(clientPayloadPassword.password)) {
        return res.status(422).send({ errorMessage: 'a required attribute is missing' });
      }

      const errorInfos = User.validateInfos(clientPayloadInfos).error;
      const errorPassword = User.validatePassword(clientPayloadPassword).error;
      if (errorInfos) {
        return res.status(422).send({ errorMessage: errorInfos.message, errorDetails: errorInfos.details });
      }
      if (errorPassword) {
        return res.status(422).send({ errorMessage: errorPassword.message, errorDetails: errorPassword.details });
      }

      const createdUser = await User.create(clientPayloadInfos.name, clientPayloadInfos.email, clientPayloadPassword.password);
      res.status(201).send(createdUser);
    }
  }

  static async findOne (req, res) {
    try {
      const data = await User.findById(req.params.id);
      res.status(200).send(data);
    } catch (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({ errorMessage: `User with id ${req.params.id} not found.` });
      } else {
        console.error(err);
        res.status(500).send({ errorMessage: 'Error retrieving user account details with id ' + req.params.id });
      }
    }
  }
}

module.exports = usersController;
