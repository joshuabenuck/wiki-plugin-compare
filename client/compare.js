(function() {

function ago (msec) {
  let secs,mins,hrs,days,weeks,months,years
  secs = msec/1000
  if ((mins = secs/60) < 2) return `${Math.round(secs)} seconds`
  if ((hrs = mins/60) < 2) return `${Math.round(mins)} minutes`
  if ((days = hrs/24) < 2) return `${Math.round(hrs)} hours`
  if ((weeks = days/7) < 2) return `${Math.round(days)} days`
  if ((months = days/31) < 2) return `${Math.round(weeks)} weeks`
  if ((years = days/365) < 2) return `${Math.round(months)} months`
  return `${Math.round(years)} years`
}

/*
const expand = (text) => {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\*(.+?)\/g, '<i>$1</i>')
};

const absolute = (url) => {
  // https://github.com/bitinn/node-fetch/issues/481
  return url.replace(/^(https?:)\/([^\/])/,`$1//${location.host}/$2`)
}

const parse = (text) => {
  var schedule = {sites:{}, chunk:'hour', interval:5000, keep:24}
  let output = text.split(/\r?\n/).map (line => {
    var m
    if (m = line.match(/^HOUR (\d+)$/)) {
      schedule.chunk = 'hour'
      schedule.interval = 1000*60*60 / m[1]
    } else if (m = line.match(/^DAY (\d+)$/)) {
      schedule.chunk = 'day'
      schedule.interval = 1000*60*60*24 / m[1]
    } else if (m = line.match(/^MONTH (\d+)$/)) {
      schedule.chunk = 'month'
      schedule.interval = 1000*60*60*24*30 / m[1]
    } else if (m = line.match(/^KEEP (\d+)$/)) {
      schedule.keep = m[1]*1
    } else if (m = line.match(/^SENSOR (\w+) (https?:\S+)$/)) {
      schedule.sites[m[1]] = absolute(m[2])
      line = `SENSOR <a href="${absolute(m[2])}" target=_blank>${m[1]} <img src="/images/external-link-ltr-icon.png"></a>`
    } else {
      line = `<font color=gray>${expand(line)}</font>`
    }
    return line
  }).join('<br>')
  return {output, schedule}
}
*/

function emit($item, item) {
  $item[0].ticks = {}
  $item.addClass('output-item')
  $item.append(`
    <div>
    No specs found to compare.
    </div>`);

  $item.dblclick(() => {
    return wiki.textEditor($item, item);
  });
};

function parse_spec(text) {
  let lines = (text||'').trim().split('\n')
  let props = {}
  for (line of lines) {
    if (line[0] == '#') {
      continue
    }
    // Handle values with colons
    let value = undefined
    let key = line
    let colon_index = line.indexOf(':')
    if (colon_index != -1) {
      key = line.substring(0, colon_index).trim()
      value = line.substring(colon_index+1, line.length).trim()
    }
    // Keep system properties uppercase
    if (key == key.toUpperCase()) {
      props[key] = value
      continue
    }
    props[key.toLowerCase()] = value
  }
  console.log('props', props)
  return props
}

function parse_config(text) {
  let lines = (text||'').trim().split('\n')
  let orient = 'horizontal'
  let cols = undefined
  let type = undefined
  for (line of lines) {
    if (line[0] == '#') {
      continue;
    }
    let [key, value] = line.split(':')
    if (key == 'orientation') {
      orient = value.trim()
    }
    else if (key == 'type') {
      type = value.trim()
    }
    else if (key == 'columns') {
      cols = value.trim().split(",")
      cols = cols.map((c) => c.trim())
    }
    else {
      console.log(`Warning: Unrecognized key '${key}'`)
    }
  }
  console.log('columns', cols)
  return { orient, cols, type }
}

function bind($item, item) {
  // TODO: Allow editing of content / create DSL to configure # of entries to keep.
  let candidates = $(`.item:lt(${$('.item').index($item)})`).filter(".specs")
  let sources = []
  if (candidates.size()) {
    $item.empty()
    let style = `
    .compare table {
      border-collapse: collapse;
    }

    .compare tr, .compare td, .compare th {
      border: 1px solid black;
      padding: 5px;
    }

    .compare th {
      background-color: #a8a8a8;
    }

    .compare tbody tr:nth-child(odd) {
      background-color: #ffffff;
    }

    .compare tbody tr:nth-child(even) {
      background-color: #e8e8e8;
    }
    `
    $('<style>').html(style).appendTo($item)
    let specs = []
    let all_columns = new Set()
    let config = parse_config(item.text)
    for (spec of candidates.toArray()) {
      let props = parse_spec($(spec).data('item').text)
      for (key of Object.keys(props)) {
        if (key == key.toUpperCase()) {
          continue
        }
        all_columns.add(key)
      }
      if (config.type && config.type != props['TYPE']) {
        continue
      }
      specs.push(props)
    }
    if (specs.length == 0 && config.type) {
      $item.empty()
      $item.append(`No specs found of type: ${config.type}`)
      return
    }
    let $table = $('<table>').appendTo($item).css('border-collapse', 'collapse')
    let $thead = $('<thead>').appendTo($table)
    let $tbody = $('<tbody>').appendTo($table)
    if (config.orient == "horizontal") {
      let $th_tr = $('<tr>').appendTo($thead)
      for (column of (config.cols || all_columns)) {
        let $th = $('<th>').appendTo($th_tr).text(column)
      }
      for (spec of specs) {
        let $tr = $('<tr>').appendTo($table)
        for (column of (config.cols || all_columns)) {
          $tr.append($('<td>').text(spec[column.toLowerCase()]))
        }
      }
    }
    else if (config.orient == "vertical") {
      for (column of (config.cols || all_columns)) {
        let $tr = $('<tr>').appendTo($tbody)
        $('<th>').text(column).appendTo($tr)
        for (spec of specs) {
          $('<td>').text(spec[column.toLowerCase()]).appendTo($tr)
        }
      }
    }
    else {
      $item.empty()
      $item.append(`Unrecognized orientation: '${config.orient}'`)
    }
    console.log('specs', specs)
    return
  }

  /*
  let $button = $item.find('button')
  let parsed = parse(item.text)

  const action = (command) => {
    $button.prop('disabled',true)
    $page = $item.parents('.page')
    if($page.hasClass('local')) {
      return
    }
    slug = $page.attr('id').split('_')[0]
  }
  $button.click(event => action({action:$button.text(),schedule:parsed.schedule}))
  action({})
  */
}

if (typeof window !== "undefined" && window !== null) {
  window.plugins.compare = {consumes: ['.specs'], emit, bind};
}
}).call(this);
