import { OpeningHours as OH } from '../src/openingHours';
test('classic cases', () => {
  // 2021-04-20 => tuesday
  expect(
    new OH(
      'Mo 11:00-13:00,18:00-22:00;  We 11:00-13:00,18:00-22:00; Th 11:00-13:00,18:00-22:00; Fr 11:00-13:00,18:00-22:00; Sa 11:00-13:00,18:00-22:00',
    ).getFullOpeningTimeStatus(new Date('2021-04-20 15:00')),
  ).toMatchObject({
    open: false,
    opensAt: '11:00',
    openUntil: null,
    weekDay: 'we',
    reopensInDay: 1,
  });
  expect(
    new OH(
      'Mo 11:00-13:00,18:00-22:00; Th 11:00-13:00,18:00-22:00; Fr 11:00-13:00,18:00-22:00; Sa 11:00-13:00,18:00-22:00',
    ).getFullOpeningTimeStatus(new Date('2021-04-20 15:00')),
  ).toMatchObject({
    open: false,
    opensAt: '11:00',
    openUntil: null,
    weekDay: 'th',
    reopensInDay: 2,
  });
  expect(
    new OH(
      'Mo 11:00-13:00,18:00-22:00; Tu 11:00-13:00,18:00-22:00; Th 11:00-13:00,18:00-22:00; Fr 11:00-13:00,18:00-22:00; Sa 11:00-13:00,18:00-22:00',
    ).getFullOpeningTimeStatus(new Date('2021-04-20 09:00')),
  ).toMatchObject({
    open: false,
    opensAt: '11:00',
    openUntil: null,
    weekDay: null,
    reopensInDay: 0,
  });
  expect(
    new OH(
      'Mo 11:00-13:00,18:00-22:00; Tu 11:00-13:00,18:00-22:00; Fr 11:00-13:00,18:00-22:00; Sa 11:00-13:00,18:00-22:00',
    ).getFullOpeningTimeStatus(new Date('2021-04-20 11:00')),
  ).toMatchObject({
    open: true,
    opensAt: null,
    openUntil: '13:00',
    weekDay: null,
    reopensInDay: 0,
  });
  expect(
    new OH(
      'Mo 11:00-13:00,18:00-22:00; Tu 11:00-13:00,18:00-02:00; Fr 11:00-13:00,18:00-22:00; Sa 11:00-13:00,18:00-22:00',
    ).getFullOpeningTimeStatus(new Date('2021-04-20 19:00')),
  ).toMatchObject({
    open: true,
    opensAt: null,
    openUntil: '02:00',
    weekDay: null,
    reopensInDay: 1,
  });
});
