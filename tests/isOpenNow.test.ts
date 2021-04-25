import { OpeningHours as OH } from '../src/openingHours';
import MockDate from 'mockdate';
// You can use https://dencode.com/date to check the week day of a date

test('isOpenNow', () => {
  const openingHours = 'Mo-Su 10:00-19:00';

  MockDate.set('2000-04-22T16:00:00Z');
  expect(new OH(openingHours).isOpenNow()).toBe(true);

  MockDate.set('2000-04-22T20:00:00Z');
  expect(new OH(openingHours).isOpenNow()).toBe(false);

  MockDate.reset();
});

test('isOpenNow with utcOffset', () => {
  const openingHours = 'Mo-Su 10:00-19:00';
  let utcOffset = 0;

  MockDate.set('2000-04-22T16:00:00-04:00'); // it's 20h where user is
  expect(new OH(openingHours).isOpenNow()).toBe(false);

  MockDate.set('2000-04-22T16:00:00-04:00');
  utcOffset = -4 * 60; // we apply same offset to the provided opening hours, so in reality establishment is open from 14 to 23
  expect(new OH(openingHours).isOpenNow(utcOffset)).toBe(true);

  MockDate.set('2000-04-22T16:00:00+04:00'); // it's 12h where user is
  expect(new OH(openingHours).isOpenNow()).toBe(true);

  MockDate.set('2000-04-22T16:00:00+04:00');
  utcOffset = 4 * 60; // we apply same offset: establishment is open from 6 to 15
  expect(new OH(openingHours).isOpenNow(utcOffset)).toBe(true);

  MockDate.reset();
});
