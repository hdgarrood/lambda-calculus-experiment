
var Qconst = (a) => () => a

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

// sorry about these
var fifteen = inc(inc(inc(inc(inc(inc(inc(inc(inc(inc(inc(inc(inc(inc(inc(zero)))))))))))))))

// TODO
//var one_hundred = 


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

var add = (n) => (m) => (f) => (x) =>
  m(f)(n(f)(x))

var toNum  = (f) => f((x) => x + 1)(0)
var toBool = (b) => Qif(b)(true)(false)

document.write(toNum(add(five)(fifteen)))
