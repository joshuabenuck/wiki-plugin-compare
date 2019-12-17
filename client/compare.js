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
  let lines = text.trim().split('\n')
  let props = {}
  let name = lines.shift()
  props['name'] = name
  for (line of lines) {
    let [key, value] = line.split(':')
    props[key] = value
  }
  return props
}

function parse_config(text) {
  let lines = text.trim().split('\n')
  let orient = 'horiz'
  let cols = ['name']
  for (line of lines) {
    if (line == 'vert' || line == 'horiz') {
      orient = line
      continue
    }
    cols = cols.concat(line.trim().split(" "))
  }
  return { orient, cols }
}

function bind($item, item) {
  // TODO: Allow editing of content / create DSL to configure # of entries to keep.
  let candidates = $(`.item:lt(${$('.item').index($item)})`).filter(".specs")
  let sources = []
  if (candidates.size()) {
    $item.empty()
    let style = `
    table {
      border-collapse: collapse;
    }

    tr, td, th {
      border: 1px solid black;
      padding: 5px;
    }

    th {
      background-color: #a8a8a8;
    }

    tbody tr:nth-child(odd) {
      background-color: #ffffff;
    }

    tbody tr:nth-child(even) {
      background-color: #e8e8e8;
    }
    `
    $('<style>').html(style).appendTo($item)
    let specs = []
    for (spec of candidates.toArray()) {
      specs.push($(spec).data('item').text)
    }
    let $table = $('<table>').appendTo($item).css('border-collapse', 'collapse')
    let $thead = $('<thead>').appendTo($table)
    let $tbody = $('<tbody>').appendTo($table)
    let config = parse_config(item.text)
    if (config.orient == "horiz") {
      let $th_tr = $('<tr>').appendTo($thead)
      for (column of config.cols) {
        let $th = $('<th>').appendTo($th_tr).text(column)
      }
      for (spec of specs) {
        let $tr = $('<tr>').appendTo($table)
        for (column of config.cols) {
          let props = parse_spec(spec)
          $tr.append($('<td>').text(props[column]))
        }
      }
    }
    if (config.orient == "vert") {
      for (column of config.cols) {
        let $tr = $('<tr>').appendTo($tbody)
        $('<th>').text(column).appendTo($tr)
        for (spec of specs) {
          props = parse_spec(spec)
          $('<td>').text(props[column]).appendTo($tr)
        }
      }
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
