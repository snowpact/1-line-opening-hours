import { SimpleOpeningHours } from '../src';

test('table check', () => {
  const table = new SimpleOpeningHours('Mo-Sa 06:00-22:00').getTable();

  expect(table).toEqual({
    su: [],
    mo: ['06:00-22:00'],
    tu: ['06:00-22:00'],
    we: ['06:00-22:00'],
    th: ['06:00-22:00'],
    fr: ['06:00-22:00'],
    sa: ['06:00-22:00'],
    ph: [],
  });
});

test('complex time table check', () => {
  const table = new SimpleOpeningHours('Mo-Sa 06:00-14:00,15:00-22:00').getTable();

  expect(table).toEqual({
    su: [],
    mo: ['06:00-14:00', '15:00-22:00'],
    tu: ['06:00-14:00', '15:00-22:00'],
    we: ['06:00-14:00', '15:00-22:00'],
    th: ['06:00-14:00', '15:00-22:00'],
    fr: ['06:00-14:00', '15:00-22:00'],
    sa: ['06:00-14:00', '15:00-22:00'],
    ph: [],
  });
});

test('complex time table check with pass midnight', () => {
  const table = new SimpleOpeningHours('Mo-Sa 06:00-14:00,15:00-01:00').getTable();

  expect(table).toEqual({
    su: [],
    mo: ['06:00-14:00', '15:00-01:00'],
    tu: ['06:00-14:00', '15:00-01:00'],
    we: ['06:00-14:00', '15:00-01:00'],
    th: ['06:00-14:00', '15:00-01:00'],
    fr: ['06:00-14:00', '15:00-01:00'],
    sa: ['06:00-14:00', '15:00-01:00'],
    ph: [],
  });
});
