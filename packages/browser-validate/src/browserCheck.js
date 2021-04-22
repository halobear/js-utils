const vsakt = {
  c: '89',
  f: 86,
  s: '13.1.2',
  e: 89,
  i: 12,
  ios: '13.3',
  samsung: '13.0.1',
  o: 74,
  e_a: '46.01.2.5140',
  o_a: 61,
  y: '21.2.3',
  v: 3.6,
  uc: '13.3.8',
}
const vsinsecure_below = {
  c: '69.0.3497.100',
  f: 76,
  s: '11.1.1',
  e: 16,
  i: 11,
  ios: '12.3',
  samsung: 12.0,
  o: 62,
  o_a: 52,
  y: '20',
  v: '2.7',
  uc: '13.1',
}
const vsdefault = {
  c: -20,
  f: -3,
  s: -1,
  e: 17,
  i: 17, // 11
  ios: 10,
  samsung: 9.9,
  o: -3,
  o_a: -3,
  y: 20.4,
  v: 2.6,
  uc: 13.0,
  a: 535,
}
const names = {
  c: 'Chrome',
  f: 'Firefox',
  s: 'Safari',
  e: 'Edge',
  i: 'Internet Explorer',
  ios: 'iOS',
  samsung: 'Samsung Internet',
  o: 'Opera',
  o_a: 'Opera',
  e_a: 'Edge',
  y: 'Yandex Browser',
  v: 'Vivaldi',
  uc: 'UC Browser',
  a: 'Android Browser',
  x: 'Other',
  silk: 'Silk',
}

const semver = function (vstr) {
  if (vstr instanceof Array) return vstr
  var x = (vstr + '.0.0.0').split('.')
  return [parseInt(x[0]) || 0, parseInt(x[1]) || 0, parseInt(x[2]) || 0, parseInt(x[3]) || 0]
}

const less = function (v1, v2) {
  //semantic version comparison: returns 1 if v1<v2 , 0 if equal, -1 if v1>v2
  v1 = semver(v1)
  v2 = semver(v2)
  for (var i = 0; ; i++) {
    if (i >= v1.length) return i >= v2.length ? 0 : 1
    if (i >= v2.length) return -1
    var diff = v2[i] - v1[i]
    if (diff) return diff > 0 ? 1 : -1
  }
}

const available_ios = function (ua, v) {
  var h = Math.max(window.screen.height, window.screen.width),
    pr = window.devicePixelRatio
  if (/ipad/i.test(ua)) {
    if (h == 1024 && pr == 2)
      // iPad 3 (iOS 9), 4, 5, Mini 2, Mini 3, Mini 4, Air, Air 2, Pro 9.7
      return 10 //? only ipad 4 has ios 10, all other can have ios 11
    if (h == 1112)
      // iPad Pro 10.5
      return 15
    if (h == 1366)
      //iPad Pro 12.9, Pro 12.9 (2nd Gen)
      return 15
    if (h == 1024 && v < 6) return 5 // iPad
    return 9 // iPad 2, iPad Mini
  }
  if (pr == 1)
    // 1/3G/3GS
    return 6 //for 3GS
  if (h == 812)
    // && pr == 3)// X
    return 11 + 4
  if (h == 736 || h == 667)
    // && pr == 3)// 6+/6s+/7+ and 8+ or // 6+/6s+/7+ and 8+ in zoom mode + // 6/6s/7 and 8
    return 12 //latest version for iphone 6 is 12, 13 is for 6S
  if (h == 568)
    // 5/5C/5s/SE or 6/6s/7 and 8 in zoom mode
    return 10
  if (h == 480)
    // i4/4s
    return 7
  return 6
}

