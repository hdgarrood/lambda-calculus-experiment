"use strict";

// combinators
var K = function (x) {
  return function (y) {
    return x;
  };
};
var I = function (x) {
  return x;
};
var Y = function (f) {
  return (function (x) {
    return x(x);
  })(function (x) {
    return f(function (y) {
      return x(x)(y);
    });
  });
};

var Qconst = K;

var tuple = function (x) {
  return function (y) {
    return function (f) {
      return f(x)(y);
    };
  };
};
var fst = function (t) {
  return t(function (x) {
    return function (y) {
      return x;
    };
  });
};
var snd = function (t) {
  return t(function (x) {
    return function (y) {
      return y;
    };
  });
};

// natural numbers
var zero = function (f) {
  return function (x) {
    return x;
  };
};
var inc = function (n) {
  return function (f) {
    return function (x) {
      return f(n(f)(x));
    };
  };
};
var one = inc(zero);
var two = inc(one);
var three = inc(two);
var four = inc(three);
var five = inc(four);

// arithmetic
var add = function (n) {
  return function (m) {
    return function (f) {
      return function (x) {
        return m(f)(n(f)(x));
      };
    };
  };
};
var mult = function (n) {
  return function (m) {
    return function (f) {
      return function (x) {
        return m(n(f))(x);
      };
    };
  };
};

var ten = mult(two)(five);
var fifteen = mult(three)(five);
var oneHundred = mult(ten)(ten);

// booleans
// The intended use here is that when using Qif, you supply 0-arity functions
// that simply return the values you wanted. We can't just put the values in,
// because then both branches are forced, and this means recursive functions
// which rely on Qif in order to decide whether to recurse will cause a stack
// overflow.
var Qtrue = function (a) {
  return function (b) {
    return a();
  };
};
var Qfalse = function (a) {
  return function (b) {
    return b();
  };
};
var Qif = I;
var not = function (truthval) {
  return function (a) {
    return function (b) {
      return truthval(b)(a);
    };
  };
};

var isZero = function (n) {
  return n(Qconst(Qfalse))(Qtrue);
};

// decrement is a little harder
var tupleify = function (f) {
  return function (t) {
    return Qif(snd(t))(function () {
      return tuple(f(fst(t)))(Qtrue);
    })(function () {
      return tuple(fst(t))(Qtrue);
    });
  };
};

var dec = function (n) {
  return function (f) {
    return function (x) {
      return fst(n(tupleify(f))(tuple(x)(Qfalse)));
    };
  };
};

// more arithmetic
var subRecur = function (recur) {
  return function (n) {
    return function (m) {
      return Qif(isZero(n))(function () {
        return m;
      })(function () {
        return Qif(isZero(m))(function () {
          return n;
        })(function () {
          return recur(dec(m))(dec(n));
        });
      });
    };
  };
};
var sub = Y(subRecur);

var factorialRecur = function (recur) {
  return function (n) {
    return Qif(isZero(n))(function () {
      return one;
    })(function () {
      return mult(n)(recur(dec(n)));
    });
  };
};

var factorial = Y(factorialRecur);

var lessThanRecur = function (recur) {
  return function (n) {
    return function (m) {
      return Qif(isZero(n))(function () {
        return not(isZero(m));
      })(function () {
        return Qif(isZero(m))(function () {
          return Qfalse;
        })(function () {
          return recur(dec(n))(dec(m));
        });
      });
    };
  };
};

var lessThan = Y(lessThanRecur);

var divRecur = function (recur) {
  return function (n) {
    return function (m) {
      return Qif(lessThan(n)(m))(function () {
        return zero;
      })(function () {
        return add(one)(recur(sub(n)(m))(m));
      });
    };
  };
};

var div = Y(divRecur);

var mod = function (n) {
  return function (m) {
    return sub(n)(mult(m)(div(n)(m)));
  };
};

var numEq = function (n) {
  return function (m) {
    return Qif(lessThan(n)(m))(function () {
      return isZero(sub(m)(n));
    })(function () {
      return isZero(sub(n)(m));
    });
  };
};

var divides = function (n) {
  return function (m) {
    return isZero(mod(n)(m));
  };
};

// lists!
// A list is a function: type List a = (() -> r) -> (a -> List a -> r) -> r
var emptyList = function (whenEmpty) {
  return function (whenCons) {
    return whenEmpty();
  };
};
var cons = function (elem) {
  return function (list) {
    return function (whenEmpty) {
      return function (whenCons) {
        return whenCons(elem)(list);
      };
    };
  };
};

var isEmpty = function (list) {
  return list(function () {
    return Qtrue;
  })(function (h, t) {
    return Qfalse;
  });
};

// make a list with one element
var singleton = function (elem) {
  return cons(elem)(emptyList);
};

var map = function (f) {
  return function (list) {
    return list(function () {
      return emptyList;
    })(function (head) {
      return function (tail) {
        return cons(f(head))(map(f)(tail));
      };
    });
  };
};

var compose = function (f) {
  return function (g) {
    return function (x) {
      return f(g(x));
    };
  };
};

var listFromTo = function (lo) {
  return function (hi) {
    return Qif(numEq(lo)(hi))(function () {
      return singleton(lo);
    })(function () {
      return cons(lo)(listFromTo(inc(lo))(hi));
    });
  };
};

// data Fizzbuzz a = Fizz | Buzz | Fizzbuzz | Nope a
var fizz = function (a) {
  return function (_) {
    return function (_) {
      return function (_) {
        return a();
      };
    };
  };
};
var buzz = function (_) {
  return function (a) {
    return function (_) {
      return function (_) {
        return a();
      };
    };
  };
};
var fizzbuzz = function (_) {
  return function (_) {
    return function (a) {
      return function (_) {
        return a();
      };
    };
  };
};
var nope = function (x) {
  return function (_) {
    return function (_) {
      return function (_) {
        return function (f) {
          return f(x);
        };
      };
    };
  };
};

var toFizzbuzz = function (n) {
  return Qif(divides(n)(fifteen))(function () {
    return fizzbuzz;
  })(function () {
    return Qif(divides(n)(three))(function () {
      return fizz;
    })(function () {
      return Qif(divides(n)(five))(function () {
        return buzz;
      })(function () {
        return nope(n);
      });
    });
  });
};

var makeFizzbuzzes = function (max) {
  return map(toFizzbuzz)(listFromTo(one)(max));
};

// utilities
var log = console.log.bind(console);
var toNum = function (n) {
  return n(function (x) {
    return x + 1;
  })(0);
};
var toBool = function (b) {
  return Qif(b)(function () {
    return true;
  })(function () {
    return false;
  });
};

var showList = function (list) {
  return list(function () {
    return "";
  })(function (head) {
    return function (tail) {
      return head.toString() + " " + showList(tail);
    };
  });
};

var showFizzbuzz = function (fb) {
  return fb(function () {
    return "fizz";
  })(function () {
    return "buzz";
  })(function () {
    return "fizzbuzz";
  })(function (x) {
    return toNum(x).toString();
  });
};

var showFizzbuzzes = function (fbs) {
  return showList(map(showFizzbuzz)(fbs));
};

var go = function () {
  var fizzbuzzes = makeFizzbuzzes(oneHundred);
  document.write(showFizzbuzzes(fizzbuzzes));
};
