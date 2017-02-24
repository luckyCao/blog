const MUL = '*'
const DIV = '/'
const INTEGER = 'integer'
const EOF = 'EOF'
class Token {
  /**
   * @param value
   * @param type
   */
  constructor(value, type) {
    this.value = value
    this.type = type
  }
  toString() {
    console.log(`value=${this.value},type=${this.type}`)
  }
}
class Lexer { // 解析token
  constructor(text, pos) {
    this.text = text
    this.pos = pos
    this.curText = this.text[this.pos]
  }
  eat(token, type) {  // 返回value，pos++
    if (token.type === type) {
      const value = token.value
      this.curText = this.text[++this.pos]
      return value
    }
    throw Error()
  }
  getNextToken() {
    if (Number.isInteger(parseInt(this.curText, 10))) {
      this.token = new Token(parseInt(this.curText, 10), INTEGER)
      return
    }
    if (this.curText === MUL) {
      this.token = new Token(this.curText, MUL)
      return
    }
    if (this.curText === DIV) {
      this.token = new Token(this.curText, DIV)
      return
    }
    if (!this.curText) {
      this.token = new Token(this.curText, EOF)
      return
    }
    throw Error()
  }
}

class Interpreter {
  constructor(text) {
    this.Lexer = new Lexer(text, 0)
    this.result = 0
  }
  factor() {
    this.Lexer.getNextToken()
    return this.Lexer.eat(this.Lexer.token, INTEGER)
  }
  expr() {
    this.result = this.factor()
    this.Lexer.getNextToken()
    while (this.Lexer.token.type === MUL || this.Lexer.token.type === DIV) {
      if (this.Lexer.token.type === MUL) {
        this.Lexer.eat(this.Lexer.token, MUL)
        this.result = this.result * this.factor()
      }
      if (this.Lexer.token.type === DIV) {
        this.Lexer.eat(this.Lexer.token, DIV)
        this.result = this.result / this.factor()
      }
      this.Lexer.getNextToken()
    }
    console.log(this.result)
  }
}