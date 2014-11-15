# html-formul&aelig;-app [![Build Status][travis-badge]][travis] [![Dependency Status][david-badge]][david] [![DevDependency Status][david-dev-badge]][david-dev]

[travis-badge]: https://travis-ci.org/eush77/html-formulae-app.svg
[travis]: https://travis-ci.org/eush77/html-formulae-app
[david-badge]: https://david-dm.org/eush77/html-formulae-app.png
[david]: https://david-dm.org/eush77/html-formulae-app
[david-dev-badge]: https://david-dm.org/eush77/html-formulae-app/dev-status.png
[david-dev]: https://david-dm.org/eush77/html-formulae-app#info=devDependencies

**tl;dr**: HTML Formul&aelig; translates formulas in lightweight TeX-inspired syntax to HTML.

## Example
Suppose you have to input the following formula in HTML:

> &forall;(x,y)&isin;&#8477;<sup>2</sup>:&ensp;[y&gt;0&thinsp;&amp;&thinsp;(x&ne;0&thinsp;&or;&thinsp;y=1)]&thinsp;&hArr;&thinsp;[&exist;a&gt;0:&thinsp;a<sup>x</sup>=y]

The following piece of code is one you probably should use in this case:

    \&forall;(x,y)\&isin;setR^2:␣␣[y>0.&.(x!=0.||.y=1)]<=>[\&exist;a>0:.a^x=y]

Quite straightforward, right?

Now look at generated HTML for this simple line. You should be extremely patient to write it by hand!

    <p>&forall;(x,y)&isin;&#8477;<sup>2</sup>:&ensp;[y&gt;0&thinsp;&amp;&thinsp;(x&ne;0&thinsp;&or;&thinsp;y=1)]&thinsp;&hArr;&thinsp;[&exist;a&gt;0:&thinsp;a<sup>x</sup>=y]</p>

## Features
Two main features of &ldquo;HTML Formul&aelig;&rdquo; include subscript/superscript rendering and character sequences replacement. The syntax for the former one is pretty much the same as in LaTeX document preparation system and supports arbitrary levels of nesting.

Replacement table available laid out in the interface page include sequences for various mathematic symbols and punctuation marks. Punctuation marks include dashes (em-dash and en-dash), quotes (both double and angle marks), and whitespace characters (em-space, en-space, thin-space), which can make &ldquo;HTML Formul&aelig;&rdquo; suitable for plain text editing of HTML-encoded texts.

HTML tags and entities could also be taken into play (if properly escaped). You may notice some of those in the example above, e.g. `\&forall;`.

### History
Formulas can be saved and restored via the interface button or keyboard shortcut (<kbd>Ctrl</kbd>+<kbd>Enter</kbd>). Saved formulas are preserved between sessions in LocalStorage.
