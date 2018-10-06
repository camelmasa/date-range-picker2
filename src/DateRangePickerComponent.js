import React, { Component } from "react"
import Swiper from 'swiper/dist/js/swiper.esm.bundle'
import moment from "moment"
import classNames from "classnames"

import "./css/index.css"
import Arrow from "./image/arrow.svg"

const CALENDAR_CONTAINER_LENGTH = 3
const WEEK_LENGTH = 6
const DAY_LENGTH = 7

class DateRangePickerComponent extends Component {
  constructor(props) {
    super(props)

    this.swiper = null

    this.state = {
      color: props.color || "#00b5a3",
      startDay: props.startDay || moment(),
      endDay: props.endDay || moment().add(DAY_LENGTH - 1, 'days'),
      submit: props.submit || (() => {}),
      cancel: props.cancel || (() => {}),
      currentMonth: moment().startOf('month'),
      selectorStart: true,
    }
    this.state.calendars = this._createCalendars(moment().startOf('month'), this.state.startDay, this.state.endDay)

    this.backYear = this.backYear.bind(this)
    this.nextYear = this.nextYear.bind(this)
    this.backMonth = this.backMonth.bind(this)
    this.nextMonth = this.nextMonth.bind(this)
    this.selectDay = this.selectDay.bind(this)
    this.cancel = this.cancel.bind(this)
    this.submit = this.submit.bind(this)
  }

  componentDidMount() {
    const swiper = new Swiper('.swiper-container', {
      initialSlide: 1,
      on: {
        transitionEnd: () => {
          // swiper is undefined when rendering view
          if (!swiper) return

          this._monthAdd(swiper.activeIndex - 1)

          swiper.activeIndex = 1
          swiper.update()
        }
      }
    })
    this.swiper = swiper
  }

  backYear() {
    this._monthAdd(-12)
  }

  nextYear() {
    this._monthAdd(12)
  }

  backMonth() {
    this.swiper.slidePrev()
  }

  nextMonth() {
    this.swiper.slideNext()
  }

  selectDay(day) {
    const { startDay, selectorStart, currentMonth } = this.state

    // cancel to select same day
    if (startDay.format("YYYYMMDD") == day.format("YYYYMMDD")) return

    // For rerender calendars
    if (selectorStart || startDay > day) {
      const calendars = this._createCalendars(currentMonth, day, null)
      this.setState({ startDay: day, endDay: null, selectorStart: false, calendars: calendars })
    }
    else {
      const calendars = this._createCalendars(currentMonth, startDay, day)
      this.setState({ endDay: day, selectorStart: true, calendars: calendars })
    }
  }

  cancel() {
    this.state.cancel()
  }

  submit() {
    const { startDay, endDay, submit } = this.state

    if (endDay == null) return

    submit(startDay, endDay)
  }

  _monthAdd(months) {
    const { currentMonth, startDay, endDay } = this.state
    const newCurrentMonth = moment(currentMonth).add(months, 'months')
    const calendars = this._createCalendars(newCurrentMonth, startDay, endDay)

    this.setState({
      currentMonth: newCurrentMonth,
      calendars: calendars
    })
  }

