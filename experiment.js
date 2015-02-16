// combinators
var K = (x) => (y) => x
var I = (x) => x
var Y = (f) => ((x) => x(x))((x) => f((y) => (x(x))(y)))

var Qconst = K

// A tuple is a container for two elements.
var tuple = (x) => (y) => (f) => f(x)(y)
var fst = (t) => t((x) => (y) => x)
var snd = (t) => t((x) => (y) => y)

// natural numbers are represented by a function that takes a function and a
// value, and applies the function to the value n times.
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
// The idea here is that when using Qif, you supply 0-arity functions that
// simply return the values you wanted. We can't accept the bare values because
// then both branches would be forced, and this would mean that our recursive
// functions (which rely on Qif to decide whether to recurse or not) would blow
// the stack.
var Qtrue  = (a) => (b) => a()
var Qfalse = (a) => (b) => b()
var Qif    = I
var not = (truthval) => (a) => (b) => truthval(b)(a)

var isZero = (n) =>
  n(Qconst(Qfalse))(Qtrue)

// decrement is a little harder
// the idea here is to turn a wrap the eventually supplied function in another
// function that does nothing on the first time it gets called, and behaves
// normally afterwards. The actual value is the first element of the tuple, and
// the second element is a boolean value that records whether it's the first
// time the function has been called or not.
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

var divRecur = (recur) => (n) => (m) =>
  Qif(lessThan(n)(m))(
    () => zero)(
    () => add(one)(recur(sub(n)(m))(m)))

var div = Y(divRecur)

var mod = (n) => (m) =>
  sub(n)(mult(m)(div(n)(m)))

var numEq = (n) => (m) =>
  Qif(lessThan(n)(m))(
    () => isZero(sub(m)(n)))(
    () => isZero(sub(n)(m)))

var divides = (n) => (m) =>
  isZero(mod(n)(m))

// lists!
// A list is a function: type List a = (() -> r) -> (a -> List a -> r) -> r
var emptyList = (whenEmpty) => (whenCons) => whenEmpty()
var cons = (elem) => (list) => (whenEmpty) => (whenCons) => whenCons(elem)(list)

var isEmpty = (list) => list(() => Qtrue)((h, t) => Qfalse)

// make a list with one element
var singleton = (elem) => cons(elem)(emptyList)

// apply a function to every element in a list
var map = (f) => (list) =>
  list(
    () => emptyList)(
    (head) => (tail) => cons(f(head))(map(f)(tail)))

// generate a list of numbers from lo to hi
var listFromTo = (lo) => (hi) =>
  Qif(numEq(lo)(hi))(
    () => singleton(lo))(
    () => cons(lo)(listFromTo(inc(lo))(hi)))

// data Fizzbuzz a = Fizz | Buzz | Fizzbuzz | Nope a
var fizz        = (a) => (_) => (_) => (_) => a()
var buzz        = (_) => (a) => (_) => (_) => a()
var fizzbuzz    = (_) => (_) => (a) => (_) => a()
var nope = (x) => (_) => (_) => (_) => (f) => f(x)

var toFizzbuzz = (n) =>
  Qif(divides(n)(fifteen))(
    () => fizzbuzz)(
    () => Qif(divides(n)(three))(
      () => fizz)(
      () => Qif(divides(n)(five))(
        () => buzz)(
        () => nope(n))))

var makeFizzbuzzes = (max) => map(toFizzbuzz)(listFromTo(one)(max))

// Interface code. Only stuff below here is allowed to use JS features other
// than just functions (eg, strings, numbers, console)
var log = console.log.bind(console)
var toNum  = (n) => n((x) => x + 1)(0)
var toBool = (b) => Qif(b)(() => true)(() => false)

var showList = (list) =>
  list(
    () => "")(
    (head) => (tail) => head.toString() + ' ' + showList(tail))

var showFizzbuzz = (fb) =>
  fb(
    () => "fizz")(
    () => "buzz")(
    () => "fizzbuzz")(
    (x) => toNum(x).toString())

var showFizzbuzzes = (fbs) => showList(map(showFizzbuzz)(fbs))

// Warning: this is really expensive!
var go = function() {
  var fizzbuzzes = makeFizzbuzzes(oneHundred)
  document.write(showFizzbuzzes(fizzbuzzes))
}
