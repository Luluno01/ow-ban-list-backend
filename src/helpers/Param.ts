import BadRequest from '../response/BadRequest'


export class RequireParameterError extends Error {}
export type SupportedType = 'string' | 'number' | 'boolean' | 'int'

function getTypeErrorResponse(param: string, type: SupportedType) {
  return new BadRequest(`Invalid type of parameter "${param}" of ${type} type`)
}

function getMissingResponse(param: string, type: SupportedType) {
  return new BadRequest(`Missing parameter "${param}" of ${type} type`)
}

export class Param {
  private queryString: { [name: string]: string }
  errRes?: BadRequest
  constructor(queryString: { [name: string]: string }) {
    this.queryString = queryString
  }
  param: { [name: string]: string | number | boolean } = {}
  require(param: string, type: SupportedType = 'string', optional: boolean = false) {
    if(optional) {
      if(!(param in this.queryString)) return this
    } else if(!(param in this.queryString)) {
      this.errRes = getMissingResponse(param, type)
      throw new RequireParameterError
    }
    switch(type) {
      case 'string': {
        this.param[param] = this.queryString[param]
        return this
      }
      case 'int': {
        if(!this.queryString[param].match(/^\d+$/)) {
          this.errRes = getTypeErrorResponse(param, type)
          throw new RequireParameterError
        }
        this.param[param] = parseInt(this.queryString[param])
        return this
      }
      case 'number': {
        if(!this.queryString[param].match(/^(\d+)(.\d+)?$/)) {
          this.errRes = getTypeErrorResponse(param, type)
          throw new RequireParameterError
        }
        this.param[param] = parseFloat(this.queryString[param])
        return this
      }
      case 'boolean': {
        switch(this.queryString[param]) {
          case '1':
          case 'true':
          case 'True':
          case 'TRUE': {
            this.param[param] = true
            return this
          }
          case '0':
          case 'false':
          case 'False':
          case 'FALSE': {
            this.param[param] = false
            return this
          }
          default: {
            this.errRes = getTypeErrorResponse(param, type)
            throw new RequireParameterError
          }
        }
      }
    }
  }
}

export default Param