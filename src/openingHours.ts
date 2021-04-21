export interface OpeningHoursData {
  su: string[];
  mo: string[];
  tu: string[];
  we: string[];
  th: string[];
  fr: string[];
  sa: string[];
  ph: string[];
}

const SIMPLE_DAYS_NAMES = ['su', 'mo', 'tu', 'we', 'th', 'fr', 'sa'];

export interface NextOpeningDay {
  day: string;
  opensInDay: number;
}

export interface NextReopening {
  hour: string;
  day: string;
  opensInDay: number;
}

export interface GetFullOpeningTimeStatus {
  open: boolean;
  openUntil: string | null;
  nextReopening: NextReopening | null;
}

export interface FormatHours {
  date: Date;
  hour: string;
}

export class OpeningHours {
  private MAX_CLOSE_TIME = '24:00';
  private MIN_OPEN_TIME = '00:00';

  private openingHours: OpeningHoursData = {
    su: [],
    mo: [],
    tu: [],
    we: [],
    th: [],
    fr: [],
    sa: [],
    ph: [],
  };

  /**
   * Creates the OpeningHours Object with OSM opening_hours string
   */
  constructor(stringOpeningHours: string) {
    this.parse(stringOpeningHours);
  }

  /**
   * returns the OpeningHours Object
   */
  public getTable(): OpeningHoursData {
    return this.openingHours;
  }

  /**
   * Returns if the OpeningHours match on given Date
   */
  public isOpenOn(date: Date): boolean {
    let today = date.getDay();
    let todayTime = this.formatTime(date);

    let times = this.getTimesOfDay(today);

    for (let i = 0; i < times.length; i++) {
      let timeSlots = this.geTimeSlots(times[i]);
      if (
        this.compareTime(todayTime, timeSlots[0]) != -1 &&
        this.compareTime(timeSlots[1], todayTime) != -1
      ) {
        return true;
      }
    }

    if (this.isCurrentlyOnNightServiceOfYesterday(date)) {
      return true;
    }

    return false;
  }

  private geTimeSlots(time: string): [string, string] {
    if (time.includes('+')) {
      return [time.split('+')[0], this.MAX_CLOSE_TIME];
    }
    const timeSlots = time.split('-');

    if (this.isNightlyService(timeSlots[0], timeSlots[1])) {
      return [timeSlots[0], this.MAX_CLOSE_TIME];
    }

    return [timeSlots[0], timeSlots[1]];
  }

  private isCurrentlyOnNightServiceOfYesterday(date: Date): boolean {
    const yesterdayTimes = this.getTimesOfDay(date.getDay() - 1);
    if (yesterdayTimes.length === 0) {
      return false;
    }

    let yesterdayLastTimeRange = yesterdayTimes[yesterdayTimes.length - 1].split('-');
    if (
      this.isNightlyService(yesterdayLastTimeRange[0], yesterdayLastTimeRange[1]) &&
      this.compareTime(yesterdayLastTimeRange[1], this.formatTime(date)) !== -1 &&
      this.compareTime(this.formatTime(date), this.MIN_OPEN_TIME) !== -1
    ) {
      return true;
    }

    return false;
  }

  /**
   * returns if the OpeningHours match now
   */
  public isOpenNow(): boolean {
    return this.isOpenOn(new Date());
  }

  /**
   * Send more information about the current opening status, the next day that it will be opened...
   */
  public getFullOpeningTimeStatus = (date: Date): GetFullOpeningTimeStatus => {
    const isOpenNow = this.isOpenOn(date);
    const allHours = this.getTable();
    const dayIndex = date.getDay();
    const daySimpleIndex = SIMPLE_DAYS_NAMES[dayIndex];
    const todayHours = allHours[daySimpleIndex];

    if (!todayHours || todayHours.length === 0) {
      return {
        open: false,
        openUntil: null,
        nextReopening: this.getNextReopening(allHours, date),
      };
    }

    const formatHours: FormatHours[] = this.serializeHoursOfDay(todayHours);

    if (!isOpenNow) {
      const hour = this.opensAt(formatHours, date, undefined);
      if (hour === 'close') {
        return {
          open: false,
          openUntil: null,
          nextReopening: this.getNextReopening(allHours, date),
        };
      }
      return {
        open: false,
        openUntil: null,
        nextReopening: {
          hour,
          day: SIMPLE_DAYS_NAMES[date.getDay()],
          opensInDay: 0,
        },
      };
    }
    return {
      open: true,
      openUntil: this.openUntil(formatHours, date),
      nextReopening: null,
    };
  };

  public getTodayFullOpeningTimeStatus = () => {
    return this.getFullOpeningTimeStatus(new Date());
  };

