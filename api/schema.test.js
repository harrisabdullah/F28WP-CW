const { testSchema, _ } = require("./schema");

const mockOver1 = jest.fn(x => x > 1);
const mockBoolTrue = jest.fn(x => x);

const schema = {
    'over1': mockOver1,
    'boolTrue': mockBoolTrue
}

afterEach(() => {
  jest.clearAllMocks();
});

test('schema pass strict', () => {
    const obj = {
        over1: 3,
        boolTrue: true
    }

    expect(testSchema(schema, obj, true)).toBe(true);

    expect(mockOver1.mock.calls).toHaveLength(1);
    expect(mockBoolTrue.mock.calls).toHaveLength(1);
    
    expect(mockOver1.mock.calls[0][0]).toBe(3);
    expect(mockBoolTrue.mock.calls[0][0]).toBe(true);
})

test('schema pass non-strict', () => {
    const obj = {
        over1: 3
    }

    expect(testSchema(schema, obj, false)).toBe(true);

    expect(mockOver1.mock.calls).toHaveLength(1);
    
    expect(mockOver1.mock.calls[0][0]).toBe(3);
})


test('schema missing feilds fail', () => {
    const obj = {
        over1: 3
    }

    expect(testSchema(schema, obj, true)).toBe(false);

    expect(mockOver1.mock.calls).toHaveLength(1);
    
    expect(mockOver1.mock.calls[0][0]).toBe(3);
})

test('schema extra fields fail strict', () => {
    const obj = {
        over1: 3,
        stuffs: 1,
    }

    expect(testSchema(schema, obj, true)).toBe(false);
})

test('schema extra fields fail non-strict', () => {
    const obj = {
        over1: 3,
        stuffs: 1,
    }

    expect(testSchema(schema, obj, false)).toBe(false);
})

test('schema fail non-strict', () => {
    const obj = {
        over1: 0,
    }

    expect(testSchema(schema, obj, false)).toBe(false);
})

test('schema fail strict', () => {
    const obj = {
        over1: 0,
    }

    expect(testSchema(schema, obj, true)).toBe(false);
})

test('schema fails with empty object in strict mode', () => {
    const obj = {}

    expect(testSchema(schema, obj, true)).toBe(false);
})

test('schema fails with empty object in non-strict mode', () => {
    const obj = {}

    expect(testSchema(schema, obj, false)).toBe(true);
})
