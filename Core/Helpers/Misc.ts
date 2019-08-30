export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function generateJobId(...args: any[]) {
    return args.join('|');
}
