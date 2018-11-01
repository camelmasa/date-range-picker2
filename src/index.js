import React from "react"
import ReactDOM from "react-dom"
import DateRangePickerComponent from "./DateRangePickerComponent"
import locales from "./locale"

class DateRangePicker {
  constructor(params) {
    this.locale = (params.locale) ? locales[params.locale] : locales["en"]
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

    this.picker = ReactDOM.render(<DateRangePickerComponent {...this.params} locale={this.locale} />, el)
  }
}

window.DateRangePicker = (params) => (new DateRangePicker(params))
