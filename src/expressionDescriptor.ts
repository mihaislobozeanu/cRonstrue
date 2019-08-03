import { StringUtilities } from "./stringUtilities";
import { CronParser } from "./cronParser";
import { Options } from "./options";

import { Locale } from "./i18n/locale";
import { LocaleLoader } from "./i18n/localeLoader";

export class ExpressionDescriptor {
  static locales: { [name: string]: Locale } = {};
  static specialCharacters: string[];

  expression: string;
  expressionParts: string[];
  parsedExpression: any;
  options: Options;
  i18n: Locale;

  /**
   * Converts a cron expression into a description a human can read
   * @static
   * @param {string} expression - The cron expression
   * @param {IOptions} [{
   *         throwExceptionOnParseError = true,
   *         casingType = CasingTypeEnum.Sentence,
   *         verbose = false,
   *         dayOfWeekStartIndexZero = true,
   *         use24HourTimeFormat = false,
   *         locale = 'en'
   *     }={}]
   * @returns {string}
   */
  static toString(
    expression: string,
    {
      throwExceptionOnParseError = true,
      verbose = false,
      dayOfWeekStartIndexZero = true,
      use24HourTimeFormat,
      locale = "en"
    }: Options = {}
  ): string {
    // We take advantage of Destructuring Object Parameters (and defaults) in TS/ES6 and now we will reassemble back to
    // an Options type so we can pass around options with ease.

    let options = <Options>{
      throwExceptionOnParseError: throwExceptionOnParseError,
      verbose: verbose,
      dayOfWeekStartIndexZero: dayOfWeekStartIndexZero,
      use24HourTimeFormat: use24HourTimeFormat,
      locale: locale
    };

    let descripter = new ExpressionDescriptor(expression, options);
    return descripter.getFullDescription();
  }

  /**
   * Parses a cron expression
   * @static
   * @param {string} expression - The cron expression
   * @param {IOptions} [{
   *         throwExceptionOnParseError = true,
   *         casingType = CasingTypeEnum.Sentence,
   *         verbose = false,
   *         dayOfWeekStartIndexZero = true,
   *         use24HourTimeFormat = false,
   *         locale = 'en'
   *     }={}]
   * @returns {string}
   */
  static parse(
    expression: string,
    {
      throwExceptionOnParseError = true,
      verbose = false,
      dayOfWeekStartIndexZero = true,
      use24HourTimeFormat,
      locale = "en"
    }: Options = {}
  ): { description: string, parsed: any } {
    // We take advantage of Destructuring Object Parameters (and defaults) in TS/ES6 and now we will reassemble back to
    // an Options type so we can pass around options with ease.

    let options = <Options>{
      throwExceptionOnParseError: throwExceptionOnParseError,
      verbose: verbose,
      dayOfWeekStartIndexZero: dayOfWeekStartIndexZero,
      use24HourTimeFormat: use24HourTimeFormat,
      locale: locale
    };

    let descripter = new ExpressionDescriptor(expression, options);
    let description = descripter.getFullDescription();
    return { description, parsed: descripter.parsedExpression };
  }


  static initialize(localesLoader: LocaleLoader) {
    ExpressionDescriptor.specialCharacters = ["/", "-", ",", "*"];

    // Load locales
    localesLoader.load(ExpressionDescriptor.locales);
  }

  constructor(expression: string, options: Options) {
    this.expression = expression;
    this.options = options;
    this.expressionParts = new Array(5);
    this.parsedExpression = {};

    if (ExpressionDescriptor.locales[options.locale]) {
      this.i18n = ExpressionDescriptor.locales[options.locale];
    } else {
      // fall back to English
      console.warn(`Locale '${options.locale}' could not be found; falling back to 'en'.`);
      this.i18n = ExpressionDescriptor.locales["en"];
    }

    if (options.use24HourTimeFormat === undefined) {
      // if use24HourTimeFormat not specified, set based on locale default
      options.use24HourTimeFormat = this.i18n.use24HourTimeFormatByDefault();
    }
  }

