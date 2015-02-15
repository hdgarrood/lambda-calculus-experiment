// combinators
var K = (x) => (y) => x
var I = (x) => x
var Y = (f) => ((x) => x(x))((x) => f((y) => (x(x))(y)))

var Qconst = K

var tuple = (x) => (y) => (f) => f(x)(y)
var fst = (t) => t((x) => (y) => x)
var snd = (t) => t((x) => (y) => y)

// natural numbers
var zero = (f) => (x) => x
var inc = (n) => (f) => (x) => f(n(f)(x))
var one = inc(zero)
var two = inc(one)
var three = inc(two)
var four = inc(three)
var five = inc(four)

// arithmetic
var add = (n) => (m) => (f) => (x) =>
  m(f)(n(f)(x))
var mult = (n) => (m) => (f) => (x) =>
  m(n(f))(x)

var ten = mult(two)(five)
var fifteen = mult(three)(five)
var one_hundred = mult(ten)(ten)

// booleans
var Qtrue  = (a) => (b) => a
var Qfalse = (a) => (b) => b
var Qif    = (b) => b

var isZero = (n) => n(Qconst(Qfalse))(Qtrue)

var tupleify = (f) => (t) =>
  Qif(snd(t))(
      tuple(f(fst(t)))(Qtrue))(
      tuple(fst(t))(Qtrue))

var dec = (n) => (f) => (x) =>
  fst(n(tupleify(f))(tuple(x)(Qfalse)))

var almostFactorial = (fact) => (n) =>
  Qif(isZero(n))(
      one)(
      mult(n)(fact(dec(n))))

var factorial = Y(almostFactorial)

// var div = (n) => (m) => (f) => (x) =>
  

// var mod = (n) => (m) => (f) => (x) =>
  

var toNum  = (n) => n((x) => x + 1)(0)
var toBool = (b) => Qif(b)(true)(false)

document.write(toNum(factorial(five)))