function get_browser(ua) {
  ua = (ua || navigator.userAgent).replace('_', '.')
  const r = { n: 'x', v: 0, t: 'other browser', age_years: undefined, no_device_update: false, available: vsakt }
  function ignore(reason, pattern) {
    if (new RegExp(pattern, 'i').test(ua)) return reason
    return false
  }
  r.other =
    ignore(
      'bot',
      'Pagespeed|pingdom|Preview|ktxn|dynatrace|Ruxit|PhantomJS|Headless|Lighthouse|bot|spider|archiver|transcoder|crawl|checker|monitoring|prerender|screenshot|python-|php|uptime|validator|fetcher|facebook|slurp|google|yahoo|node|mail.ru|github|cloudflare|addthis|thumb|proxy|feed|fetch|favicon|link|http|scrape|seo|page|search console|AOLBuild|Teoma|Expeditor'
    ) ||
    ignore('TV', 'SMART-TV|SmartTV') ||
    ignore(
      'niche browser',
      'OculusBrowser|Falkon|Brave|Classic Browser|Dorado|LBBROWSER|Focus|waterfox|Firefox/56.2|Firefox/56.3|Whale|MIDP|k-meleon|sparrow|wii|Chromium|Puffin|Opera Mini|maxthon|maxton|dolfin|dolphin|seamonkey|opera mini|netfront|moblin|maemo|arora|kazehakase|epiphany|konqueror|rekonq|symbian|webos|PaleMoon|Basilisk|QupZilla|Otter|Midori|qutebrowser|slimjet'
    ) ||
    ignore(
      'mobile without upgrade path or landing page',
      'OPR/44.12.2246|cros|kindle|tizen|silk|blackberry|bb10|RIM|PlayBook|meego|nokia|ucweb|ZuneWP7|537.85.10'
    )
  //        ignore("android(chrome) web view","; wv");
  r.embedded = /"QtWebEngine|Teams|Electron/i.test(ua)
  r.mobile = /iphone|ipod|ipad|android|mobile|phone|ios|iemobile/i.test(ua)
  r.discontinued = /netscape|greenbrowser|camino|flot|fennec|galeon|coolnovo/i.test(ua)

  const pats = [
    ['CriOS.VV', 'c', 'ios'],
    ['FxiOS.VV', 'f', 'ios'],
    ['Trident.*rv:VV', 'i', 'i'],
    ['Trident.VV', 'io', 'i'],
    ['UCBrowser.VV', 'uc', 'c'],
    ['MSIE.VV', 'i', 'i'],
    ['Edge.VV', 'e', 'e'],
    ['Edg.VV', 'e', 'c'],
    ['EdgA.VV', 'e_a', 'c'],
    ['Vivaldi.VV', 'v', 'c'],
    ['Android.*OPR.VV', 'o_a', 'c'],
    ['OPR.VV', 'o', 'c'],
    ['YaBrowser.VV', 'y', 'c'],
    ['SamsungBrowser.VV', 'samsung', 'c'],
    ['Silk.VV', 'silk', 'c'],
    ['Chrome.VV', 'c', 'c'],
    ['Firefox.VV', 'f', 'f'],
    [' OS.VV.*Safari', 'ios', 'ios'],
    ['Version.VV.*Safari', 's', 's'],
    ['Safari.VV', 'so', 's'],
    ['Opera.*Version.VV', 'o'],
    ['Opera.VV', 'o'],
  ]
  const VV = '(\\d+\\.?\\d+\\.?\\d*\\.?\\d*)'
  for (let i = 0; i < pats.length; i++) {
    if (ua.match(new RegExp(pats[i][0].replace('VV', VV), 'i'))) {
      r.n = pats[i][1]
      r.engine = pats[i][2]
      break
    }
  }
  r.fullv = RegExp.$1
  r.v = parseFloat(r.fullv)

  // Special treatment of some systems
  //do not notify old systems since there is no up-to-date browser available
  if (/windows.nt.5.0|windows.nt.4.0|windows.95|windows.98|os x 10.2|os x 10.3|os x 10.4|os x 10.5/i.test(ua)) {
    r.no_device_update = true
    r.available = {}
  }
  //Safari on iOS 13 in Desktop mode
  if (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1) {
    r.n = 'ios'
    r.engine = 'ios'
    r.fullv = r.v = 13
    r.no_device_update = true //For now, never show a message, TODO!
  }
  //iOS
  if (/iphone|ipod|ipad|ios/i.test(ua)) {
    ua.match(new RegExp('OS.' + VV, 'i'))
    r.n = 'ios'
    r.fullv = RegExp.$1
    r.v = parseFloat(r.fullv)
    r.engine = 'ios'
    var av = available_ios(ua, r.v)
    /*
    var newmap={10:"10.3.4",11:"12.4.3",12:"12.4.3",13:vsakt["ios"]};

    if (av in newmap)
        av=newmap[av];
    */
    if (av < 12 && Math.round(r.v) === 11)
      // all devices with ios 11 support ios 12
      av = 12
    r.available = { ios: av }
    if (parseFloat(r.available.ios) < 11) r.no_device_update = true
  }

  //winxp/vista/2003
  if (/windows.nt.5.1|windows.nt.5.2|windows.nt.6.0/i.test(ua)) {
    r.available = { c: 49.9, f: 52.9 }
  }
  //old mac
  if (/os x 10.6/i.test(ua)) {
    r.available = { s: '5.1.10', c: 49.9, f: 48 }
    r.no_device_update = true
  }

  if (/os x 10.7|os x 10.8/i.test(ua)) {
    r.available = { s: '6.2.8', c: 49.9, f: 48 }
    r.no_device_update = true
  }
  if (/os x 10.9/i.test(ua)) r.available.s = '9.1.3'

  if (/os x 10.10/i.test(ua)) r.available.s = '10.1.2'

  //check for android stock browser
  if (ua.indexOf('Android') > -1 && r.n === 's') {
    var v = parseInt((/WebKit\/([0-9]+)/i.exec(ua) || 0)[1], 10) || 2000
    if (v <= 534) {
      r.n = 'a'
      r.fullv = r.v = v
      r.is_insecure = true
    }
  }

  // Special treatment of some browsers
  if (r.n === 'so') {
    r.v = r.fullv = 4.0
    r.n = 's'
  }
  if (r.n === 'io') {
    r.n = 'i'
    if (r.v > 6) r.v = 11
    else if (r.v > 5) r.v = 10
    else if (r.v > 4) r.v = 9
    else if (r.v > 3.1) r.v = 8
    else if (r.v > 3) r.v = 7
    else r.v = 9
    r.fullv = r.v
  }
  r.t = names[r.n] + ' ' + r.v
  r.is_supported = r.is_latest = !vsakt[r.n] ? undefined : less(r.fullv, vsakt[r.n]) <= 0

  r.vmaj = Math.round(r.v)

  r.is_insecure = r.is_insecure || !vsinsecure_below[r.n] ? undefined : less(r.fullv, vsinsecure_below[r.n]) === 1

  if ((r.n === 'f' && r.vmaj === 78) || (r.n === 'i' && r.vmaj === 11)) {
    r.is_supported = true
    r.is_insecure = false
    if (r.n === 'f') r.esr = true
  }
  if (r.n === 'ios' && r.v > 10.3) r.is_supported = true
  if (r.n === 'a' || r.n === 'x') r.t = names[r.n]
  if (r.n === 'e') {
    r.t = names[r.n] + ' ' + r.vmaj
    r.is_supported = less(r.fullv, '18.15063') != 1
  }
  if (r.n in ['c', 'f', 'o', 'e'] && less(r.fullv, parseFloat(vsakt[r.n]) - 1) <= 0) r.is_supported = true //mark also the version before the current version as supported to make the transitions smoother

  var releases_per_year = { f: 7, c: 8, o: 8, i: 1, e: 1, s: 1 } //,'v':1}
  if (releases_per_year[r.n]) {
    r.age_years = Math.round(((vsakt[r.n] - r.v) / releases_per_year[r.n]) * 10) / 10 || 0
  }
  var engines = { e: 'Edge.VV', c: 'Chrome.VV', f: 'Firefox.VV', s: 'Version.VV', i: 'MSIE.VV', ios: ' OS.VV' }
  if (r.engine) {
    ua.match(new RegExp(engines[r.engine].replace('VV', VV), 'i'))
    r.engine_version = parseFloat(RegExp.$1)
  }
  return r
}