  protected getFullDescription() {
    let description = "";

    try {
      let parser = new CronParser(this.expression, this.options.dayOfWeekStartIndexZero);
      this.expressionParts = parser.parse();

      var timeSegment = this.getTimeOfDayDescription();
      var dayOfMonthDesc = this.getDayOfMonthDescription();
      var monthDesc = this.getMonthDescription();
      var dayOfWeekDesc = this.getDayOfWeekDescription();
      var yearDesc = this.getYearDescription();

      description += timeSegment + dayOfMonthDesc + dayOfWeekDesc + monthDesc + yearDesc;
      description = this.transformVerbosity(description, this.options.verbose);

      // uppercase first character
      description = description.charAt(0).toLocaleUpperCase() + description.substr(1);
    } catch (ex) {
      if (!this.options.throwExceptionOnParseError) {
        description = this.i18n.anErrorOccuredWhenGeneratingTheExpressionD();
      } else {
        throw `${ex}`;
      }
    }
    return description;
  }

  protected getTimeOfDayDescription() {
    let secondsExpression: string = this.expressionParts[0];
    const secondsParsedExpr: any = this.parsedExpression["seconds"] = {};
    let minuteExpression: string = this.expressionParts[1];
    const minutesParsedExpr: any = this.parsedExpression["minutes"] = {};
    let hourExpression: string = this.expressionParts[2];
    const hoursParsedExpr: any = this.parsedExpression["hours"] = {};

    let description = "";

    //handle special cases first
    if (
      !StringUtilities.containsAny(minuteExpression, ExpressionDescriptor.specialCharacters) &&
      !StringUtilities.containsAny(hourExpression, ExpressionDescriptor.specialCharacters) &&
      !StringUtilities.containsAny(secondsExpression, ExpressionDescriptor.specialCharacters)
    ) {
      //specific time of day (i.e. 10 14)
      if (secondsExpression) {
        secondsParsedExpr.type = 'specific';
        secondsParsedExpr.value = [parseInt(secondsExpression)];
      } else {
        secondsParsedExpr.type = 'none';
      }
      minutesParsedExpr.type = 'specific';
      minutesParsedExpr.value = [parseInt(minuteExpression)];
      hoursParsedExpr.type = 'specific';
      hoursParsedExpr.value = [parseInt(hourExpression)];

      description += this.i18n.atSpace() + this.formatTime(hourExpression, minuteExpression, secondsExpression);
    } else if (
      !secondsExpression &&
      minuteExpression.indexOf("-") > -1 &&
      !(minuteExpression.indexOf(",") > -1) &&
      !(minuteExpression.indexOf("/") > -1) &&
      !StringUtilities.containsAny(hourExpression, ExpressionDescriptor.specialCharacters)
    ) {
      //minute range in single hour (i.e. 0-10 11)
      let minuteParts: string[] = minuteExpression.split("-");

      secondsParsedExpr.type = 'none';
      minutesParsedExpr.type = 'everyX';
      minutesParsedExpr.value = 1;
      minutesParsedExpr.start = parseInt(minuteParts[0]);
      minutesParsedExpr.end = parseInt(minuteParts[1]);
      hoursParsedExpr.type = 'specific';
      hoursParsedExpr.value = [parseInt(hourExpression)];

      description += StringUtilities.format(
        this.i18n.everyMinuteBetweenX0AndX1(),
        this.formatTime(hourExpression, minuteParts[0], ""),
        this.formatTime(hourExpression, minuteParts[1], "")
      );
    } else if (
      !secondsExpression &&
      hourExpression.indexOf(",") > -1 &&
      hourExpression.indexOf("-") == -1 &&
      hourExpression.indexOf("/") == -1 &&
      !StringUtilities.containsAny(minuteExpression, ExpressionDescriptor.specialCharacters)
    ) {
      //hours list with single minute (i.e. 30 6,14,16)
      let hourParts: string[] = hourExpression.split(",");
      description += this.i18n.at();

      secondsParsedExpr.type = 'none';
      minutesParsedExpr.type = 'specific';
      minutesParsedExpr.value = [parseInt(minuteExpression)];
      hoursParsedExpr.type = 'specific';
      hoursParsedExpr.value = [];

      for (let i = 0; i < hourParts.length; i++) {
        description += " ";
        hoursParsedExpr.value.push(parseInt(hourParts[i]));
        description += this.formatTime(hourParts[i], minuteExpression, "");

        if (i < hourParts.length - 2) {
          description += ",";
        }

        if (i == hourParts.length - 2) {
          description += this.i18n.spaceAnd();
        }
      }
    } else {
      //default time description
      let secondsDescription = this.getSecondsDescription(secondsParsedExpr);
      let minutesDescription = this.getMinutesDescription(minutesParsedExpr);
      let hoursDescription = this.getHoursDescription(hoursParsedExpr);

      description += secondsDescription;

      if (description.length > 0 && minutesDescription.length > 0) {
        description += ", ";
      }

      description += minutesDescription;

      if (description.length > 0 && hoursDescription.length > 0) {
        description += ", ";
      }

      description += hoursDescription;
    }

    return description;
  }

