// Create a chainable query builder mock
const defaultResponse = { data: null, error: null };
const createQueryBuilder = () => {
  const queryBuilder = {
    // core DML
    select: jest.fn(() => queryBuilder),
    insert: jest.fn(() => queryBuilder),
    update: jest.fn(() => queryBuilder),
    delete: jest.fn(() => queryBuilder),
    // filters
    eq: jest.fn(() => queryBuilder),
    // transformations / pagination / ordering
    order: jest.fn(() => queryBuilder),
    limit: jest.fn(() => queryBuilder),
    range: jest.fn(() => queryBuilder),
    // result helpers
    single: jest.fn(() => Promise.resolve(defaultResponse)),
    maybeSingle: jest.fn(() => Promise.resolve(defaultResponse)),
    throwOnError: jest.fn(() => queryBuilder),
    // thenable behavior (supabase builders are thenables)
    then: jest.fn((onFulfilled, onRejected) =>
      Promise.resolve(defaultResponse).then(onFulfilled, onRejected)
    ),
    catch: jest.fn((onRejected) =>
    from: jest.fn(() => createQueryBuilder()),
    rpc: jest.fn(() => createQueryBuilder()),
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
