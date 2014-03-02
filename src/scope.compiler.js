/**
 * scope compiler
 * version: 0.1.0
 * By Ali Najafizadeh
 * MIT Licensed.
 */

function reduce(base, arr, func) {
    arr.forEach(function (item) {
        base = func(base, item);
    });
    return base;
}

function makeArrayString(arr) {
    var str = "[",
        comma = "";
    str = reduce(str, arr, function (base, item) {
        base = base + comma  + '"' + item + '"';
        comma = ", ";
        return base;
    });

    str += "]";
    return str;
}

function makeArguments(arr) {
    var result = arr.split(",");
    result.forEach(function (item, index) {
        result[index] = result[index].trim();
    });
    return result;
}

var scope_function = /scope\s*\([\w\d,"' ]*function\s*\(([\w\d_, ]*)\)/gm;

function findAllOccurrences(str) {
    var result = [],
        groups;

    while (groups = scope_function.exec(str)){
        if (groups[1]) {
            result.push({
                index: scope_function.lastIndex,
                args: makeArrayString(makeArguments(groups[1])),
                insertLocation: findLocationToInsert(str, scope_function.lastIndex)
            });
        }
    }

    result.sort(function (a, b) {
        return (a.insertLocation < b.insertLocation)? -1 : 1;
    });

    return result;
}

function findLocationToInsert(str, index) {
    var i = index,
        length = str.length,
        stack = ['('];

    for(; i < length; i++) {
        switch (str[i]) {
            case '(':
                stack.push('(');
                break;
            case ')':
                stack.pop();
                if (stack.length == 0) {
                    return i + 1;
                }
                break;
        }
    }
    return -1;
}

function insertStringAt(input, target, index) {
    return target.substr(0, index) + input + target.substr(index);
}

function compile(str) {
    var scopes = findAllOccurrences(str),
        tempCount = 0;

    scopes.forEach(function (item) {
        str = insertStringAt('(' + item.args + ')', str, item.insertLocation + tempCount);
        tempCount += item.args.length + 2;
    });

    return str;
}

compile.makeArrayString = makeArrayString;
compile.findAllOccurrences = findAllOccurrences;
compile.findLocationToInsert = findLocationToInsert;
compile.insertStringAt = insertStringAt;

module.exports = compile;