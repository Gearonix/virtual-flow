export class UseVirtualValidateException extends Error {
  name = 'UseVirtualValidateException'

  constructor() {
    super(
      ` You must set either itemHeight (constant length) or estimateHeight 
        (if you choose dynamic selection, the height of items)`
    )
  }
}

export class JsconfigNotFoundException extends Error {
  name = 'JsconfigNotFoundException'

  constructor() {
    super(
      'Cannot find jsconfig.json in the root. ' +
        'Please specify root directory manually using "configure" parameters, ' +
        'or use "jsconfig" option in "alias" preset'
    )
  }
}
