import { OpeningHours as OH } from '../src/openingHours';
test('classic cases', () => {
  // 2021-04-20 => tuesday
  expect(
    new OH(
      'Mo 11:00-13:00,18:00-22:00;  We 11:00-13:00,18:00-22:00; Th 11:00-13:00,18:00-22:00; Fr 11:00-13:00,18:00-22:00; Sa 11:00-13:00,18:00-22:00',
    ).getFullStatusOfDay(new Date('2021-04-20 15:00')),
  ).toMatchObject({
    open: false,
    openUntil: null,
    nextReopening: {
      hour: '11:00',
      day: 'we',
      opensInDay: 1,
    },
  });
  expect(
    new OH(
      'Mo 11:00-13:00,18:00-22:00; Th 11:00-13:00,18:00-22:00; Fr 11:00-13:00,18:00-22:00; Sa 11:00-13:00,18:00-22:00',
    ).getFullStatusOfDay(new Date('2021-04-20 15:00')),
  ).toMatchObject({
    open: false,
    openUntil: null,
    nextReopening: {
      hour: '11:00',
      day: 'th',
      opensInDay: 2,
    },
  });
  expect(
    new OH(
      'Mo 11:00-13:00,18:00-22:00; Tu 11:00-13:00,18:00-22:00; Th 11:00-13:00,18:00-22:00; Fr 11:00-13:00,18:00-22:00; Sa 11:00-13:00,18:00-22:00',
    ).getFullStatusOfDay(new Date('2021-04-20 09:00')),
  ).toMatchObject({
    open: false,
    openUntil: null,
    nextReopening: {
      hour: '11:00',
      day: 'tu',
      opensInDay: 0,
    },
  });
  expect(
    new OH(
      'Mo 11:00-13:00,18:00-22:00; Tu 11:00-13:00,18:00-22:00; Fr 11:00-13:00,18:00-22:00; Sa 11:00-13:00,18:00-22:00',
    ).getFullStatusOfDay(new Date('2021-04-20 13:00')),
  ).toMatchObject({
    open: true,
    openUntil: '13:00',
    nextReopening: null,
  });
  expect(
    new OH(
      'Mo 11:00-13:00,18:00-22:00; Tu 11:00-13:00,17:00-02:00; Fr 11:00-13:00,18:00-22:00; Sa 11:00-13:00,18:00-22:00',
    ).getFullStatusOfDay(new Date('2021-04-20 19:00')),
  ).toMatchObject({
    open: true,
    openUntil: '02:00',
    nextReopening: null,
  });
});
