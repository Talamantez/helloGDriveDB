var jsonfile = require('jsonfile');
 
var file = 'data.json'
var obj = {name: 'JP'}
 
jsonfile.writeFile(file, obj, function (err) {
  console.error(err)
})