  protected getSecondsDescription(parsedExpr: any) {
    let description: string = this.getSegmentDescription(
      this.expressionParts[0],
      this.i18n.everySecond(),
      s => {
        return s;
      },
      s => {
        return StringUtilities.format(this.i18n.everyX0Seconds(), s);
      },
      s => {
        return this.i18n.secondsX0ThroughX1PastTheMinute();
      },
      s => {
        return s == "0"
          ? ""
          : parseInt(s) < 20
            ? this.i18n.atX0SecondsPastTheMinute()
            : this.i18n.atX0SecondsPastTheMinuteGt20() || this.i18n.atX0SecondsPastTheMinute();
      },
      parsedExpr
    );

    return description;
  }

  protected getMinutesDescription(parsedExpr: any) {
    const secondsExpression = this.expressionParts[0];
    const hourExpression = this.expressionParts[2];
    let description: string = this.getSegmentDescription(
      this.expressionParts[1],
      this.i18n.everyMinute(),
      s => {
        return s;
      },
      s => {
        return StringUtilities.format(this.i18n.everyX0Minutes(), s);
      },
      s => {
        return this.i18n.minutesX0ThroughX1PastTheHour();
      },
      s => {
        try {
          return s == "0" && hourExpression.indexOf("/") == -1 && secondsExpression == ""
            ? this.i18n.everyHour()
            : parseInt(s) < 20
              ? this.i18n.atX0MinutesPastTheHour()
              : this.i18n.atX0MinutesPastTheHourGt20() || this.i18n.atX0MinutesPastTheHour();
        } catch (e) {
          return this.i18n.atX0MinutesPastTheHour();
        }
      },
      parsedExpr
    );

    return description;
  }

  protected getHoursDescription(parsedExpr: any) {
    let expression = this.expressionParts[2];
    let description: string = this.getSegmentDescription(
      expression,
      this.i18n.everyHour(),
      s => {
        return this.formatTime(s, "0", "");
      },
      s => {
        return StringUtilities.format(this.i18n.everyX0Hours(), s);
      },
      s => {
        return this.i18n.betweenX0AndX1();
      },
      s => {
        return this.i18n.atX0();
      },
      parsedExpr
    );

    return description;
  }

