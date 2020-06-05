const { exec } = require("child_process");
exec("node httpsTest.js");

setInterval(() => {
    exec("node httpsTest.js");
}, 120000);