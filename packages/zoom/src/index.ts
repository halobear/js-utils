import $ from '@halobear/dom'

console.log($)

function test() {
  $('div').transition(1000).transform('translateY(100px)')
}

export default test
