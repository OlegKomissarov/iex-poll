const mocha = require('mocha')
const describe = mocha.describe

// Почему это не подключается?
const datastore = require('../endpoint/src/datastore')

describe('datastore', () => {
  it('should return list of data', done => {
    // done()
    datastore.list()
      .then(response => {
        if(!response || !response.length){
          console.log('Expected filled array, but got ' + response)
        }
        done()
      })
  })
})

// it("should async multiply two numbers", function(done){
//   let expectedResult = 12;
//   let result = 12;
//   setTimeout(function(){
//     console.log(12)
//     if (result !== expectedResult) {
//       throw new Error(`Expected ${expectedResult}, but got ${result}`);
//     }
//     done();
//   }, 1000)
//   // operations.multiplyAsync(4, 3, function(result){
//   //   if(result!==expectedResult){
//   //     throw new Error(`Expected ${expectedResult}, but got ${result}`);
//   //   }
//   //   done();
//   // });
// });