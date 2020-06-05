const { exec } = require("child_process");
exec("npm run ac-stock");

setInterval(() => {
    exec("npm run ac-stock");
}, 120000);