  protected getDayOfWeekDescription() {
    const parsedExpr: any = this.parsedExpression["dayOfWeek"] = {};
    var daysOfWeekNames = this.i18n.daysOfTheWeek();

    let description: string = null;
    if (this.expressionParts[5] == "*") {
      // DOW is specified as * so we will not generate a description and defer to DOM part.
      // Otherwise, we could get a contradiction like "on day 1 of the month, every day"
      // or a dupe description like "every day, every day".
      parsedExpr.type = "every";
      description = "";
    } else {
      description = this.getSegmentDescription(
        this.expressionParts[5],
        this.i18n.commaEveryDay(),
        s => {
          let exp: string = s;

          if (s.indexOf("#") > -1) {
            parsedExpr.type = 'xthY';
            exp = s.substr(0, s.indexOf("#"));
            parsedExpr.value = parseInt(exp);
          } else if (s.indexOf("L") > -1) {
            parsedExpr.type = 'lastDayOfWeek';
            exp = exp.replace("L", "");
            parsedExpr.value = parseInt(exp);
          }

          return daysOfWeekNames[parseInt(exp)];
        },
        s => {
          if (parseInt(s) == 1) {
            // rather than "every 1 days" just return empty string
            return "";
          } else {
            return StringUtilities.format(this.i18n.commaEveryX0DaysOfTheWeek(), s);
          }
        },
        s => {
          return this.i18n.commaX0ThroughX1();
        },
        s => {
          let format: string = null;
          if (s.indexOf("#") > -1) {
            let dayOfWeekOfMonthNumber: string = parsedExpr.xth = s.substring(s.indexOf("#") + 1);
            let dayOfWeekOfMonthDescription: string = null;
            switch (dayOfWeekOfMonthNumber) {
              case "1":
                dayOfWeekOfMonthDescription = this.i18n.first();
                break;
              case "2":
                dayOfWeekOfMonthDescription = this.i18n.second();
                break;
              case "3":
                dayOfWeekOfMonthDescription = this.i18n.third();
                break;
              case "4":
                dayOfWeekOfMonthDescription = this.i18n.fourth();
                break;
              case "5":
                dayOfWeekOfMonthDescription = this.i18n.fifth();
                break;
            }

            format = this.i18n.commaOnThe() + dayOfWeekOfMonthDescription + this.i18n.spaceX0OfTheMonth();
          } else if (s.indexOf("L") > -1) {
            format = this.i18n.commaOnTheLastX0OfTheMonth();
          } else {
            // If both DOM and DOW are specified, the cron will execute at either time.
            const domSpecified = this.expressionParts[3] != "*";
            format = domSpecified ? this.i18n.commaAndOnX0() : this.i18n.commaOnlyOnX0();
          }

          return format;
        },
        parsedExpr
      );
    }

    return description;
  }

  protected getMonthDescription() {
    const parsedExpr: any = this.parsedExpression["month"] = {};
    var monthNames = this.i18n.monthsOfTheYear();

    let description: string = this.getSegmentDescription(
      this.expressionParts[4],
      "",
      s => {
        return monthNames[parseInt(s) - 1];
      },
      s => {
        //
        if (parseInt(s) == 1) {
          // rather than "every 1 months" just return empty string
          return "";
        } else {
          return StringUtilities.format(this.i18n.commaEveryX0Months(), s);
        }
      },
      s => {
        return this.i18n.commaMonthX0ThroughMonthX1() || this.i18n.commaX0ThroughX1();
      },
      s => {
        return this.i18n.commaOnlyInX0();
      },
      parsedExpr
    );

    return description;
  }

  protected getDayOfMonthDescription(): string {
    const parsedExpr: any = this.parsedExpression["dayOfMonth"] = {};
    let description: string = null;
    let expression: string = this.expressionParts[3];

    switch (expression) {
      case "L":
        parsedExpr.type = "lastDay";
        description = this.i18n.commaOnTheLastDayOfTheMonth();
        break;
      case "WL":
      case "LW":
        parsedExpr.type = "lastWeekDay";
        description = this.i18n.commaOnTheLastWeekdayOfTheMonth();
        break;
      default:
        let weekDayNumberMatches = expression.match(/(\d{1,2}W)|(W\d{1,2})/); // i.e. 3W or W2
        if (weekDayNumberMatches) {
          parsedExpr.type = "nearestWeekDay";
          let dayNumber: number = parsedExpr.start = parseInt(weekDayNumberMatches[0].replace("W", ""));
          let dayString: string =
            dayNumber == 1
              ? this.i18n.firstWeekday()
              : StringUtilities.format(this.i18n.weekdayNearestDayX0(), dayNumber.toString());
          description = StringUtilities.format(this.i18n.commaOnTheX0OfTheMonth(), dayString);

          break;
        } else {
          // Handle "last day offset" (i.e. L-5:  "5 days before the last day of the month")
          let lastDayOffSetMatches = expression.match(/L-(\d{1,2})/);
          if (lastDayOffSetMatches) {
            parsedExpr.type = "beforeLastDay";
            let offSetDays = parsedExpr.value = lastDayOffSetMatches[1];
            description = StringUtilities.format(this.i18n.commaDaysBeforeTheLastDayOfTheMonth(), offSetDays);
            break;
          } else if (expression == "*" && this.expressionParts[5] != "*") {
            // * dayOfMonth and dayOfWeek specified so use dayOfWeek verbiage instead
            parsedExpr.type = "every";
            return "";
          } else {
            description = this.getSegmentDescription(
              expression,
              this.i18n.commaEveryDay(),
              s => {
                return s == "L" ? this.i18n.lastDay() : s;
              },
              s => {
                return s == "1" ? this.i18n.commaEveryDay() : this.i18n.commaEveryX0Days();
              },
              s => {
                return this.i18n.commaBetweenDayX0AndX1OfTheMonth();
              },
              s => {
                return this.i18n.commaOnDayX0OfTheMonth();
              },
              parsedExpr
            );
          }
          break;
        }
    }

    return description;
  }

