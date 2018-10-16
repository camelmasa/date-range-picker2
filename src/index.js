import React from "react"
import ReactDOM from "react-dom"
import DateRangePickerComponent from "./DateRangePickerComponent"

class DateRangePicker {
  constructor(params) {
    this.params = params
    this.picker = null
  }

  enableSubmitButton() {
    this.picker.enableSubmitButton()
  }

  enableCancelButton() {
    this.picker.enableCancelButton()
  }

  render(el) {
    // For iOS
    el.style["-webkit-tap-highlight-color"] = "transparent"

    this.picker = ReactDOM.render(<DateRangePickerComponent {...this.params} />, el)
  }
}

window.DateRangePicker = (params) => (new DateRangePicker(params))
