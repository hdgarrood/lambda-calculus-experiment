{-# LANGUAGE Rank2Types #-}
module Church where

import Prelude hiding (toInteger, const, Int, Bool, fst, snd)

const = \a _ -> a

-- tuples
tuple = \x y f -> f x y
fst = \t -> t (\x y -> x)
snd = \t -> t (\x y -> y)

-- natural numbers
zero  = \f x -> x
one   = \f x -> f x
two   = \f x -> f (f x)
three = \f x -> f (f (f x))
five  = \f x -> f (f (f (f (f x))))

-- sorry about these
fifteen = \f x -> f (f (f (f (f (f (f (f (f (f (f (f (f (f (f x)))))))))))))) 
hundred = \f x -> f (f (f (f (f (f (f (f (f (f (f (f (f (f (f (f (f (f (f (f (f (f (f (f (f (f (f (f (f (f (f (f (f (f (f (f (f (f (f (f (f (f (f (f (f (f (f (f (f (f (f (f (f (f (f (f (f (f (f (f (f (f (f (f (f (f (f (f (f (f (f (f (f (f (f (f (f (f (f (f (f (f (f (f (f (f (f (f (f (f (f (f (f (f (f (f (f (f (f (f x)))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))

isZero = \n -> n (const false) true

inc = \n -> \f x -> f (n f x)


tupleify :: _ -> a -> a
tupleify = \f t -> if' (snd t)
                        (tuple (f (fst t)) true)
                        (tuple (fst t)     true)
-- tupleify =
--     \f t -> if' (snd t)
--                     (tuple (f (fst t)) true)
--                     (tuple (fst t)     true)
-- dec = \n -> \f x ->
--     let tupleify g t = if' (snd t)
--                             (tuple (g (fst t)) true)
--                             (tuple (fst t)     true)
--     in fst (n (tupleify f) (tuple x false))

toInteger = \f -> f (+1) 0

-- booleans
true  = \a b -> a
false = \a b -> b
if' = \b -> b

toBoolean = \b -> if' b True False

