const models = require('../../models');

const User = models.User;

describe('integration test User', async () => {
  test('create', async () => {
    const user = await User.create({
      name: 'My Name',
      email: 'my.email@example.com'
    });
    expect(user.get()).toStrictEqual({
      id: user.id,
      name: 'My Name',
      email: 'my.email@example.com',
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    });
    expect(user.getExcludingPII()).toStrictEqual({
      id: user.id,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    });  
  })
});
