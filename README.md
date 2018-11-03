# date-range-picker

Date Range Picker for mobile (for now).

![](https://user-images.githubusercontent.com/189824/48969784-e5e27280-f046-11e8-8c4a-d61dffc42bef.gif)


## Usage

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0">
    <title>Date Range Picker Demo</title>
  </head>
  <body>
    <div>
      <div id="date-range-picker"></div>
    </div>

    <script>
      const picker = DateRangePicker({
        locale: "en",
        submit: (startDay, endDay) => {
          const message = 'Selected from ' + startDay.format('YYYY/MM/DD') + ' to ' + endDay.format('YYYY/MM/DD') + '.';
          console.log(message);
        },
        cancel: () => {
          const message = 'Tapped cancel button.';
          console.log(message);
        }
      });
      picker.render('date-range-picker');
    </script>
  </body>
</html>
```
