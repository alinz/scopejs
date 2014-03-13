# scope.js

The world's **smallest** `dependency injection framework` for JavaScript (**1024 bytes** without **gzip**)

### Introduction

scope wasn't meant to be that small. I decided to challenge myself to see if I can make it small as possible without losing any features. In the end, I managed to make it as small as `1024` bytes. Now let's take a look at the available features:

1. Supports runtime dependency injection.
2. Supports Async call scopes. No need to define a scope before using it.
3. Supports non order dependency list.
4. Supports named and anonymous function.
5. Supports inline scope call.
6. Supports multiple scopes in a single file.
7. Supports injecting `JavaScript` and String files. (Loading Template, CSS, and any files)
8. Supports `node.js`.
9. Supports `minification`, `uglification`, or whatever you name it. 
10. It doesn't force you to follow one path. You can define your own path.
11. Comes with Unit tests, integration tests and examples.
12. Support all browsers. 
13. MIT licence. *I will appreciate it if you keep the header*.

### Supports runtime dependency injection
`require.js` does it by passing the list of files which needed to be loaded before required function is being called. For example

```js
require(['js/common/util.js',
		 'js/module/module1.js'], function (Util, Module1) {
	...
});
```

So what you see above is a typical usage of `require.js`. However if you start using it you will soon realize that you are writing a lot of dependencies code. You have to maintain array of dependencies.

now let see how we write the above code in `scope.js`.

```js
scope(function (Util, Module1) {
	...
});
```
> We will discuss about how scope will find the path to correct file soon in this document.
> Also, scope compiler will take care of magnification problem that I will dsccuss in this document.

So as you can see, I wrote less code and I don't have to remember the path to each file. I just passed my required variables and `scope.js` will take care of injecting those in a right order to my defined function once they are available.

### Supports Async call scopes. No need to define a scope before using it
In `scope.js` there is no function order hierarchy. What it means, you don't have to define one scope before using it. Let me show you in a real example,

```js
scope("HelloWorld", function () {
	return "Hello World, Heyyyyy";
});

scope("Main", function (HelloWorld) {
	alert(HelloWorld) 
});
```

So as you can see I defined `HelloWorld` scope first and then I defined `Main` scope which consumes `HelloWorld`. This code will work for sure. However, sometimes, the order of scope definition is becomes very hard to maintain. So in one scenario you end up defining your `Main` scope first and then defining your `HelloWorld` scope. Scope doesn't not care about this problem. and It will call `Main` scope once `HelloWorld` is loaded. So Everything in scope is `Async`. So the following code also works as well.

```js
scope("Main", function (HelloWorld) {
	alert(HelloWorld) 
});

scope("HelloWorld", function () {
	return "Hello World, Heyyyyy";
});
```

### Supports non order dependency injection
One of the frustration that I had with require.js or any module loaders, is that developers need to maintain the order of required dependencies. For example

```js
require(["js/module1.js",
		 "js/module2.js",
		 "js/module4.js",
		 "js/module3.js",
		 "js/module5.js"], function (Module1, Module2, Module4, Module3, Module5) {
	...
});
```

In my humble experiences, I faced a lot of order problems in large scale javascript and I had to look at the module signature to figure out the problem. Adding a new dependency will also causing to find the right place to add. For example if I want to bring `module6` into my function I have to either add it at the end of my list or if I add it in the middle I have to figure out the location that `require.js` will inject into.

The way that `scope.js` fixes that problem is simple. `scope.js` only cares about 2 things. Variable names and the order that developer wants.

Let me rewrite the previous example in `scope.js`

```js
scope(function (Module1, Module2, Module5, Module4, Module3) {
	...
});
```

I don't need to worry about the location and order. So changing the order of the arguments does not matter. I just want those variables injected into my function the way that I wanted. that's all.

### Supports named and anonymous function
Sometimes during the development you want to bring some modules and doing something but you don't want to define and create a name for it.

>duplicate scope names will cause `scope.js` to throw `Err1` exception.

For example

