export declare class SimpleOpeningHours {
    /**
     * Creates the OpeningHours Object with OSM opening_hours string
     */
    constructor(inp: string);
    /**
     * returns the OpeningHours Object
     */
    getTable(): Object;
    /**
     * Returns if the OpeningHours match on given Date
     */
    isOpenOn(date: Date): boolean;
    /**
     * returns if the OpeningHours match now
     */
    isOpenNow(): boolean;
    /**
     * Parses the input and creates openingHours Object
     */
    private parse;
    private simplify;
    /**
     * Split on ;
     */
    private splitHard;
    private parseHardPart;
    private parseDays;
    private initOpeningHoursObj;
    /**
     * Calculates the days in range "mo-we" -> ["mo", "tu", "we"]
     */
    private calcDayRange;
    /**
     * Creates a range between two number.
     * if the max value is 6 a range bewteen 6 and 2 is 6, 0, 1, 2
     */
    private calcRange;
    /**
     * Check if string is time range
     */
    private checkTime;
    /**
     * check if string is day or dayrange
     */
    private checkDay;
    /**
     * Compares to timestrings e.g. "18:00"
     * if time1 > time2 -> 1
     * if time1 < time2 -> -1
     * if time1 == time2 -> 0
     */
    private compareTime;
    private openingHours;
}
