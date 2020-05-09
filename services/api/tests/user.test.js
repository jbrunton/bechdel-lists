const models = require('../models');

const User = models.User;

describe('User', () => {
  test('excludingPII', () => {
    const user = User.build({
      name: 'My Name',
      email: 'my.email@example.com'
    });
    expect(user.getExcludingPII()).toStrictEqual({ id: null });  
  })
});
