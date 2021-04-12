import { SimpleOpeningHours } from '../src/simpleOpeningHours';

test('toString() test', () => {
  const openingHours = new SimpleOpeningHours('Mo-Sa 06:00-14:00');

  const stringified = openingHours.toReadableString();
  expect(stringified).toEqual(
    'Monday 06:00-14:00\nTuesday 06:00-14:00\nWednesday 06:00-14:00\nThursday 06:00-14:00\nFriday 06:00-14:00\nSaturday 06:00-14:00\nSunday Closed',
  );
});
