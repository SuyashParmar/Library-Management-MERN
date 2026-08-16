const bcrypt = require("bcrypt");
const hash = "$2b$10$AY/nLdKK1jcJcaCJXAoOx.HZre81b5Y68NHguUXGVdOYBqyrXMrPi";
bcrypt.compare("Admin@123", hash, (err, res) => {
    console.log("Match:", res);
});
