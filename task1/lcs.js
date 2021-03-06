function lcs(strings) {
    let shortest = strings.reduce((x, y) => (x > y ? x : y));
    let max = shortest.length;
    for (let x = max; x >= 0; x--) {
        for (let y = 0; y <= max - x; y++) {
            let substring = shortest.substr(y, x);
            if (strings.every((str) => str.indexOf(substring) > -1))
                return substring;
        }
    }
}
if (process.argv.length < 3) console.log("");
else console.log(lcs(process.argv.slice(2)));
