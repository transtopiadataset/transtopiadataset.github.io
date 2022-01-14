import {URL, DIMENSIONS, VIS} from './constants.js'
import {updateCards, updateCardModal} from './cards.js'

d3.csv(URL).then(function(data) {

  // Test whether a specific visualization needs to be shown
  let hash = window.location.hash
  if (hash !== '') {
    let nid = hash.slice(1,hash.length)
    let d = data.filter(e => e.nid === nid)[0]
    if (d !== undefined) {
      updateCardModal(d)
    }  
  }

  var totalVis = data.length
  d3.select('#summary')
    .text(`${totalVis} out of ${totalVis} visualizations`)

  updateCards(data)

  d3.selectAll('.filter:checked')
    .on('change', function() {
      let newData = data
      let changed = []
      DIMENSIONS.forEach(dimension => {
        console.log('dimension',dimension)
        d3.selectAll(`.filter-${dimension}:checked`)
          .each(function() {
            console.log('this.value',this.value)
            changed.push(this.value)
          })
      })
      console.log('changed',changed)
      newData = newData.filter(function(d) {
        if( changed.indexOf(d.data_binding) > -1 ){
          return d
        }
      })
      console.log('newData',newData)
      let vised = []
      VIS.forEach(vis => {
        d3.selectAll(`.filter-${vis}:checked`)
          .each(function() {
            vised.push(this.value)
          })
      })
      console.log('vised',vised)
      newData = newData.filter(function(d) {
        if( vised.indexOf(d.vis) > -1 ){
          return d
        }
      })
      console.log('newData',newData)

      updateCards(newData)
      d3.select('#summary')
        .text(`${newData.length} out of ${totalVis} visualizations`)
    })
})