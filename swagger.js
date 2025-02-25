const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

// Swagger Definition
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Express API",
            version: "1.0.0",
            description: "API documentation with Swagger",
        },
    },
    apis: ["./routes/*.js"], // Jaha tum API routes define karoge
};

const swaggerSpec = swaggerJsdoc(options);

function swaggerDocs(app, port) {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    console.log(`Swagger docs available at http://localhost:${port}/api-docs`);
}

module.exports = swaggerDocs;
