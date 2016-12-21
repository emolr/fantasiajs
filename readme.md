# fantasia

> a parralax, 3d, depthcontrol plugin to create beautiful imagery

> NB! This whole thing is still under creative development, and no test are written yet.

## Getting Started

Download the [production version][min] or the [development version][max].

[min]: https://raw.githubusercontent.com/emolr/fantasiajs/master/dist/jquery.fantasiajs.min.js
[max]: https://raw.githubusercontent.com/emolr/fantasiajs/master/dist/jquery.fantasiajs.js

In your web page:

```html
<script src="jquery.js"></script>
<script src="dist/fantasiajs.min.js"></script>
<script>
  jQuery(function ($) {
    $('#box3d1').fantasia({ // Div to rotate
      trackFrom: '#scene3d', // calculate rotation from
      type: '3d',
      perspective: '600px',
    });
  });
</script>
```


## License

MIT © Emil Rune Møller
