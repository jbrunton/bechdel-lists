const sequelize = require('../models').sequelize;
afterAll(() => sequelize.close())
