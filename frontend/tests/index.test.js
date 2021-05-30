function add(a, b) {
  return a + b;
}

test('test', () => {
  expect(true).toBe(true);
});

test('add', () => {
  expect(add(1, 2)).toBe(3);
  expect(add(10, 20)).toBe(30);
  expect(add(-10, -20)).toBe(-30);
});
