import { OpeningHours as OH } from '../src/openingHours';
test('classic cases', () => {
  // 2021-04-20 => tuesday
  expect(
    new OH(
      'Mo 11:00-13:00,18:00-22:00;  We 11:00-13:00,18:00-22:00; Th 11:00-13:00,18:00-22:00; Fr 11:00-13:00,18:00-22:00; Sa 11:00-13:00,18:00-22:00',
    ).checkOpeningTime(new Date('2021-04-20 15:00')),
  ).toMatchObject({
    open: false,
    openAt: '11:00',
    openUntil: null,
    weekDay: 'wednesday',
    isTomorrow: true,
  });
  // 2021-04-20 => tuesday
  expect(
    new OH(
      'Mo 11:00-13:00,18:00-22:00; Th 11:00-13:00,18:00-22:00; Fr 11:00-13:00,18:00-22:00; Sa 11:00-13:00,18:00-22:00',
    ).checkOpeningTime(new Date('2021-04-20 15:00')),
  ).toMatchObject({
    open: false,
    openAt: '11:00',
    openUntil: null,
    weekDay: 'thirsday',
    isTomorrow: false,
  });
  // 2016-10-01 => tuesday
  expect(
    new OH(
      'Mo 11:00-13:00,18:00-22:00; Tu 11:00-13:00,18:00-22:00; Fr 11:00-13:00,18:00-22:00; Sa 11:00-13:00,18:00-22:00',
    ).checkOpeningTime(new Date('2021-04-20 11:00')),
  ).toMatchObject({
    open: true,
    openAt: null,
    openUntil: '13:00',
    weekDay: null,
    isTomorrow: false,
  });
  expect(
    new OH(
      'Mo 11:00-13:00,18:00-22:00; Tu 11:00-13:00,18:00-02:00; Fr 11:00-13:00,18:00-22:00; Sa 11:00-13:00,18:00-22:00',
    ).checkOpeningTime(new Date('2021-04-20 11:00')),
  ).toMatchObject({
    open: true,
    openAt: null,
    openUntil: '02:00',
    weekDay: null,
    isTomorrow: true,
  });
});
