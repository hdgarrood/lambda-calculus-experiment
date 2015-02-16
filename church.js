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
var oneHundred = mult(ten)(ten)

// booleans
// The intended use here is that when using Qif, you supply 0-arity functions
// that simply return the values you wanted. We can't just put the values in,
// because then both branches are forced, and this means recursive functions
// don't work.
var Qtrue  = (a) => (b) => a()
var Qfalse = (a) => (b) => b()
var Qif    = (b) => b
var not = (truthval) => (a) => (b) => truthval(b)(a)

var isZero = (n) =>
  n(Qconst(Qfalse))(Qtrue)

// decrement is a little harder
var tupleify = (f) => (t) =>
  Qif(snd(t))(
    () => tuple(f(fst(t)))(Qtrue))(
    () => tuple(fst(t))(Qtrue))

var dec = (n) => (f) => (x) =>
  fst(n(tupleify(f))(tuple(x)(Qfalse)))

// more arithmetic
var subRecur = (recur) => (n) => (m) =>
  Qif(isZero(n))(
    () => m)(
    () => Qif(isZero(m))(
      () => n)(
      () => recur(dec(m))(dec(n))))
var sub = Y(subRecur)

var factorialRecur = (recur) => (n) =>
  Qif(isZero(n))(
    () => one)(
    () => mult(n)(recur(dec(n))))

var factorial = Y(factorialRecur)

var lessThanRecur = (recur) => (n) => (m) =>
  Qif(isZero(n))(
    () => not(isZero(m)))(
    () => Qif(isZero(m))(
      () => Qfalse)(
      () => recur(dec(n))(dec(m))))

var lessThan = Y(lessThanRecur)

// var divRecur = (recur) => (n) => (m) =>
//    Qif(

// var mod = (n) => (m) => (f) => (x) =>
  

var toNum  = (n) => n((x) => x + 1)(0)
var toBool = (b) => Qif(b)(() => true)(() => false)

//document.write(toNum(factorial(five)))
