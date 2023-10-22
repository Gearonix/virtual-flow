import { VIRTUAL_INDEX_ATTRIBUTE } from './consts'

export class UseVirtualValidateException extends Error {
  name = 'UseVirtualValidateException'

  constructor() {
    super(
      ` You must set either itemHeight (constant length) or estimateHeight 
        (if you choose dynamic selection, the height of items)`
    )
  }
}

export class NoVirtualIndexException extends Error {
  name = 'NoVirtualIndexException'

  constructor() {
    super(
      `You forgot to attach the ${VIRTUAL_INDEX_ATTRIBUTE} attribute to 
      your items inside the virtual container`
    )
  }
}

export class UnreachableCaseException extends Error {
  name = 'UnreachableCaseException'

  constructor(exhaustiveValue: never) {
    super(`Unreachable case: value ${exhaustiveValue} was unhandled`)
  }
}
