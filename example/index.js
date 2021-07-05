const capsule = require('../index')

// Initiallize with definitions
const c = new capsule({
    hi: () => {
        return 543;
    }
})

// Set a simpale key/value definition
c.set('hello', "goodbye");

// Set a definition
c.set('test', (c) => {
    return {
        test: c.hi
    }
});

// Extend a definition
c.set('test', c.extend('test', (test) => {
    test.hello = 321
    return test;
}));

// Set a protected definition
c.set('protected', c.protect(function () {
    return 'Hi';
}));

// Set a shared definition
c.set('shared', c.share((c) => {
    return {
        result: c.test
    }
}));

console.log(c.shared)

// Get raw definition
console.log(c.raw('test'))

// Get definition
console.log(c.test);