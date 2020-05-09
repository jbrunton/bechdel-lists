const models = require('../../models');

const User = models.User;

describe('integration test User', () => {
  test('excludingPII', () => {
    const user = User.build({
      name: 'My Name',
      email: 'my.email@example.com'
    });
    expect(user.getExcludingPII()).toStrictEqual({ id: null });  
  })

  test('create', async () => {
    const user = await User.create({
      name: 'My Name',
      email: 'my.email@example.com'
    });
    expect(user.getExcludingPII()).toStrictEqual({ id: null });  
  })
});
