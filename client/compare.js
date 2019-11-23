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

function parse(text) {
  let lines = lines.trim().split('\n')
  let specs = []
  for (line of lines) {
    let [key, value] = line.split(':')
  }
}

function bind($item, item) {
  // TODO: Allow editing of content / create DSL to configure # of entries to keep.
  let candidates = $(`.item:lt(${$('.item').index($item)})`).filter(".specs")
  let sources = []
  if (candidates.size()) {
    $item.empty()
    let specs = []
    for (spec of candidates.toArray()) {
      specs.push($(spec).data('item').text)
    }
    let $table = $('<table>').appendTo($item)
    let $th = $('<th>').appendTo($table)
    let columns = item.text.trim().split(" ")
    for (column of columns) {
      $th.append($('<td>').text(column))
      let $tr = $('<tr>').appendTo($table)
      for (spec of specs) {
        $tr.append($('<td>').text(spec))
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
