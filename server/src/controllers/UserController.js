const { User } = require('../models')

module.exports = {
  async getUser (req, res) {
    try {
      await User.findById(req.body.id).then(user => {
        res.send({
          user: user.toJSON()
        })
      })
    } catch (error) {
      res.status(500).send({
        error: error
      })
    }
  },
  async editUser (req, res) {
    try {
      const _user = JSON.parse(req.body.user)
      const _password = JSON.parse(req.body.password)
      console.log(_user)
      await User.findById(_user.id).then(user => {
        user.update({
          name: _user.name ? _user.name : user.name,
          phone: _user.phone ? _user.phone : user.phone,
          email: _user.email ? _user.email : user.email,
          adress: _user.adress ? _user.adress : user.adress,
          status: _user.status ? _user.status : user.status,
          password: _password ? _password : user.password
        }, {
          where: {
            id: _user.id
          },
          individualHooks: true
        }).then(() => {
          res.send({
            user: user.toJSON()
          })
        }).catch(error => {
          res.status(400).send({
            error: error
          })
        })
      })
    } catch (error) {
      res.status(500).send({
        error: 'Error ocured when trying to post the changes on user\'s profile'
      })
    }
  },
  async getUsers (req, res) {
    try {
      await User.findAll({
        where: {
          archived: false,
          type: JSON.parse(req.body.type)
        }
      }).then(users => {
        const _users = []
        users.map(function(user){
          _users.push(user.toJSON())
        })
        res.send({
          users: _users
        })
      })
    } catch (error) {
      res.status(500).send({
        error: 'Error ocured when trying to read users in DB'
      })
    }
  },
  async archiveUser (req, res) {
    try {
      await User.findById(req.body.id).then(_user => {
        _user.archived = true
        _user.status = 'inactive'
        _user.save().then(() => {
          res.send({
            user: _user.toJSON()
          })
        })
      })
    } catch (error) {
      res.status(500).send({
        error: 'Ошибка произошла при попытке архивации пользователя в БД'
      })
    }
  },
  async addUser (req, res) {
    try {
      const user = await User.create(JSON.parse(req.body.user))
      res.send({
        user: user.toJSON()
      })
    } catch (error) {
      res.status(500).send({
        error: 'Такой email уже зарегистрирован!'
      })
    }
  },
  async addEmployee (req, res) {
    try {
      var data = JSON.parse(req.body.user)
      data.UserId = req.body.organization_id
      const user = await User.create(data)
      res.send({
        user: user.toJSON()
      })
    } catch (error) {
      res.status(500).send({
        error: 'Такой email уже зарегистрирован!'
      })
    }
  },
  async getEmployees (req, res) {
    try {
      const users = await User.findAll({
        where: {
          UserId: req.body.id,
          archived: false
        }
      }).then(users => {
        var _users = users.map(function(user) {
          return user.toJSON()
        })
        res.send({
          users: _users
        })
      })
    } catch (error) {
      res.status(500).send({
        error: 'Произошла ошибка при считывании сотрудников из БД'
      })
    }
  }
}
