import { SimpleOpeningHours as SOH } from '../src';

// You can use https://dencode.com/date to check the week day of a date

const expectTrue = (condition: any) => {
  expect(condition).toBe(true);
};

const expectFalse = (condition: any) => {
  expect(condition).toBe(false);
};

test('24/7 cases', () => {
  expectTrue(new SOH('24/7').isOpenOn(new Date('2016-10-01 18:00')));
  expectTrue(new SOH(' 24/7 ').isOpenOn(new Date('2016-10-01 18:00')));
  expectTrue(new SOH('24/7 ').isOpenOn(new Date('2016-10-01 18:00')));
});

test('off cases', () => {
  expectFalse(new SOH('off').isOpenOn(new Date('2016-10-01 18:00')));
  expectFalse(new SOH(' off').isOpenOn(new Date('2016-10-01 18:00')));
  expectFalse(new SOH('off ').isOpenOn(new Date('2016-10-01 18:00')));
  expectFalse(new SOH(' off ').isOpenOn(new Date('2016-10-01 18:00')));
});

test('exceeding midnight cases', () => {
  // 2021-04-06 => it's tuesday, and the service should be open from 23:00 monday to 05:00 tuesday
  expectTrue(new SOH('Mo 23:00-05:00').isOpenOn(new Date('2021-04-06 01:00')));
  expectTrue(new SOH('Mo-Sa 23:00-05:00').isOpenOn(new Date('2021-04-06 01:00')));

  // 2021-04-05 => it's monday
  expectFalse(new SOH('Mo 23:00-05:00').isOpenOn(new Date('2021-04-05 05:30')));
  expectTrue(new SOH('Mo 23:00-05:00').isOpenOn(new Date('2021-04-05 23:00')));

  //when is open only monday and check tuesday at 05:30 AM should be close
  expectFalse(new SOH('Mo 23:00-05:00').isOpenOn(new Date('2021-04-06 05:30')));
});

test('classic cases', () => {
  // 2016-10-01 => saturday
  expectTrue(new SOH('Mo-Sa 06:00-22:00').isOpenOn(new Date('2016-10-01 18:00')));
  expectFalse(new SOH('Mo 06:00-22:00').isOpenOn(new Date('2016-10-01 18:00')));
  expectTrue(new SOH('Mo-Sa 09:00+').isOpenOn(new Date('2016-10-01 18:00')));
  expectFalse(new SOH('Mo-Sa 09:00+').isOpenOn(new Date('2016-10-02 18:00')));
  expectFalse(new SOH('Mo-Sa off').isOpenOn(new Date('2016-10-01 18:00')));
  expectFalse(new SOH('Mo-Sa 06:00-22:00').isOpenOn(new Date('2016-10-01 05:00')));
  // expectTrue(new SOH('Mo-Sa 06:00-22:00').getTable());
});
