const sha3 = require("js-sha3").sha3_256;
const fs = require("fs");

fs.readdir(`${__dirname}/files`, "utf8", (err, files) => {
    if (err) throw err;
    let ArrayHashes = [];
    files.forEach((file) => {
        fs.readFile(`${__dirname}/files/${file}`, (error, data) => {
            if (error) throw error;
            let hash = sha3(data);
            ArrayHashes.push(hash);
            ArrayHashes.sort();
        });
    });
    setTimeout(() => {
        ArrayHashes.push("stefanovich.pasha@yandex.by");
        let res = ArrayHashes.join("");
        console.log(sha3(res));
    }, 1000);
});
