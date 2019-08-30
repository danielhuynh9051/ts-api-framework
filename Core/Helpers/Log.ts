var log = console.log;

console.log = function(...args: any) {
    log.apply(console, [new Date().toISOString(), '|'].concat(args));
};
