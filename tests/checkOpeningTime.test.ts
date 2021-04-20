import { OpeningHours as OH } from '../src/openingHours';
test('classic cases', () => {
  // 2021-04-20 => monday
  expect(
    new OH(
      'Mo 11:00-13:00,18:00-22:00; Th 11:00-13:00,18:00-22:00; Fr 11:00-13:00,18:00-22:00; Sa 11:00-13:00,18:00-22:00',
    ).checkOpeningTime(new Date('2021-04-20 15:00')),
  ).toMatchObject({ open: false, openAt: '11:00', openUntil: null, weekDay: 'thirsday' });
  // 2016-10-01 => saturday
  expect(
    new OH(
      'Mo 11:00-13:00,18:00-22:00; Tu 11:00-13:00,18:00-22:00; Fr 11:00-13:00,18:00-22:00; Sa 11:00-13:00,18:00-22:00',
    ).checkOpeningTime(new Date('2021-04-20 11:00')),
  ).toMatchObject({ open: true, openAt: null, openUntil: '13:00', weekDay: null });
});