function browserCheck() {
  const required_min = { i: 10, f: 11, o: 21, s: 8, c: 30 }
  const required = {}
  for (const b in vsdefault) {
    if (!(b in required) || required[b] == null) required[b] = vsdefault[b]
    if (less(required[b], 0) >= 0)
      // case for required <= 0 --> relative to latest version
      required[b] = parseFloat(vsakt[b]) + parseFloat(required[b]) // TODO: make it work for string version
    if (required_min[b] && less(required[b], required_min[b]) === 1)
      // required < required_min
      required[b] = required_min[b]
  }

  const bb = get_browser()
  const is_below_required = required[bb.n] && less(bb.fullv, required[bb.n]) === 1
  const hide_reasons = []
  const reasons = []
  if (bb.other !== false) hide_reasons.push('其他浏览器:' + bb.other)
  if (bb.embedded !== false) hide_reasons.push('is embedded browser:' + bb.embedded)
  if (bb.mobile && bb.mobile === false) hide_reasons.push('移动端不提示')
  if (bb.is_latest)
    //the latest versions of a browser can not be notified
    hide_reasons.push('已经是最新浏览器了')
  if (bb.no_device_update) hide_reasons.push('设备不需要升级')
  if (is_below_required) reasons.push('版本过低')
  return { hide_reasons, reasons, valid: hide_reasons.length > 0 || !reasons.length }
}

export default browserCheck
