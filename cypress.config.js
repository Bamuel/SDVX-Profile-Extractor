const {defineConfig} = require("cypress");

module.exports = defineConfig({
    e2e: {
        specPattern: "cypress/e2e/**/*.{cy,spec}.{js,ts}",
        supportFile: false,
    },
});