  /**
   * Returns the next closing hours
   */
  private openUntil = (formatHours: FormatHours[], date: Date): string => {
    if (formatHours.length > 1) {
      const now = this.constructDateFromTime(`${date.getHours()}:${date.getMinutes()}`);
      for (let i = 1; i < formatHours.length; i = i + 2) {
        if (now < formatHours[i].date || i === formatHours.length - 1) {
          return formatHours[i].hour;
        }
      }
    }
    return '24/7';
  };

  /**
   * Returns the next opening hours
   */
  private opensAt = (
    formatHours: FormatHours[],
    date: Date,
    nextDay: string | undefined,
  ): string => {
    if (formatHours.length > 1) {
    }
    const now = this.constructDateFromTime(`${date.getHours()}:${date.getMinutes()}`);
    if (nextDay) {
      return formatHours[0].hour;
    }
    for (let i = 0; i < formatHours.length - 1; i = i + 2) {
      if (now < formatHours[i].date) {
        return formatHours[i].hour;
      }
    }
    return 'close';
  };

  /**
   * Returns next day open
   */
  private getNextOpeningDay(date: Date): NextOpeningDay {
    const today = date.getDay();
    let times;
    let i = today;

    for (let key in this.openingHours) {
      i = i === 7 ? 0 : i + 1;
      times = this.getTimesOfDay(i);
      if (times.length > 0) {
        times = this.openingHours[key];
        break;
      }
    }
    return {
      day: SIMPLE_DAYS_NAMES[i],
      opensInDay: i - today,
    };
  }

  /**
   * Returns format response wit the time and the next opening day
   */
  private getNextReopening = (allHours: OpeningHoursData, date: Date): NextReopening | null => {
    const nextDay: NextOpeningDay = this.getNextOpeningDay(date);
    const nextDayHours = allHours[nextDay.day];
    if (!nextDayHours || nextDayHours.length === 0) {
      return null;
    }

    const formatNextDayHours: FormatHours[] = this.serializeHoursOfDay(nextDayHours);

    const hour = this.opensAt(formatNextDayHours, date, nextDay.day);
    return {
      hour,
      day: nextDay.day,
      opensInDay: nextDay.opensInDay,
    };
  };

  /**
   * Serialize hours of day to an array
   */
  private serializeHoursOfDay = (dayHours: string[]): FormatHours[] => {
    const formatHours: FormatHours[] = [];
    dayHours.map(todayHour =>
      todayHour
        .split('-')
        .map(hour => formatHours.push({ date: this.constructDateFromTime(hour), hour })),
    );
    return formatHours;
  };

  /**
   * Parses the input and creates openingHours Object
   */
  private parse(inp) {
    const parts = this.splitHard(this.simplify(inp));

    parts.forEach(part => {
      this.parseHardPart(part);
    });
  }

  private simplify(input: string): string {
    if (input === '24/7') {
      input = 'mo-su 00:00-24:00; ph 00:00-24:00';
    }
    input = input.toLocaleLowerCase();
    input = input.trim();
    input = input.replace(/ +(?= )/g, ''); //replace double spaces

    input = input.replace(' -', '-');
    input = input.replace('- ', '-');

    input = input.replace(' :', ':');
    input = input.replace(': ', ':');

    input = input.replace(' ,', ',');
    input = input.replace(', ', ',');

    input = input.replace(' ;', ';');
    input = input.replace('; ', ';');

    return input;
  }

  /**
   * Get formatted time for date
   */
  private formatTime(date: Date): string {
    return date.getHours() + ':' + date.getMinutes();
  }

  /**
   * Split on ;
   */
  private splitHard(inp: string): string[] {
    return inp.split(';');
  }

  private parseHardPart(part: string) {
    if (part == '24/7') {
      part = 'mo-su 00:00-24:00';
    }
    let segments = part.split(/\ |\,/);

    let tempData: Record<string, any> = {};
    let days: string[] = [];
    let times: string[] = [];

    segments.forEach(segment => {
      if (this.checkDay(segment)) {
        if (times.length == 0) {
          days = days.concat(this.parseDays(segment));
        } else {
          //append
          days.forEach(day => {
            if (tempData[day]) {
              tempData[day] = tempData[day].concat(times);
            } else {
              tempData[day] = times;
            }
          });
          days = this.parseDays(segment);
          times = [];
        }
      }
      if (this.checkTime(segment)) {
        if (segment == 'off') {
          times = [];
        } else {
          times.push(segment);
        }
      }
    });

    //commit last times to it days
    days.forEach(day => {
      if (tempData[day]) {
        tempData[day] = tempData[day].concat(times);
      } else {
        tempData[day] = times;
      }
    });

    //apply data to main obj
    for (let key in tempData) {
      this.openingHours[key] = tempData[key];
    }
  }

  private parseDays(part: string): string[] {
    part = part.toLowerCase();

    let days: string[] = [];
    let softParts = part.split(',');

    softParts.forEach(part => {
      let rangeCount = (part.match(/\-/g) || []).length;
      if (rangeCount == 0) {
        days.push(part);
      } else {
        days = days.concat(this.calcDayRange(part));
      }
    });

    return days;
  }

