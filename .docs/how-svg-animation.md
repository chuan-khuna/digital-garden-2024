How SVG Line Animation Works

Chris Coyier on Feb 18, 2014
Updated on Aug 31, 2021
Get affordable and hassle-free WordPress hosting plans with Cloudways — start your free trial today.

I bet all of you have seen that little trick where an SVG path is animated to look like it’s drawing itself. It’s super cool. Jake Archibald pioneered the technique and has a super good interactive blog post on how it works. Brian Suda wrote about it on 24 Ways. Polygon used it to great effect on a custom-designed article and wrote about it. Codrops has some neat examples.

I have very little to add, except my brain just kinda figured it out, so I thought I would explain it one more time the way it clicked for me.

1. You have an SVG shape

2. The shape must have a stroke

3. Strokes can be dashed
We could do that from Illustrator, but we can also do it programmatically. Let’s target the path with CSS (assuming we’re using inline SVG here, or via an <object>) and apply the dash that way.

<svg ...>
  <path class="path" stroke="#000000" ... >
</svg>
.path {
  stroke-dasharray: 20;
}
That gives us dashes of 20px in length.


4. Those dashes could be longer…
.path {
  stroke-dasharray: 100;
}

5. We can also “offset” the stroke, which moves the position of those dashes
Watch as we animate the offset of those long strokes:


That was a simple as:

.path {
  stroke-dasharray: 100;
  animation: dash 5s linear;
}

@keyframes dash {
  to {
    stroke-dashoffset: 1000;
  }
}
6. Imagine a dash so long it covers the entire shape
Nothing really to see, it looks just like the complete shape if it wasn’t dashed at all. You just need to make stroke-dasharray a longer value than the length of the stroke.

7. Now offset that stroke so that instead of covering the entire shape, it NOT covers the entire shape.
It will look like the shape isn’t there at all.

8. Now animate the stroke offset back to 0

If doing it with CSS, you’ll want the animation to have animation-fill-mode of forwards so the final state remains how the animation ends.

.path {
  stroke-dasharray: 1000;
  stroke-dashoffset: 1000;
  animation: dash 5s linear forwards;
}

@keyframes dash {
  to {
    stroke-dashoffset: 0;
  }
}
Tada!

Live Example

So why all the JavaScript?
Most of the examples you see of SVG line animations use JavaScript. That’s because it’s hard to know what the length of that stroke actually is. We just used 1000 in our example because that happens to be about the right length.

You can get that length in JavaScript like:

var path = document.querySelector('.path');
var length = path.getTotalLength();
Then use it however you will. Those articles I linked to at the top go far more into all this, so I’ll let you consult those for more fancy stuff. I just wanted to cover the concept so perhaps it can click for you too.
