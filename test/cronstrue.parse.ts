import chai = require("chai");
import construe from "../src/cronstrue";
let assert = chai.assert;

describe.only("Cronstrue parse", function () {
  describe("every", function () {
    it("* * * * * *", function () {
      assert.equal(construe.parse(this.test.title).description, "Every second");
      assert.deepEqual(construe.parse(this.test.title).parsed,
        {
          seconds: { type: "every" }, minutes: { type: "every" }, hours: { type: "every" }, dayOfWeek: { type: "every" },
          dayOfMonth: { type: "every" }, month: { type: "every" }, year: { type: "none" }
        });
    });

    it("* * * * *", function () {
      assert.equal(construe.parse(this.test.title).description, "Every minute");
      assert.deepEqual(construe.parse(this.test.title).parsed,
        {
          seconds: { type: "none" }, minutes: { type: "every" }, hours: { type: "every" }, dayOfWeek: { type: "every" },
          dayOfMonth: { type: "every" }, month: { type: "every" }, year: { type: "none" }
        });
    });

    it("*/1 * * * *", function () {
      assert.equal(construe.parse(this.test.title).description, "Every minute");
      assert.deepEqual(construe.parse(this.test.title).parsed,
        {
          seconds: { type: "none" }, minutes: { type: "every" }, hours: { type: "every" }, dayOfWeek: { type: "every" },
          dayOfMonth: { type: "every" }, month: { type: "every" }, year: { type: "none" }
        });
    });

    it("*/5 * * * *", function () {
      assert.equal(construe.parse(this.test.title).description, "Every 5 minutes");
      assert.deepEqual(construe.parse(this.test.title).parsed,
        {
          seconds: { type: "none" }, minutes: { type: "everyX", value: 5, start: 0 }, hours: { type: "every" }, dayOfWeek: { type: "every" },
          dayOfMonth: { type: "every" }, month: { type: "every" }, year: { type: "none" }
        });
    });

    it("0 0/1 * * * ?", function () {
      assert.equal(construe.parse(this.test.title).description, "Every minute");
      assert.deepEqual(construe.parse(this.test.title).parsed,
        {
          seconds: { type: "none" }, minutes: { type: "every" }, hours: { type: "every" }, dayOfWeek: { type: "every" },
          dayOfMonth: { type: "every" }, month: { type: "every" }, year: { type: "none" }
        });
    });

    it("0 0 * * * ?", function () {
      assert.equal(construe.parse(this.test.title).description, "Every hour");
      assert.deepEqual(construe.parse(this.test.title).parsed,
        {
          seconds: { type: "none" }, minutes: { type: "specific", value: [0] }, hours: { type: "every" }, dayOfWeek: { type: "every" },
          dayOfMonth: { type: "every" }, month: { type: "every" }, year: { type: "none" }
        });
    });

    it("0 0 0 * * ?", function () {
      assert.equal(construe.parse(this.test.title).description, "At 12:00 AM");
      assert.deepEqual(construe.parse(this.test.title).parsed,
        {
          seconds: { type: "none" }, minutes: { type: "specific", value: [0] }, hours: { type: "specific", value: [0] }, dayOfWeek: { type: "every" },
          dayOfMonth: { type: "every" }, month: { type: "every" }, year: { type: "none" }
        });
    });

    it("0 0 0/1 * * ?", function () {
      assert.equal(construe.parse(this.test.title).description, "Every hour");
      assert.deepEqual(construe.parse(this.test.title).parsed,
        {
          seconds: { type: "none" }, minutes: { type: "specific", value: [0] }, hours: { type: "every" }, dayOfWeek: { type: "every" },
          dayOfMonth: { type: "every" }, month: { type: "every" }, year: { type: "none" }
        });
    });

    it("* * * 3 *", function () {
      assert.equal(construe.parse(this.test.title).description, "Every minute, only in March");
      assert.deepEqual(construe.parse(this.test.title).parsed,
        {
          seconds: { type: "none" }, minutes: { type: "every" }, hours: { type: "every" }, dayOfWeek: { type: "every" },
          dayOfMonth: { type: "every" }, month: { type: "specific", value: [3] }, year: { type: "none" }
        });
    });

    it("* * * 3,6 *", function () {
      assert.equal(construe.parse(this.test.title).description, "Every minute, only in March and June");
      assert.deepEqual(construe.parse(this.test.title).parsed,
        {
          seconds: { type: "none" }, minutes: { type: "every" }, hours: { type: "every" }, dayOfWeek: { type: "every" },
          dayOfMonth: { type: "every" }, month: { type: "specific", value: [3, 6] }, year: { type: "none" }
        });
    });

    it("* * * * * * 2013", function () {
      assert.equal(construe.parse(this.test.title).description, "Every second, only in 2013");
      assert.deepEqual(construe.parse(this.test.title).parsed,
        {
          seconds: { type: "every" }, minutes: { type: "every" }, hours: { type: "every" }, dayOfWeek: { type: "every" },
          dayOfMonth: { type: "every" }, month: { type: "every" }, year: { type: "specific", value: [2013] }
        });
    });

    it("* * * * * 2013", function () {
      assert.equal(construe.parse(this.test.title).description, "Every minute, only in 2013");
      assert.deepEqual(construe.parse(this.test.title).parsed,
        {
          seconds: { type: "none" }, minutes: { type: "every" }, hours: { type: "every" }, dayOfWeek: { type: "every" },
          dayOfMonth: { type: "every" }, month: { type: "every" }, year: { type: "specific", value: [2013] }
        });
    });

    it("* * * * * 2013,2014", function () {
      assert.equal(construe.parse(this.test.title).description, "Every minute, only in 2013 and 2014");
      assert.deepEqual(construe.parse(this.test.title).parsed,
        {
          seconds: { type: "none" }, minutes: { type: "every" }, hours: { type: "every" }, dayOfWeek: { type: "every" },
          dayOfMonth: { type: "every" }, month: { type: "every" }, year: { type: "specific", value: [2013, 2014] }
        });
    });
  });

  describe("interval", function () {
    it("*/45 * * * * *", function () {
      assert.equal(construe.parse(this.test.title).description, "Every 45 seconds");
      assert.deepEqual(construe.parse(this.test.title).parsed,
        {
          seconds: { type: "everyX", value: 45, start: 0 }, minutes: { type: "every" }, hours: { type: "every" }, dayOfWeek: { type: "every" },
          dayOfMonth: { type: "every" }, month: { type: "every" }, year: { type: "none" }
        });
    });

    it("*/5 * * * *", function () {
      assert.equal(construe.parse(this.test.title).description, "Every 5 minutes");
      assert.deepEqual(construe.parse(this.test.title).parsed,
        {
          seconds: { type: "none" }, minutes: { type: "everyX", value: 5, start: 0 }, hours: { type: "every" }, dayOfWeek: { type: "every" },
          dayOfMonth: { type: "every" }, month: { type: "every" }, year: { type: "none" }
        });
    });

    it("*/10 * * * *", function () {
      assert.equal(construe.parse(this.test.title).description, "Every 10 minutes");
      assert.deepEqual(construe.parse(this.test.title).parsed,
        {
          seconds: { type: "none" }, minutes: { type: "everyX", value: 10, start: 0 }, hours: { type: "every" }, dayOfWeek: { type: "every" },
          dayOfMonth: { type: "every" }, month: { type: "every" }, year: { type: "none" }
        });
    });

    it("0 */5 * * * *", function () {
      assert.equal(construe.parse(this.test.title).description, "Every 5 minutes");
      assert.deepEqual(construe.parse(this.test.title).parsed,
        {
          seconds: { type: "none" }, minutes: { type: "everyX", value: 5, start: 0 }, hours: { type: "every" }, dayOfWeek: { type: "every" },
          dayOfMonth: { type: "every" }, month: { type: "every" }, year: { type: "none" }
        });
    });

    it("0 9-17 * * *", function () {
      assert.equal(construe.parse(this.test.title).description, "Every hour, between 09:00 AM and 05:59 PM");
      assert.deepEqual(construe.parse(this.test.title).parsed,
        {
          seconds: { type: "none" }, minutes: { type: "specific", value: [0] }, hours: { type: "between", start: 9, end: 17 }, dayOfWeek: { type: "every" },
          dayOfMonth: { type: "every" }, month: { type: "every" }, year: { type: "none" }
        });
    });

    it("0 * ? * 2/1 *", function () {
      assert.equal(construe.parse(this.test.title).description, "Every minute, February through December");
      assert.deepEqual(construe.parse(this.test.title).parsed,
        {
          seconds: { type: "none" }, minutes: { type: "every" }, hours: { type: "every" }, dayOfWeek: { type: "every" },
          dayOfMonth: { type: "every" }, month: { type: "everyX", value: 1, start: 2, end: 12 }, year: { type: "none" }
        });
    });

    it("0 * ? * 2/1", function () {
      assert.equal(construe.parse(this.test.title).description, "Every hour, Tuesday through Saturday");
      assert.deepEqual(construe.parse(this.test.title).parsed,
        {
          seconds: { type: "none" }, minutes: { type: "specific", value: [0] }, hours: { type: "every" }, dayOfWeek: { type: "everyX", value: 1, start: 2, end: 6 },
          dayOfMonth: { type: "every" }, month: { type: "every" }, year: { type: "none" }
        });
    });

    it("0 52 13 ? * 3/1", function () {
      assert.equal(construe.parse(this.test.title).description, "At 01:52 PM, Wednesday through Saturday");
      assert.deepEqual(construe.parse(this.test.title).parsed,
        {
          seconds: { type: "none" }, minutes: { type: "specific", value: [52] }, hours: { type: "specific", value: [13] }, dayOfWeek: { type: "everyX", value: 1, start: 3, end: 6 },
          dayOfMonth: { type: "every" }, month: { type: "every" }, year: { type: "none" }
        });
    });
  });

  describe("ranges", function () {
    it("0 23 ? * MON-FRI", function () {
      assert.equal(construe.parse(this.test.title).description, "At 11:00 PM, Monday through Friday");
      assert.deepEqual(construe.parse(this.test.title).parsed,
        {
          seconds: { type: "none" }, minutes: { type: "specific", value: [0] }, hours: { type: "specific", value: [23] }, dayOfWeek: { type: "between", start: 1, end: 5 },
          dayOfMonth: { type: "every" }, month: { type: "every" }, year: { type: "none" }
        });
    });

    it("30 11 * * 1-5", function () {
      assert.equal(construe.parse(this.test.title).description, "At 11:30 AM, Monday through Friday");
      assert.deepEqual(construe.parse(this.test.title).parsed,
        {
          seconds: { type: "none" }, minutes: { type: "specific", value: [30] }, hours: { type: "specific", value: [11] }, dayOfWeek: { type: "between", start: 1, end: 5 },
          dayOfMonth: { type: "every" }, month: { type: "every" }, year: { type: "none" }
        });
    });

    it("0-10 11 * * *", function () {
      assert.equal(construe.parse(this.test.title).description, "Every minute between 11:00 AM and 11:10 AM");
      assert.deepEqual(construe.parse(this.test.title).parsed,
        {
          seconds: { type: "none" }, minutes: { type: "everyX", value: 1, start: 0, end: 10 }, hours: { type: "specific", value: [11] }, dayOfWeek: { type: "every" },
          dayOfMonth: { type: "every" }, month: { type: "every" }, year: { type: "none" }
        });
    });

    it("23 12 * Jan-Mar *", function () {
      assert.equal(construe.parse(this.test.title).description, "At 12:23 PM, January through March");
      assert.deepEqual(construe.parse(this.test.title).parsed,
        {
          seconds: { type: "none" }, minutes: { type: "specific", value: [23] }, hours: { type: "specific", value: [12] }, dayOfWeek: { type: "every" },
          dayOfMonth: { type: "every" }, month: { type: "between", start: 1, end: 3 }, year: { type: "none" }
        });
    });

    it("23 12 * JAN-FEB *", function () {
      assert.equal(construe.parse(this.test.title).description, "At 12:23 PM, January through February");
      assert.deepEqual(construe.parse(this.test.title).parsed,
        {
          seconds: { type: "none" }, minutes: { type: "specific", value: [23] }, hours: { type: "specific", value: [12] }, dayOfWeek: { type: "every" },
          dayOfMonth: { type: "every" }, month: { type: "between", start: 1, end: 2 }, year: { type: "none" }
        });
    });

    it("1 1,3-4 * * *", function () {
      assert.equal(construe.parse(this.test.title).description, "At 1 minutes past the hour, at 01:00 AM and 03:00 AM through 04:59 AM");
      assert.deepEqual(construe.parse(this.test.title).parsed,
        {
          seconds: { type: "none" }, minutes: { type: "specific", value: [1] }, hours: { type: "specific", value: [1, { start: 3, end: 4 }] }, dayOfWeek: { type: "every" },
          dayOfMonth: { type: "every" }, month: { type: "every" }, year: { type: "none" }
        });
    });

    it("* 0 */4 * * *", function () {
      assert.equal(construe.parse(this.test.title).description, "Every second, at 0 minutes past the hour, every 4 hours");
      assert.deepEqual(construe.parse(this.test.title).parsed,
        {
          seconds: { type: "every" }, minutes: { type: "specific", value: [0] }, hours: { type: "everyX", value: 4, start: 0 }, dayOfWeek: { type: "every" },
          dayOfMonth: { type: "every" }, month: { type: "every" }, year: { type: "none" }
        });
    });

    it("*/10 0 * * * *", function () {
      assert.equal(construe.parse(this.test.title).description, "Every 10 seconds, at 0 minutes past the hour");
      assert.deepEqual(construe.parse(this.test.title).parsed,
        {
          seconds: { type: "everyX", value: 10, start: 0 }, minutes: { type: "specific", value: [0] }, hours: { type: "every" }, dayOfWeek: { type: "every" },
          dayOfMonth: { type: "every" }, month: { type: "every" }, year: { type: "none" }
        });
    });

    it("* 0 0 * * *", function () {
      assert.equal(construe.parse(this.test.title).description, "Every second, at 0 minutes past the hour, between 12:00 AM and 12:59 AM");
      assert.deepEqual(construe.parse(this.test.title).parsed,
        {
          seconds: { type: "every" }, minutes: { type: "specific", value: [0] }, hours: { type: "specific", value: [0] }, dayOfWeek: { type: "every" },
          dayOfMonth: { type: "every" }, month: { type: "every" }, year: { type: "none" }
        });
    });

    it("* 0 * * *", function () {
      assert.equal(construe.parse(this.test.title).description, "Every minute, between 12:00 AM and 12:59 AM");
      assert.deepEqual(construe.parse(this.test.title).parsed,
        {
          seconds: { type: "none" }, minutes: { type: "every" }, hours: { type: "specific", value: [0] }, dayOfWeek: { type: "every" },
          dayOfMonth: { type: "every" }, month: { type: "every" }, year: { type: "none" }
        });
    });

    it("* 0 * * * *", function () {
      assert.equal(construe.parse(this.test.title).description, "Every second, at 0 minutes past the hour");
      assert.deepEqual(construe.parse(this.test.title).parsed,
        {
          seconds: { type: "every" }, minutes: { type: "specific", value: [0] }, hours: { type: "every" }, dayOfWeek: { type: "every" },
          dayOfMonth: { type: "every" }, month: { type: "every" }, year: { type: "none" }
        });
    });
  });

  describe("at", function () {
    it("30 11 * * *", function () {
      assert.equal(construe.parse(this.test.title).description, "At 11:30 AM");
      assert.deepEqual(construe.parse(this.test.title).parsed,
        {
          seconds: { type: "none" }, minutes: { type: "specific", value: [30] }, hours: { type: "specific", value: [11] }, dayOfWeek: { type: "every" },
          dayOfMonth: { type: "every" }, month: { type: "every" }, year: { type: "none" }
        });
    });

    it("23 12 * * SUN", function () {
      assert.equal(construe.parse(this.test.title).description, "At 12:23 PM, only on Sunday");
      assert.deepEqual(construe.parse(this.test.title).parsed,
        {
          seconds: { type: "none" }, minutes: { type: "specific", value: [23] }, hours: { type: "specific", value: [12] }, dayOfWeek: { type: "specific", value: [0] },
          dayOfMonth: { type: "every" }, month: { type: "every" }, year: { type: "none" }
        });
    });

    it("30 02 14 * * *", function () {
      assert.equal(construe.parse(this.test.title).description, "At 02:02:30 PM");
      assert.deepEqual(construe.parse(this.test.title).parsed,
        {
          seconds: { type: "specific", value: [30] }, minutes: { type: "specific", value: [2] }, hours: { type: "specific", value: [14] }, dayOfWeek: { type: "every" },
          dayOfMonth: { type: "every" }, month: { type: "every" }, year: { type: "none" }
        });
    });

    it("0 0 6 1/1 * ?", function () {
      assert.equal(construe.parse(this.test.title).description, "At 06:00 AM");
      assert.deepEqual(construe.parse(this.test.title).parsed,
        {
          seconds: { type: "none" }, minutes: { type: "specific", value: [0] }, hours: { type: "specific", value: [6] }, dayOfWeek: { type: "every" },
          dayOfMonth: { type: "every" }, month: { type: "every" }, year: { type: "none" }
        });
    });

    it("0 5 0/1 * * ?", function () {
      assert.equal(construe.parse(this.test.title).description, "At 5 minutes past the hour");
      assert.deepEqual(construe.parse(this.test.title).parsed,
        {
          seconds: { type: "none" }, minutes: { type: "specific", value: [5] }, hours: { type: "every" }, dayOfWeek: { type: "every" },
          dayOfMonth: { type: "every" }, month: { type: "every" }, year: { type: "none" }
        });
    });

    it("46 9 * * 1", function () {
      assert.equal(construe.parse(this.test.title).description, "At 09:46 AM, only on Monday");
      assert.deepEqual(construe.parse(this.test.title).parsed,
        {
          seconds: { type: "none" }, minutes: { type: "specific", value: [46] }, hours: { type: "specific", value: [9] }, dayOfWeek: { type: "specific", value: [1] },
          dayOfMonth: { type: "every" }, month: { type: "every" }, year: { type: "none" }
        });
    });

    it("46 9 * * 7", function () {
      assert.equal(construe.parse(this.test.title).description, "At 09:46 AM, only on Sunday");
      assert.deepEqual(construe.parse(this.test.title).parsed,
        {
          seconds: { type: "none" }, minutes: { type: "specific", value: [46] }, hours: { type: "specific", value: [9] }, dayOfWeek: { type: "specific", value: [0] },
          dayOfMonth: { type: "every" }, month: { type: "every" }, year: { type: "none" }
        });
    });

    it("23 12 15 * *", function () {
      assert.equal(construe.parse(this.test.title).description, "At 12:23 PM, on day 15 of the month");
      assert.deepEqual(construe.parse(this.test.title).parsed,
        {
          seconds: { type: "none" }, minutes: { type: "specific", value: [23] }, hours: { type: "specific", value: [12] }, dayOfWeek: { type: "every" },
          dayOfMonth: { type: "specific", value: [15] }, month: { type: "every" }, year: { type: "none" }
        });
    });

    it("23 12 * JAN *", function () {
      assert.equal(construe.parse(this.test.title).description, "At 12:23 PM, only in January");
      assert.deepEqual(construe.parse(this.test.title).parsed,
        {
          seconds: { type: "none" }, minutes: { type: "specific", value: [23] }, hours: { type: "specific", value: [12] }, dayOfWeek: { type: "every" },
          dayOfMonth: { type: "every" }, month: { type: "specific", value: [1] }, year: { type: "none" }
        });
    });

    it("23 12 ? JAN *", function () {
      assert.equal(construe.parse(this.test.title).description, "At 12:23 PM, only in January");
      assert.deepEqual(construe.parse(this.test.title).parsed,
        {
          seconds: { type: "none" }, minutes: { type: "specific", value: [23] }, hours: { type: "specific", value: [12] }, dayOfWeek: { type: "every" },
          dayOfMonth: { type: "every" }, month: { type: "specific", value: [1] }, year: { type: "none" }
        });
    });

    it("0 7 * * *", function () {
      assert.equal(construe.parse(this.test.title).description, "At 07:00 AM");
      assert.deepEqual(construe.parse(this.test.title).parsed,
        {
          seconds: { type: "none" }, minutes: { type: "specific", value: [0] }, hours: { type: "specific", value: [7] }, dayOfWeek: { type: "every" },
          dayOfMonth: { type: "every" }, month: { type: "every" }, year: { type: "none" }
        });
    });

    it("30 14,16 * * *", function () {
      assert.equal(construe.parse(this.test.title).description, "At 02:30 PM and 04:30 PM");
      assert.deepEqual(construe.parse(this.test.title).parsed,
        {
          seconds: { type: "none" }, minutes: { type: "specific", value: [30] }, hours: { type: "specific", value: [14, 16] }, dayOfWeek: { type: "every" },
          dayOfMonth: { type: "every" }, month: { type: "every" }, year: { type: "none" }
        });
    });

    it("30 6,14,16 * * *", function () {
      assert.equal(construe.parse(this.test.title).description, "At 06:30 AM, 02:30 PM and 04:30 PM");
      assert.deepEqual(construe.parse(this.test.title).parsed,
        {
          seconds: { type: "none" }, minutes: { type: "specific", value: [30] }, hours: { type: "specific", value: [6, 14, 16] }, dayOfWeek: { type: "every" },
          dayOfMonth: { type: "every" }, month: { type: "every" }, year: { type: "none" }
        });
    });

    it("0 * 31 * 1", function () {
      assert.equal(construe.parse(this.test.title).description, "Every hour, on day 31 of the month, and on Monday");
      assert.deepEqual(construe.parse(this.test.title).parsed,
        {
          seconds: { type: "none" }, minutes: { type: "specific", value: [0] }, hours: { type: "every" }, dayOfWeek: { type: "specific", value: [1] },
          dayOfMonth: { type: "specific", value: [31] }, month: { type: "every" }, year: { type: "none" }
        });
    });
  });

  describe("weekday", function () {
    it("* * LW * *", function () {
      assert.equal(construe.parse(this.test.title).description, "Every minute, on the last weekday of the month");
      assert.deepEqual(construe.parse(this.test.title).parsed,
        {
          seconds: { type: "none" }, minutes: { type: "every" }, hours: { type: "every" }, dayOfWeek: { type: "every" },
          dayOfMonth: { type: "lastWeekDay" }, month: { type: "every" }, year: { type: "none" }
        });
    });

    it("* * WL * *", function () {
      assert.equal(construe.parse(this.test.title).description, "Every minute, on the last weekday of the month");
      assert.deepEqual(construe.parse(this.test.title).parsed,
        {
          seconds: { type: "none" }, minutes: { type: "every" }, hours: { type: "every" }, dayOfWeek: { type: "every" },
          dayOfMonth: { type: "lastWeekDay" }, month: { type: "every" }, year: { type: "none" }
        });
    });

    it("* * 1W * *", function () {
      assert.equal(construe.parse(this.test.title).description, "Every minute, on the first weekday of the month");
      assert.deepEqual(construe.parse(this.test.title).parsed,
        {
          seconds: { type: "none" }, minutes: { type: "every" }, hours: { type: "every" }, dayOfWeek: { type: "every" },
          dayOfMonth: { type: "nearestWeekDay", start: 1 }, month: { type: "every" }, year: { type: "none" }
        });
    });

    it("* * 13W * *", function () {
      assert.equal(construe.parse(this.test.title).description, "Every minute, on the weekday nearest day 13 of the month");
      assert.deepEqual(construe.parse(this.test.title).parsed,
        {
          seconds: { type: "none" }, minutes: { type: "every" }, hours: { type: "every" }, dayOfWeek: { type: "every" },
          dayOfMonth: { type: "nearestWeekDay", start: 13 }, month: { type: "every" }, year: { type: "none" }
        });
    });

    it("* * W1 * *", function () {
      assert.equal(construe.parse(this.test.title).description, "Every minute, on the first weekday of the month");
      assert.deepEqual(construe.parse(this.test.title).parsed,
        {
          seconds: { type: "none" }, minutes: { type: "every" }, hours: { type: "every" }, dayOfWeek: { type: "every" },
          dayOfMonth: { type: "nearestWeekDay", start: 1 }, month: { type: "every" }, year: { type: "none" }
        });
    });

    it("* * 5W * *", function () {
      assert.equal(construe.parse(this.test.title).description, "Every minute, on the weekday nearest day 5 of the month");
      assert.deepEqual(construe.parse(this.test.title).parsed,
        {
          seconds: { type: "none" }, minutes: { type: "every" }, hours: { type: "every" }, dayOfWeek: { type: "every" },
          dayOfMonth: { type: "nearestWeekDay", start: 5 }, month: { type: "every" }, year: { type: "none" }
        });
    });

    it("* * W5 * *", function () {
      assert.equal(construe.parse(this.test.title).description, "Every minute, on the weekday nearest day 5 of the month");
      assert.deepEqual(construe.parse(this.test.title).parsed,
        {
          seconds: { type: "none" }, minutes: { type: "every" }, hours: { type: "every" }, dayOfWeek: { type: "every" },
          dayOfMonth: { type: "nearestWeekDay", start: 5 }, month: { type: "every" }, year: { type: "none" }
        });
    });
  });

  describe("last", function () {
    it("* * * * 4L", function () {
      assert.equal(construe.parse(this.test.title).description, "Every minute, on the last Thursday of the month");
      assert.deepEqual(construe.parse(this.test.title).parsed,
        {
          seconds: { type: "none" }, minutes: { type: "every" }, hours: { type: "every" }, dayOfWeek: { type: "lastDayOfWeek", value: 4 },
          dayOfMonth: { type: "every" }, month: { type: "every" }, year: { type: "none" }
        });
    });

    it("*/5 * L JAN *", function () {
      assert.equal(construe.parse(this.test.title).description, "Every 5 minutes, on the last day of the month, only in January");
      assert.deepEqual(construe.parse(this.test.title).parsed,
        {
          seconds: { type: "none" }, minutes: { type: "everyX", value: 5, start: 0 }, hours: { type: "every" }, dayOfWeek: { type: "every" },
          dayOfMonth: { type: "lastDay" }, month: { type: "specific", value: [1] }, year: { type: "none" }
        });
    });

    it("0 20 L * *", function () {
      assert.equal(construe.parse(this.test.title).description, "At 08:00 PM, on the last day of the month");
      assert.deepEqual(construe.parse(this.test.title).parsed,
        {
          seconds: { type: "none" }, minutes: { type: "specific", value: [0] }, hours: { type: "specific", value: [20] }, dayOfWeek: { type: "every" },
          dayOfMonth: { type: "lastDay" }, month: { type: "every" }, year: { type: "none" }
        });
    });
  });

});