  /**
   * Calculates the days in range "mo-we" -> ["mo", "tu", "we"]
   */
  private calcDayRange(range: string): string[] {
    let def = {
      su: 0,
      mo: 1,
      tu: 2,
      we: 3,
      th: 4,
      fr: 5,
      sa: 6,
    };

    let rangeElements = range.split('-');

    let dayStart = def[rangeElements[0]];
    let dayEnd = def[rangeElements[1]];

    let numberRange = this.calcRange(dayStart, dayEnd, 6);
    let outRange: string[] = [];

    numberRange.forEach(n => {
      for (let key in def) {
        if (def[key] == n) {
          outRange.push(key);
        }
      }
    });
    return outRange;
  }

  /**
   * Creates a range between two number.
   * if the max value is 6 a range bewteen 6 and 2 is 6, 0, 1, 2
   */
  private calcRange(min: number, max: number, maxVal: number): number[] {
    if (min == max) {
      return [min];
    }
    let range = [min];
    let rangePoint = min;
    while (rangePoint < (min < max ? max : maxVal)) {
      rangePoint++;
      range.push(rangePoint);
    }
    if (min > max) {
      //add from first in list to max value
      range = range.concat(this.calcRange(0, max, maxVal));
    }

    return range;
  }

  /**
   * Check if string is time range
   */
  private checkTime(inp: string): boolean {
    //e.g. 09:00+
    if (inp.match(/[0-9]{1,2}:[0-9]{2}\+/)) {
      return true;
    }
    //e.g. 08:00-12:00
    if (inp.match(/[0-9]{1,2}:[0-9]{2}\-[0-9]{1,2}:[0-9]{2}/)) {
      return true;
    }
    //off
    if (inp.match(/off/)) {
      return true;
    }
    return false;
  }

  /**
   * check if string is day or dayrange
   */
  private checkDay(inp: string): boolean {
    let days = ['mo', 'tu', 'we', 'th', 'fr', 'sa', 'su', 'ph'];
    if (inp.match(/\-/g)) {
      let ranges = inp.split('-');
      if (days.indexOf(ranges[0]) !== -1 && days.indexOf(ranges[1]) !== -1) {
        return true;
      }
    } else {
      if (days.indexOf(inp) !== -1) {
        return true;
      }
    }
    return false;
  }

  /**
   * Compares to timestrings e.g. "18:00"
   * if time1 > time2 -> 1
   * if time1 < time2 -> -1
   * if time1 == time2 -> 0
   */
  private compareTime(time1: string, time2: string) {
    const date1 = this.constructDateFromTime(time1);
    const date2 = this.constructDateFromTime(time2);

    if (date1 > date2) {
      return 1;
    }
    if (date1 < date2) {
      return -1;
    }
    return 0;
  }

  private isNightlyService(openingTime: string, closingTime: string) {
    const date1 = this.constructDateFromTime(openingTime);
    const date2 = this.constructDateFromTime(closingTime);

    if (date1 > date2) {
      return true;
    }
    return false;
  }

  private constructDateFromTime(time: string): Date {
    const constructedDate = new Date('2016-01-01');

    const parsedOpeningTime = this.getHoursAndMinutes(time);
    constructedDate.setHours(parsedOpeningTime[0], parsedOpeningTime[1]);

    return constructedDate;
  }

  private getHoursAndMinutes(time: string): [number, number] {
    if (!time) {
      return [23, 59];
    }

    const hoursAndMinutes = time.split(':');

    if (
      hoursAndMinutes.length !== 2 ||
      Number.isNaN(hoursAndMinutes[0]) ||
      Number.isNaN(hoursAndMinutes[1])
    ) {
      return [23, 59];
    }

    return [parseInt(hoursAndMinutes[0], 10), parseInt(hoursAndMinutes[1], 10)];
  }

  private getTimesOfDay(day: number): string[] {
    if (day === -1) {
      day = 6;
    }
    let i = 0;
    let times: string[] = [];
    for (let key in this.openingHours) {
      if (i == day) {
        times = this.openingHours[key];
      }
      i++;
    }
    return times;
  }

  public toReadableString(): string {
    const weekDays = {
      mo: 'Monday',
      tu: 'Tuesday',
      we: 'Wednesday',
      th: 'Thursday',
      fr: 'Friday',
      sa: 'Saturday',
      su: 'Sunday',
    };

    return Object.keys(weekDays)
      .map(dayKey => {
        if (this.openingHours[dayKey] && this.openingHours[dayKey].length) {
          return weekDays[dayKey] + ' ' + this.openingHours[dayKey].join('\t');
        } else {
          return weekDays[dayKey] + ' Closed';
        }
      })
      .join('\n');
  }
}
