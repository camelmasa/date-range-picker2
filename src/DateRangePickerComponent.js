import React, { Component } from "react"
// import Swiper from 'swiper/dist/js/swiper.esm.bundle'
import Siema from 'siema/dist/siema.min.js'
import dayjs from "dayjs"
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
    this.locale = props.locale

    this.state = {
      color: props.color || "#00b5a3",
      startDay: props.startDay || dayjs(),
      endDay: props.endDay || dayjs().add(DAY_LENGTH - 1, 'days'),
      submit: props.submit || (() => {}),
      cancel: props.cancel || (() => {}),
      currentMonth: dayjs().startOf('month'),
      selectorStart: true,
      cancelDisable: false,
      submitDisable: false
    }
    this.state.calendars = this._createCalendars(dayjs().startOf('month'), this.state.startDay, this.state.endDay)

    this.backYear = this.backYear.bind(this)
    this.nextYear = this.nextYear.bind(this)
    this.backMonth = this.backMonth.bind(this)
    this.nextMonth = this.nextMonth.bind(this)
    this.selectDay = this.selectDay.bind(this)
    this.cancel = this.cancel.bind(this)
    this.submit = this.submit.bind(this)
    this.enableCancelButton = this.enableCancelButton.bind(this)
    this.enableSubmitButton = this.enableSubmitButton.bind(this)
  }

  componentDidMount() {
    const swiper = new Siema({
      selector: ".swiper-container",
      startIndex: 1,
      onChange: () => {
        console.log(swiper.currentSlide)

        const { currentMonth, startDay, endDay } = this.state
        const newCurrentMonth = dayjs(currentMonth).add(1, 'months')

        console.log(this._createCalendars(newCurrentMonth, startDay, endDay)[2])
        
        swiper.append(this._createCalendars(newCurrentMonth, startDay, endDay)[2])

        // this._monthAdd(swiper.currentSlide - 1)

        // swiper.currentSlide = 1
        // swiper.updateAfterDrag()
      },
    })

    // const swiper = new Swiper('.swiper-container', {
    //   initialSlide: 1,
    //   on: {
    //     transitionEnd: () => {
    //       // swiper is undefined when rendering view
    //       if (!swiper) return

    //       this._monthAdd(swiper.activeIndex - 1)

    //       swiper.activeIndex = 1
    //       swiper.update()
    //     }
    //   }
    // })
    this.swiper = swiper
  }

  backYear() {
    this._monthAdd(-12)
  }

  nextYear() {
    this._monthAdd(12)
  }

  backMonth() {
    this.swiper.prev()
  }

  nextMonth() {
    this.swiper.next()
  }

  selectDay(day) {
    const { startDay, selectorStart, currentMonth } = this.state

    // cancel to select same day
    if (startDay.format("YYYYMMDD") == day.format("YYYYMMDD")) return

    // For rerender calendars
    if (selectorStart || startDay > day) {
      const calendars = this._createCalendars(currentMonth, day, null)
      this.setState({ startDay: day, endDay: null, selectorStart: false, calendars: calendars, submitDisable: true })
    }
    else {
      const calendars = this._createCalendars(currentMonth, startDay, day)
      this.setState({ endDay: day, selectorStart: true, calendars: calendars, submitDisable: false })
    }
  }

  cancel() {
    this.setState({ cancelDisable: true }, () => {
      this.state.cancel()
    })
  }

  submit() {
    this.setState({ submitDisable: true }, () => {
      const { startDay, endDay, submit } = this.state

      submit(startDay, endDay)
    })
  }

  enableCancelButton() {
    this.setState({ cancelDisable: false })
  }

  enableSubmitButton() {
    this.setState({ submitDisable: false })
  }

  _monthAdd(months) {
    const { currentMonth, startDay, endDay } = this.state
    const newCurrentMonth = dayjs(currentMonth).add(months, 'months')
    const calendars = this._createCalendars(newCurrentMonth, startDay, endDay)

    this.setState({
      currentMonth: newCurrentMonth,
      calendars: calendars
    })
  }

  _createCalendars(currentMonth, startDay, endDay) {
    const { color } = this.state
    const l = this.locale

    return [...Array(CALENDAR_CONTAINER_LENGTH).keys()].map((i) => {
      const startOfMonth = dayjs(currentMonth).add(i - 1, 'months').startOf('month')
      const endOfMonth = dayjs(startOfMonth).endOf('month')
      const trueStartOfMonth = dayjs(startOfMonth).subtract(startOfMonth.day(), 'days')

      const weeks = [...Array(WEEK_LENGTH).keys()].map((j) => {
        const days = [...Array(DAY_LENGTH).keys()].map((k) => {
          const day = dayjs(trueStartOfMonth).add((j * DAY_LENGTH) + k, 'days')

          // conditions
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
    const { color, startDay, endDay, currentMonth, selectorStart, calendars, cancelDisable, submitDisable } = this.state
    const l = this.locale

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

    const dayOfWeeks = l.dayOfWeek.map((dayOfWeek, i) => {
      return (
        <span key={i}>
          {dayOfWeek}
        </span>
      )
    })

    const arrowComponentStyle = { color: color }
    const dayOfWeekComponentStyle = { color: color, borderColor: color }
    const buttonStyle = { color: color }
    const cancelClass = classNames({
      'button': true,
      'disable': cancelDisable
    })
    const submitClass = classNames({
      'button': true,
      'disable': submitDisable
    })

    const startDayComponent = (
      <div className="start-day">
        <span className="arrow-component" onClick={this.backYear} style={arrowComponentStyle}>
          <Arrow className="arrow" />
        </span>
        <span>{dayjs(currentMonth).format(l.yearFormat)}</span>
        <span className="arrow-component" onClick={this.nextYear} style={arrowComponentStyle}>
          <Arrow className="arrow right-arrow" />
        </span>
      </div>
    )

    const endDayComponent = (
      <div className="end-day">
        <span className="arrow-component" onClick={this.backMonth} style={arrowComponentStyle}>
          <Arrow className="arrow" />
        </span>
        <span>{dayjs(currentMonth).format(l.monthFormat)}</span>
        <span className="arrow-component" onClick={this.nextMonth} style={arrowComponentStyle}>
          <Arrow className="arrow right-arrow"/>
        </span>
      </div>
    )

    const yearMonthHeader = (l.name == "ja") ? (
      <div className="header-component">
        {startDayComponent}
        {endDayComponent}
      </div>
    ) : (
      <div className="header-component">
        {endDayComponent}
        {startDayComponent}
      </div>
    )

    return (
      <div className="drp-container">
        <div className="show-component">
          <div className={startDayClass} style={startDayStyle}>
            <span>{l.start}</span>
            <span>{startDay.format(l.startFormat)}</span>
          </div>
          <div className={endDayClass} style={endDayStyle}>
            <span>{l.end}</span>
            <span>{(endDay) ? endDay.format(l.endFormat) : "" }</span>
          </div>
        </div>

        {yearMonthHeader}

        <div className="dayofweek-component" style={dayOfWeekComponentStyle}>
          {dayOfWeeks}
        </div>

        <div className="swiper-container">
          {calendars}
        </div>

        <div className="button-component">
          <button onClick={this.cancel} className={cancelClass} style={buttonStyle} disabled={cancelDisable}>{l.cancel}</button>
          <button onClick={this.submit} className={submitClass} style={buttonStyle} disabled={submitDisable}>{l.submit}</button>
        </div>
      </div>
    )
  }
}

export default DateRangePickerComponent
