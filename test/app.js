/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
const chai = require("chai")
const expect = chai.expect

/*
* * * * * *
| | | | | |
| | | | | +-- Year              (range: 1900-3000)
| | | | +---- Day of the Week   (range: 0-6, 1 standing for Monday)
| | | +------ Month of the Year (range: 0-11)
| | +-------- Day of the Month  (range: 1-31)
| +---------- Hour              (range: 0-23)
+------------ Minute            (range: 0-59)
*/
//          year  month  dayOnMonth hour  minute
// new Date(1995,  11,     17,       3,    24)

const {
  isActive,
  isActiveDay,
  isActiveDate,
  isActiveYear,
} = require("../dist/app")

describe("isActive", () => {
  it("* * * * * * should always be true", () => {
    const result = isActive("* * * * * *")
    expect(result).to.be.true
  })

  it("* * * * * 2017 should always be false", () => {
    const result = isActive("* * * * * 2017")
    expect(result).to.be.false
  })

  it("24 3 17 11 * 1995 should always be true", () => {
    const result = isActive("24 3 17 11 * 1995", new Date(1995, 11, 17, 3, 24))
    expect(result).to.be.true
  })

  it("28 3 17 11 * 1995 should always be false", () => {
    const result = isActive("28 3 17 11 * 1995", new Date(1995, 11, 17, 3, 24))
    expect(result).to.be.false
  })

  it("* 1 17 11 1 1995 should always be false", () => {
    const result = isActive("* 1 17 11 1 1995", new Date(1995, 11, 17, 1, 0))
    expect(result).to.be.false
  })

  it("* 1 17 11 1 2018 should always be true", () => {
    const result = isActive("* 1 17 11 1 2018", new Date(2018, 11, 17, 1, 0))
    expect(result).to.be.true
  })

  it("list * 1 15,17,18 11 * 2018 should always be true 17", () => {
    const result = isActive(
      "* 1 15,17,18 11 * 2018",
      new Date(2018, 11, 17, 1, 0)
    )
    expect(result).to.be.true
  })

  it("list * 1 15,17,18 11 * 2018 should always be true 15", () => {
    const result = isActive(
      "* 1 15,17,18 11 * 2018",
      new Date(2018, 11, 15, 1, 0)
    )
    expect(result).to.be.true
  })

  it("list * 1 15,17,18 11 * 2018 should always be true 18", () => {
    const result = isActive(
      "* 1 15,17,18 11 * 2018",
      new Date(2018, 11, 18, 1, 0)
    )
    expect(result).to.be.true
  })

  it("range * 1 10-13 5-10 * 2018 should always be true", () => {
    const result = isActive(
      "* 1 10-13 5-10 * 2018",
      new Date(2018, 5, 10, 1, 0)
    )
    expect(result).to.be.true
  })

  it("range * 1 14-16 11 0-6 2018 should always be true", () => {
    const result = isActive(
      "* 1 14-16 11 0-6 2018",
      new Date(2018, 11, 15, 1, 0)
    )
    expect(result).to.be.true
  })

  it("range * 1 17-19 11 1 2016-2018 should always be true", () => {
    const result = isActive(
      "* 1 17-19 11 * 2016-2018",
      new Date(2018, 11, 19, 1, 0)
    )
    expect(result).to.be.true
  })

  it("repeated * 1 */4 11 1 2016-2018 should always be true", () => {
    const result = isActive(
      "* 1 */4 11 * 2016-2018",
      new Date(2018, 11, 16, 1, 0)
    )
    expect(result).to.be.true
  })

  it("repeated * 1 5/4 11 1 2018 should always be true", () => {
    const result = isActive("* 1 5/4 11 * 2018", new Date(2018, 11, 9, 1, 0))
    expect(result).to.be.true
  })

  it("repeated 10/10 1 * 11 1 2018 should always be true", () => {
    const result = isActive("10/10 1 * 11 * 2018", new Date(2018, 11, 9, 1, 50))
    expect(result).to.be.true
  })

  it("range with list 0 0-7,16-23 19 11 * 2010-2016,2017-2020 should always be true", () => {
    const result = isActive(
      "0 0-7,16-23 19 11 * 2010-2016,2017-2020",
      new Date(2018, 11, 19, 6, 0)
    )
    expect(result).to.be.true
  })

  it("should throw error on unvalid input", () => {
    expect(() => {
      isActive("123", new Date(2018, 11, 19, 6, 0))
    }).to.throw("parse error: type: minutes value: 123")
  })

  it("should throw CronParseError as name", () => {
    try {
      isActive("1 abc", new Date(2018, 11, 19, 6, 0))
    } catch (error) {
      expect(error.name).equals("CronParseError")
    }
  })
})

describe("isActiveDay", () => {
  it("* * * * 1 * should always be true", () => {
    const result = isActiveDay("* * * * 1 *", new Date("2025-02-10"))
    expect(result).to.be.true
  })

  it("* * * * 1 * should always be false", () => {
    const result = isActiveDay("* * * * 1 *", new Date("2025-02-11"))
    expect(result).to.be.false
  })
})

describe("isActiveDate", () => {
  it("* * 10 * * * should always be true", () => {
    const result = isActiveDate("* * 10 * * *", new Date("2025-02-10"))
    expect(result).to.be.true
  })

  it("* * 10 * * * should always be false", () => {
    const result = isActiveDate("* * 10 * * *", new Date("2025-02-11"))
    expect(result).to.be.false
  })
})

describe("isActiveYear", () => {
  it("* * * * * 2025 should always be true", () => {
    const result = isActiveYear("* * * * * 2025", new Date("2025-02-10"))
    expect(result).to.be.true
  })

  it("* * * * * 2026 should always be false", () => {
    const result = isActiveYear("* * * * * 2026", new Date("2025-02-10"))
    expect(result).to.be.false
  })
})
