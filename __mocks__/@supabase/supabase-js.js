// Create a chainable query builder mock
const createQueryBuilder = () => {
  const queryBuilder = {
    select: jest.fn(() => queryBuilder),
    insert: jest.fn(() => queryBuilder),
    update: jest.fn(() => queryBuilder),
    delete: jest.fn(() => queryBuilder),
    eq: jest.fn(() => queryBuilder),
    single: jest.fn(() => Promise.resolve({ data: null, error: null })),
    order: jest.fn(() => queryBuilder),
    limit: jest.fn(() => queryBuilder),
    // Add any other query methods as needed
  };
  return queryBuilder;
};

const mockSupabase = {
  createClient: jest.fn(() => ({
    auth: {
      getUser: jest.fn(),
      signIn: jest.fn(),
      signOut: jest.fn(),
      onAuthStateChange: jest.fn(),
    },
    from: jest.fn(() => createQueryBuilder()),
    rpc: jest.fn(),
  })),
};

module.exports = mockSupabase;