  _createCalendars(currentMonth, startDay, endDay) {
    const { color } = this.state

    return [...Array(CALENDAR_CONTAINER_LENGTH).keys()].map((i) => {
      const startOfMonth = moment(currentMonth).add(i - 1, 'months').startOf('month')
      const endOfMonth = moment(startOfMonth).endOf('month')
      const trueStartOfMonth = moment(startOfMonth).subtract(startOfMonth.weekday(), 'days')

      const weeks = [...Array(WEEK_LENGTH).keys()].map((j) => {
        const days = [...Array(DAY_LENGTH).keys()].map((k) => {
          const day = moment(trueStartOfMonth).add((j * DAY_LENGTH) + k, 'days')

          // conditionals
          const notThisMonth  = (startOfMonth > day || endOfMonth < day)
          const afterStartDay = (startDay && startDay.format("YYYYMMDD") < day.format("YYYYMMDD"))
          const beforeEndDay  = (endDay && endDay.format("YYYYMMDD") > day.format("YYYYMMDD"))
          const equalStartDay = (startDay && startDay.format("YYYYMMDD") == day.format("YYYYMMDD"))
          const equalEndDay   = (endDay && endDay.format("YYYYMMDD") == day.format("YYYYMMDD"))

          const dayContainerClass = classNames({
            'day-container': true,
            'range': afterStartDay && beforeEndDay
          })
          const leftBackgroundClass = classNames({
            'background left-background': equalEndDay
          })
          const rightBackgroundClass = classNames({
            'background right-background': endDay && equalStartDay
          })
          const dayComponentClass = classNames({
            'day-component': true,
            'point': equalStartDay || equalEndDay
          })
          const dayClass = classNames({
            'day': equalStartDay || equalEndDay,
            'not-this-month': notThisMonth && !(equalStartDay || equalEndDay) && !(afterStartDay && beforeEndDay)
          })

          let dayContainerStyle = {}
          if (afterStartDay && beforeEndDay) {
            dayContainerStyle = { backgroundColor: color }
          }
          const backgroundStyle = { backgroundColor: color }
          let dayComponentStyle = {}
          if (equalStartDay || equalEndDay) {
            dayComponentStyle = { backgroundColor: color }
          }

          return (
            <div className={dayContainerClass} style={dayContainerStyle} onClick={ () => { this.selectDay(day) }} key={k}>
              <div className={leftBackgroundClass} style={backgroundStyle}>
              </div>
              <div className={rightBackgroundClass} style={backgroundStyle}>
              </div>
              <div className={dayComponentClass} style={dayComponentStyle}>
                <span className={dayClass}>
                  {day.format("D")}
                </span>
              </div>
            </div>
          )
        })

        return (
          <div className="week" key={j}>
            {days}
          </div>
        )
      })

      return (
        <div className="swiper-slide" key={i}>
          {weeks}
        </div>
      )
    })
  }

  render() {
    const { color, startDay, endDay, currentMonth, selectorStart, calendars } = this.state
    const startDayClass = classNames({
      'start-day': true,
      'select': selectorStart
    })
    const endDayClass = classNames({
      'end-day': true,
      'select': !selectorStart
    })

    const startDayStyle = { borderColor: color }
    const endDayStyle = { borderColor: color }
    if (selectorStart) {
      Object.assign(startDayStyle, { backgroundColor: color })
    }
    else {
      Object.assign(endDayStyle, { backgroundColor: color })
    }

    const dayOfWeeks = ["日", "月", "火", "水", "木", "金", "土"].map((dayOfWeek, i) => {
      return (
        <span key={i}>
          {dayOfWeek}
        </span>
      )
    })

    const arrowComponentStyle = { color: color }
    const dayOfWeekComponentStyle = { color: color, borderColor: color }
    const buttonStyle = { color: color }
    const submitClass = classNames({
      'disable': !endDay
    })

    return (
      <div className="drp-container">
        <div className="show-component">
          <div className={startDayClass} style={startDayStyle}>
            <span>開始</span>
            <span>{startDay.format("YYYY年MM月DD日")}</span>
          </div>
          <div className={endDayClass} style={endDayStyle}>
            <span>終わり</span>
            <span>{(endDay) ? endDay.format("YYYY年MM月DD日") : "" }</span>
          </div>
        </div>

        <div className="header-component">
          <div className="start-day">
            <span className="arrow-component" onClick={this.backYear} style={arrowComponentStyle}>
              <Arrow className="arrow" />
            </span>
            <span>{moment(currentMonth).format("YYYY年")}</span>
            <span className="arrow-component" onClick={this.nextYear} style={arrowComponentStyle}>
              <Arrow className="arrow right-arrow" />
            </span>
          </div>
          <div className="end-day">
            <span className="arrow-component" onClick={this.backMonth} style={arrowComponentStyle}>
              <Arrow className="arrow" />
            </span>
            <span>{moment(currentMonth).format("M月")}</span>
            <span className="arrow-component" onClick={this.nextMonth} style={arrowComponentStyle}>
              <Arrow className="arrow right-arrow"/>
            </span>
          </div>
        </div>

        <div className="dayofweek-component" style={dayOfWeekComponentStyle}>
          {dayOfWeeks}
        </div>

        <div className="swiper-container">
          <div className="swiper-wrapper">
            {calendars}
          </div>
        </div>

        <div className="button-component">
          <span onClick={this.cancel} style={buttonStyle}>キャンセル</span>
          <span onClick={this.submit} style={buttonStyle} className={submitClass}>決定</span>
        </div>
      </div>
    )
  }
}

export default DateRangePickerComponent
