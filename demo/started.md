### Browser support
iOS 7+ and Android 2.1+ (except 3.x)

### Quick steps to use:

#### Load files or import library


##### ES5
``` html
{% for dist in site.data.egjs.dist %}
<script src="//{{ site.data.egjs.github.user }}.github.io/{{ site.data.egjs.github.repo }}/{{ dist }}"></script>
{% endfor %}
```

##### ES6+
```js
import Rotate from "@egjs/rotate";
```

### Initialize

```js
var handler = function(event, info) {
    ...
};

// bind rotate event
eg.rotate.on(handler);

// unbind rotate event
eg.rotate.off(handler);

// or unbind all the rotate event binds
eg.rotate.off();
```
