import swaggerJSDoc from "swagger-jsdoc";

const options = {
    definition: {
        openapi: "3.0.3",

        info: {
            title: "RecruitHub API",
            version: "1.0.0",
            description:
                "REST API for the RecruitHub recruitment platform.",
        },

        servers: [
            {
                url: "http://localhost:5000",
                description: "Local development server",
            },
        ],
    },

    apis: ["./modules/**/*.routes.js"]
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;