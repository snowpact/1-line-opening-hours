import { OpeningHours as OH } from '../src/openingHours';

// You can use https://dencode.com/date to check the week day of a date

test('24/7 cases', () => {
  expect(new OH('24/7').isOpenOn(new Date('2016-10-01 18:00'))).toBe(true);
  expect(new OH(' 24/7 ').isOpenOn(new Date('2016-10-01 18:00'))).toBe(true);
  expect(new OH('24/7 ').isOpenOn(new Date('2016-10-01 18:00'))).toBe(true);
});

test('off cases', () => {
  expect(new OH('off').isOpenOn(new Date('2016-10-01 18:00'))).toBe(false);
  expect(new OH(' off').isOpenOn(new Date('2016-10-01 18:00'))).toBe(false);
  expect(new OH('off ').isOpenOn(new Date('2016-10-01 18:00'))).toBe(false);
  expect(new OH(' off ').isOpenOn(new Date('2016-10-01 18:00'))).toBe(false);
});

test('exceeding midnight cases', () => {
  // 2021-04-06 => it's tuesday, and the service should be open from 23:00 monday to 05:00 tuesday
  expect(new OH('Mo 23:00-05:00').isOpenOn(new Date('2021-04-06 02:00'))).toBe(true);
  expect(new OH('Mo-Sa 23:00-05:00').isOpenOn(new Date('2021-04-06 01:00'))).toBe(true);

  // 2021-04-05 => it's monday
  expect(new OH('Mo 23:00-05:00').isOpenOn(new Date('2021-04-05 05:30'))).toBe(false);
  expect(new OH('Mo 23:00-05:00').isOpenOn(new Date('2021-04-05 01:00'))).toBe(true);

  //when is open only monday and check tuesday at 05:30 AM should be close
  expect(new OH('Mo 23:00-05:00').isOpenOn(new Date('2021-04-06 07:30'))).toBe(false);
});

test('plus cases', () => {
  // 2016-10-01 => saturday
  expect(new OH('Sa 09:00+').isOpenOn(new Date('2016-10-01 18:00'))).toBe(true);
  expect(new OH('Sa 09:00+').isOpenOn(new Date('2016-10-02 00:00'))).toBe(false);
  expect(new OH('Sa 09:00+').isOpenOn(new Date('2016-10-01 08:00'))).toBe(false);
});

test('classic cases', () => {
  // 2016-10-01 => saturday
  expect(new OH('Mo-Sa 06:00-22:00').isOpenOn(new Date('2016-10-01 18:00'))).toBe(true);
  expect(new OH('Mo 06:00-22:00').isOpenOn(new Date('2016-10-01 18:00'))).toBe(false);
  expect(new OH('Mo-Sa 09:00+').isOpenOn(new Date('2016-10-01 18:00'))).toBe(true);
  expect(new OH('Mo-Sa 09:00+').isOpenOn(new Date('2016-10-02 18:00'))).toBe(false);
  expect(new OH('Mo-Sa off').isOpenOn(new Date('2016-10-01 18:00'))).toBe(false);
  expect(new OH('Mo-Sa 06:00-22:00').isOpenOn(new Date('2016-10-01 05:00'))).toBe(false);
});

test('weird cases', () => {
  // 2016-10-01 => saturday
  expect(new OH('Mo 23:00-05:00').isOpenOn(new Date('2021-04-06 02:00'))).toBe(true);
});
