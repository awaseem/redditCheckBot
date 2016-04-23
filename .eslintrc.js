module.exports = {
    "extends": "airbnb",
    "rules": {
        "quotes": [2, "double", "avoid-escape"],
        "indent": [2, 4],
        "new-cap": [2, { "capIsNewExceptions": ["Map", "Set", "List"] } ]
    },
    "plugins": [
        "react"
    ],
    "globals": {
        "chrome": true,
        "mocha": true
    },
    "env": {
        "mocha": true
    },
};