```js
scope("Module1", function () {
	return "Hello";
});

scope("Module2", function () {
	return "World";
});

scope(function (Module1, Module2) {
	alert(Module1 + " " + Module2);
});
```

### Supports inline scope call
Since scope is just a dependency manager, it doesn't care where you want to use it. You can use it every where.

For example:

```js
scope("Module1", function () {
	return "Hello World";
});

scope(function () {
	for (var i=0; i < 3; i++) {
		scope(function (Module1) {
			alert(Module1);
		});
	}
});
```

As you can see, in the above example, we have a loop and inside this loop we have another scope which required `Module1` to be loaded and injected into it first. So the end result will be 3 alert box with the same message.

>Be careful about using this inline scope. Inline scope is async call. So if you want to print 3 different Hello world message with counter you have to use forEach. Because `for` in `JavaScript` doesn't create a scope for you.

### Supports multiple scopes in a single file
In `scope.js`, You can define as many `scope` functions as you want. It is not bound to a single file. Once the file is being loaded, all the `scope` functions will be registered with `scope.js` core. So subsequent calls will read from internal cache.

### Supports injecting `JavaScript` and String files. (Loading Template, CSS, and any files)
This is the heart of `scope.js`. This is a design decision. If you want to support regular loading `JavaScript`, you can implement it that way. if you want to use `ajax` and use `eval` function to load your resource, I won't stop you. This flexibility is my first decision when I start designing `scope.js`.

So let's take a look at the process in `scope.js`. When your `scope` function request a dependency, `scope.js` checks the cache, if it's not there then it will ask `scope.get` function. Now what the heck is `scope.get` function? Well, `scope.get` is a function with the following signature. 

```js
scope.get = function (name, update) {
	...
};
```

`name` is the name of dependency that needed to be retrieve. Since every `ajax` call and most of retrieving objets are using network and they operation of those are asynchronous, then `scope.get` receive the second argument, `update`. `update` is a function with the following signature.

```js
function update(obj) {
	...
}
``` 

The `obj` argument is optional. If it is passed, the object that you are retrieving is set to that object. `obj` can be anything except `scope` object.

for more information take a look at the examples. Examples are cover the following topics.

* Using with `AJAX` to download other `scope` modules
* Using with `Script Tag` to download other `scope` modules
* Using with `AJAX` to download str object
* Using with `Websocket`
* Using with `Node.js`

### Uglification of scope module
The only issue of using this framework is uglification. Since in `JavaScript` function can accept any arguments at any time, and the variables that passes to function can be distorted by uglification. For that reason, `scope.js` has a way to by pass that issue. Let's see an example.

```js
scope("Module1", function (Test) {
	...	
});
```

this is one `scope` module and after being uglified, it becomes like this

```js
scope("Module1", function (a) {

});
```

As you can see the variable that has be passed to `module1` has been distorted and now, `scope.js` has no way of understanding that it refers to `Test`. However, there is a solution for that.

Each `scope` module returns a function that accept an array of arguments. Those elements inside that array will be injected into that function in order. So in order for us to make our module safer, we have to do the following before uglification.

```js
scope("Module1", function (Test) {
	...	
})(['Test']);
```

So now, after uglification, the result will be

```js
scope("Module1", function (a) {
	...	
})(['Test']);
```

which now `scope` has all the necessary information about injected variables.

>Since the process of converting those value is time consuming, `scope.js` comes with a compiler, which can be used before passing to uglification. This compiler reads the source code and modify the output source code which contains injected values.

In the build folder, there is a `bash` script named `compile` which can be used as a compiler. In order to use it, first it needs to be executable. So run the following command in `terminal`

```
chmod +x compile
```

The compiler itself is a self contain `Node.js` app which consumes source code from linux pipe and echo the output to `stdout`. For example

```
cat app.js | ./compile > app.compiled.js
```

So in the above example, `app.js` is consumed by compiler and produces `app.compiled.js` which converted all `scope` modules into injected one. So now app.compiled.js can be passed to favourite uglification program.
