import fs from "fs";
import swaggerSpec from './swagger';

fs.writeFileSync('./openapi.json', JSON.stringify(swaggerSpec, null, 4), 'utf8');