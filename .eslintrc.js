const grnx = require('@grnx-utils/eslint')

module.exports = grnx({
  root: __dirname,
  ext: {
    'no-bitwise': ['off'],
    'no-void': ['off']
  }
})