  protected getYearDescription() {
    const parsedExpr: any = this.parsedExpression["year"] = {};
    let description: string = this.getSegmentDescription(
      this.expressionParts[6],
      "",
      s => {
        return /^\d+$/.test(s) ? new Date(parseInt(s), 1).getFullYear().toString() : s;
      },
      s => {
        return StringUtilities.format(this.i18n.commaEveryX0Years(), s);
      },
      s => {
        return this.i18n.commaYearX0ThroughYearX1() || this.i18n.commaX0ThroughX1();
      },
      s => {
        return this.i18n.commaOnlyInX0();
      },
      parsedExpr
    );

    return description;
  }

  protected getSegmentDescription(
    expression: string,
    allDescription: string,
    getSingleItemDescription: (t: string) => string,
    getIntervalDescriptionFormat: (t: string) => string,
    getBetweenDescriptionFormat: (t: string) => string,
    getDescriptionFormat: (t: string) => string,
    parsedExpression: any
  ): string {
    let description: string = null;
    let parsedExpr: any = parsedExpression || {};

    if (!expression) {
      description = "";
      parsedExpr.type = "none";
    } else if (expression === "*") {
      parsedExpr.type = "every";

      description = allDescription;
    } else if (!StringUtilities.containsAny(expression, ["/", "-", ","])) {
      parsedExpr.type = "specific";
      parsedExpr.value = [parseInt(expression)];

      description = StringUtilities.format(getDescriptionFormat(expression), getSingleItemDescription(expression));
    } else if (expression.indexOf("/") > -1) {
      let segments: string[] = expression.split("/");

      parsedExpr.type = "everyX";
      parsedExpr.value = parseInt(segments[1]);
      parsedExpr.start = parseInt(segments[0] == "*" ? "0" : segments[0]);
      description = StringUtilities.format(
        getIntervalDescriptionFormat(segments[1]),
        getSingleItemDescription(segments[1])
      );

      //interval contains 'between' piece (i.e. 2-59/3 )
      if (segments[0].indexOf("-") > -1) {
        let betweenSegmentDescription: string = this.generateBetweenSegmentDescription(
          segments[0],
          getBetweenDescriptionFormat,
          getSingleItemDescription,
          parsedExpr
        );

        if (betweenSegmentDescription.indexOf(", ") != 0) {
          description += ", ";
        }

        description += betweenSegmentDescription;
      } else if (!StringUtilities.containsAny(segments[0], ["*", ","])) {
        let rangeItemDescription: string = StringUtilities.format(
          getDescriptionFormat(segments[0]),
          getSingleItemDescription(segments[0])
        );
        //remove any leading comma
        rangeItemDescription = rangeItemDescription.replace(", ", "");

        description += StringUtilities.format(this.i18n.commaStartingX0(), rangeItemDescription);
      }
    } else if (expression.indexOf(",") > -1) {
      let segments: string[] = expression.split(",");

      parsedExpr.type = "specific";
      parsedExpr.value = [];

      let descriptionContent: string = "";
      for (let i = 0; i < segments.length; i++) {
        if (i > 0 && segments.length > 2) {
          descriptionContent += ",";

          if (i < segments.length - 1) {
            descriptionContent += " ";
          }
        }

        if (i > 0 && segments.length > 1 && (i == segments.length - 1 || segments.length == 2)) {
          descriptionContent += `${this.i18n.spaceAnd()} `;
        }

        if (segments[i].indexOf("-") > -1) {
          const segmentParsedExpr = {};
          parsedExpr.value.push(segmentParsedExpr);
          let betweenSegmentDescription: string = this.generateBetweenSegmentDescription(
            segments[i],
            s => {
              return this.i18n.commaX0ThroughX1();
            },
            getSingleItemDescription,
            segmentParsedExpr
          );

          //remove any leading comma
          betweenSegmentDescription = betweenSegmentDescription.replace(", ", "");

          descriptionContent += betweenSegmentDescription;
        } else {
          parsedExpr.value.push(parseInt(segments[i]));
          descriptionContent += getSingleItemDescription(segments[i]);
        }
      }

      description = StringUtilities.format(getDescriptionFormat(expression), descriptionContent);
    } else if (expression.indexOf("-") > -1) {
      parsedExpr.type = "between";
      description = this.generateBetweenSegmentDescription(
        expression,
        getBetweenDescriptionFormat,
        getSingleItemDescription,
        parsedExpr
      );
      if (parsedExpr.start == parsedExpr.end) {
        parsedExpr.type = 'specific';
        parsedExpr.value = [parsedExpr.start];
        delete parsedExpr.start;
        delete parsedExpr.end;
      }
    }

    return description;
  }

