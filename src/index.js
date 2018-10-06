import React from "react"
import ReactDOM from "react-dom"
import DateRangePickerComponent from "./DateRangePickerComponent"

class DateRangePicker {
  constructor(params) {
    this.params = params
  }

  render(el) {
    // For iOS
    el.style["-webkit-tap-highlight-color"] = "transparent"

    ReactDOM.render(<DateRangePickerComponent {...this.params} />, el)
  }
}

window.DateRangePicker = (params) => (new DateRangePicker(params))
