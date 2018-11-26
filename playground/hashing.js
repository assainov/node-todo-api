const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const password = '123abc!';

bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, (err, hash) => {
        console.log(hash);
    });
});

const hashedPassword = '$2a$10$47XQtAf1cB0ZNAUc1ovzouPaMZ1pzZ02H7fUZa1ZYm7lp43bhtrXq';

bcrypt.compare(password, hashedPassword, (err, result) => {
    console.log(result);
});


// const data = {
//     message: 'suka blyat'
// };

// const token = jwt.sign(data, '123abc');
// console.log(token);

// const decoded = jwt.verify(token, '123abc');

// console.log('decoded:', decoded);


// const message = 'I am user no 3';
// const hash = SHA256(message).toString();
// const hash = 

// console.log(`Message: ${message}`);
// console.log(`Hash: ${hash}`);

// const data = {
//     id: 4
// };

// const token = {
//     data,
//     hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
// }

// token.data.id = 5;
// token.hash = SHA256(JSON.stringify(token.data)).toString();

// const resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();

// if (resultHash === token.hash) {
//     console.log('data is genuine');
// } else {
//     console.log('data is corrupt');
// }