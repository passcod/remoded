remoded
=======

[![Greenkeeper badge](https://badges.greenkeeper.io/passcod/remoded.svg)](https://greenkeeper.io/)

_Userscripts, reloaded._


Remoded was originaly conceived sometime before Christmas 2011, but it
never really got beyond the idea stage. A little later, I had a look at
[dotjs][0], bringing in a refreshing thought of simplicity over the initially
complex thing I had in mind. Months passed, and finally **remoded** was born.


## Userscripts are tricky beasts

I [recently wrote a bit about Userscripts][1] and my impression of the
community behind them, at least while I was coding a lot in there. I
complained about the apparent animosity expressed towards &laquo; noobs
&raquo; who wanted to use jQuery instead of just pure DOM and Javascript.

Userscripts are somewhere between apps and websites and bookmarklets.
They have **context**, as in, they run on the web, on top of something
that exists; they can be **distributed**, made by developers and used by
people\*; they are **varied**... from minor tweaks to completely new UIs.
When remaking them, then, one needs to consider all of these. It's not easy.

\* _Not that developers aren't people. Although that's debatable._


## One file userscripts are sooo 2010

I mean, does anyone on the web does any serious work all in one file? OK, there's
a few, but generally development is done with a variety of files. You might be
used to concatenating everything in one file for production, but the reason for
_that_ is about network latency &mdash; a problem that isn't one if all your
files are local. Plus, requiring that all code be in one file means you can't
use frameworks like [jQuery UI][2] or [Pinot][3], nor many different libraries
or plugins, nor images, nor flash if that's your fancy, nor appCache, nor...


## Remoded brings freedom to this twisted plane

A Remoded userscript takes the shape of a single directory in `~/.remoded`. The
naming goes like this:

```
examplescriptname    # That's just a generic thing
example@author       # The code was pulled from @author's GitHub 'example' repo
gist-12345@author    # The code was pulled from @author's Gist 12345

# Currently, the last two are just a convention, but later on... :) 
```


Of course, the userscript isn't run all the time, on every webpage... that's were
the Manifest comes in. In the userscript directory, the only required file is a
`Manifest`. This file offers all the flexibility you want with zero effort. In its
simplest form, it goes like this:

```
load "script.js"
```

All this does is load the file `script.js` into all pages. You can load as many
files as you want, in the order you specify:

```
load "lib/jquery.js", "lib/underscore.js"
load [
  "lib/underscore.string.js"
  "script.js"
]
```

Not only JavaScript, you can load in CSS, and arbitrary text files:

```
load "stylesheets/style.css"
load "locale/jp_JP.yml"
```

But what if we only want to run on a subset of pages?

```
match "foo/bar"                 # Exact matching (+/- trailing slash)
match "*.php"                   # Wildcard matching (Not implemented)
match /^bar\/?.*(?!\.s?html?)$/ # Regexp

# Also, domains:
domain "example.com"
domain /^(b|a|z)\.example.+$/

# Ports are thrown in for free
port 8080
port "1200..1234"   # Ranges! (Not implemented)
port /^[1-9]+000$/  # Regexp! (Not implemented)
```

What about conditional loading? Well, there's better: scopes.

```
scope ->
  match "only/this/page"
  domain "on.this.websi.te"
  
  load "special.js"
```

The Manifest is actually a CoffeeScript DSL, so you can use functions,
variables, and the full power of the language to achieve exactly what
you want.


_Todo: implement all that "Not implemented" stuff |-;_


remoded
=======

[![Gittip](http://stuff.passcod.net/gittip.png)](https://www.gittip.com/passcod/)

Copyright 2012 &copy; Félix Saparelli [:passcod]  
Licensed under [MIT](http://passcod.mit-license.org).

Thanks: **[@defunkt]**, **[@rlr]**, **[@greasemonkey]**, **[@scriptish]**

[0]: http://defunkt.io/dotjs/
[1]: http://checkthis.com/71v0
[2]: http://jqueryui.com/
[3]: https://github.com/ibdknox/pinot

[@defunkt]:      /defunkt
[@rlr]:          /rlr
[@greasemonkey]: /greasemonkey
[@scriptish]:    /scriptish