  protected generateBetweenSegmentDescription(
    betweenExpression: string,
    getBetweenDescriptionFormat: (t: string) => string,
    getSingleItemDescription: (t: string) => string,
    parsedExpression: any
  ): string {
    let description: string = "";
    let parsedExpr: any = parsedExpression || {};
    let betweenSegments: string[] = betweenExpression.split("-");
    let betweenSegment1Description: string = getSingleItemDescription(betweenSegments[0]);
    parsedExpr.start = parseInt(betweenSegments[0]);
    let betweenSegment2Description: string = getSingleItemDescription(betweenSegments[1]);
    parsedExpr.end = parseInt(betweenSegments[1]);
    betweenSegment2Description = betweenSegment2Description.replace(":00", ":59");
    let betweenDescriptionFormat = getBetweenDescriptionFormat(betweenExpression);
    description += StringUtilities.format(
      betweenDescriptionFormat,
      betweenSegment1Description,
      betweenSegment2Description
    );

    return description;
  }

  protected formatTime(hourExpression: string, minuteExpression: string, secondExpression: string) {
    let hour: number = parseInt(hourExpression);
    let period: string = "";
    let setPeriodBeforeTime: boolean = false;
    if (!this.options.use24HourTimeFormat) {
      setPeriodBeforeTime = this.i18n.setPeriodBeforeTime && this.i18n.setPeriodBeforeTime();
      period = setPeriodBeforeTime ? `${this.getPeriod(hour)} ` : ` ${this.getPeriod(hour)}`;
      if (hour > 12) {
        hour -= 12;
      }
      if (hour === 0) {
        hour = 12;
      }
    }

    const minute = minuteExpression;
    let second: string = "";
    if (secondExpression) {
      second = `:${("00" + secondExpression).substring(secondExpression.length)}`;
    }

    return `${setPeriodBeforeTime ? period : ""}${("00" + hour.toString()).substring(hour.toString().length)}:${("00" + minute.toString()).substring(
      minute.toString().length
    )}${second}${!setPeriodBeforeTime ? period : ""}`;
  }

  protected transformVerbosity(description: string, useVerboseFormat: boolean) {
    if (!useVerboseFormat) {
      description = description.replace(new RegExp(`, ${this.i18n.everyMinute()}`, "g"), "");
      description = description.replace(new RegExp(`, ${this.i18n.everyHour()}`, "g"), "");
      description = description.replace(new RegExp(this.i18n.commaEveryDay(), "g"), "");
      description = description.replace(/\, ?$/, "");
    }
    return description;
  }

  private getPeriod(hour: number): string {
    return hour >= 12 ? this.i18n.pm && this.i18n.pm() || "PM" : this.i18n.am && this.i18n.am() || "AM";
  }
}
