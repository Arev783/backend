const bcrypt = require("bcrypt"); // կամ bcryptjs, ինչ որ ես օգտագործում ես

async function generateHash() {
    const password = "admin123"; // ընտրիր ուզածդ password-ը
    const hash = await bcrypt.hash(password, 10);
    console.log("Hashed password:", hash);
}

generateHash();