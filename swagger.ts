import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options: swaggerJsdoc.Options = {
	definition: {
		openapi: '3.0.0',
		info: {
			title: `Stav and Yaron's Social Network API`,
			version: '1.0.0',
		},
	},
	apis: ['./routes/*.ts', './models/*.ts'],
};

const swaggerSpec = swaggerJsdoc(options);

export const swagger = { serve: swaggerUi.serve, setup: swaggerUi.setup(swaggerSpec) };
