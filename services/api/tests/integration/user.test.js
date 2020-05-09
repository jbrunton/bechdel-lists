const models = require('../../models');

const User = models.User;

describe('integration test User', () => {
  test('create', async () => {
    const user = await User.create({
      name: 'My Name',
      email: 'my.email@example.com'
    });
    expect(user.getExcludingPII()).toStrictEqual({ id: null });  
  })
});
