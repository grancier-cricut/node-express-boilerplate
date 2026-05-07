let sequence = 0;

const nextSequence = () => {
  sequence += 1;
  return sequence;
};

module.exports = {
  person: {
    fullName: () => `Test User ${nextSequence()}`
  },
  internet: {
    email: () => `test.user.${nextSequence()}@example.com`
  }
};
