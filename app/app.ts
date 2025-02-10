import { getActiveBasedOnDate } from "./date-helper"
import {
  parseMinute,
  parseHour,
  parseDayOfMonth,
  parseMonth,
  parseDayOfWeek,
  parseYear,
} from "./parser"

const getCronParts = (string: string) => {
  const [minutes, hours, dayOfMonth, monthOfYear, dayOfWeek, year] =
    string.split(" ")

  return {
    minutes,
    hours,
    dayOfMonth,
    monthOfYear,
    dayOfWeek,
    year,
  }
}

const isAnyValueEmpty = (collection: Array<Array<number>>) =>
  !!collection.find((values) => values.length === 0)

export const isActive = (cronString: string, matchTime = new Date()) => {
  const cronParts = getCronParts(cronString.trim())

  const minutes = parseMinute(cronParts.minutes, matchTime)
  const hours = parseHour(cronParts.hours, matchTime)
  const daysInMonth = parseDayOfMonth(cronParts.dayOfMonth, matchTime)
  const monthOfYear = parseMonth(cronParts.monthOfYear, matchTime)
  const dayOfWeek = parseDayOfWeek(cronParts.dayOfWeek, matchTime)
  const year = parseYear(cronParts.year, matchTime)

  const activeValues = getActiveBasedOnDate(
    [minutes, hours, daysInMonth, monthOfYear, dayOfWeek, year],
    matchTime
  )

  return !isAnyValueEmpty(activeValues)
}

export const isActiveDay = (cronString: string, matchTime = new Date()) => {
  const cronParts = getCronParts(cronString.trim())
  const dayOfWeek = parseDayOfWeek(cronParts.dayOfWeek, matchTime)

  return dayOfWeek.some((weekDay) => matchTime.getDay() === weekDay)
}

export const isActiveDate = (cronString: string, matchTime = new Date()) => {
  const cronParts = getCronParts(cronString.trim())
  const daysInMonth = parseDayOfMonth(cronParts.dayOfMonth, matchTime)

  return daysInMonth.some((day) => matchTime.getDate() === day)
}

export const isActiveYear = (cronString: string, matchTime = new Date()) => {
  const cronParts = getCronParts(cronString.trim())
  const years = parseYear(cronParts.year, matchTime)

  return years.some((year) => matchTime.getFullYear() === year)
}
