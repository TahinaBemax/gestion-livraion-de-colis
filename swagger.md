Using Swagger in NestJS is a great way to generate API documentation automatically and make it easier to understand and test the API endpoints. To integrate Swagger into your NestJS application and make it look professional, follow these detailed steps:

### 1. **Install Required Packages**

First, you need to install the required dependencies for Swagger integration in your NestJS project.

```bash
npm install @nestjs/swagger swagger-ui-express
```

* `@nestjs/swagger`: This is the official NestJS package that provides decorators and utilities to generate Swagger documentation.
* `swagger-ui-express`: This is the package used to serve the Swagger UI in your application.

### 2. **Setup Swagger in Your Application**

In your `main.ts` file, configure Swagger to automatically generate documentation when your app starts.

Here's how to do it:

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Setup Swagger
  const config = new DocumentBuilder()
    .setTitle('My API')
    .setDescription('API documentation for my project')
    .setVersion('1.0')
    .addBearerAuth() // Optionally add authentication method
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // Swagger UI will be available at /api

  await app.listen(3000);
}

bootstrap();
```

* `DocumentBuilder`: Helps you build your Swagger configuration, such as title, description, version, etc.
* `SwaggerModule.createDocument`: Generates the OpenAPI (Swagger) document based on your app's routes.
* `SwaggerModule.setup`: Exposes the Swagger UI at the specified route (e.g., `/api`).

Now, when you run your app (`npm run start`), you can visit `http://localhost:3000/api` to see the Swagger UI with your API documentation.

### 3. **Documenting Your Endpoints with Decorators**

NestJS provides several decorators to document your API endpoints. You can use these to enhance the auto-generated Swagger documentation.

#### Basic Example

Here is an example of how to document a simple `GET` endpoint with Swagger.

```typescript
import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('cats') // Grouping endpoint under the 'cats' tag in Swagger
@Controller('cats')
export class CatsController {
  
  @Get()
  @ApiOperation({ summary: 'Get all cats' }) // Description of the operation
  @ApiResponse({ status: 200, description: 'List of cats returned' })
  @ApiResponse({ status: 404, description: 'Not found' })
  getCats() {
    return [];
  }
}
```

* `@ApiTags`: Helps you group related endpoints under a tag.
* `@ApiOperation`: Describes what the operation does (e.g., a `GET` request to retrieve data).
* `@ApiResponse`: Provides a response description with possible status codes.

#### Example for `POST` Request

```typescript
import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

class CreateCatDto {
  name: string;
  age: number;
}

@ApiTags('cats')
@Controller('cats')
export class CatsController {
  
  @Post()
  @ApiOperation({ summary: 'Create a new cat' })
  @ApiResponse({ status: 201, description: 'Cat created' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiBody({ type: CreateCatDto }) // Documenting request body
  createCat(@Body() createCatDto: CreateCatDto) {
    return createCatDto;
  }
}
```

* `@ApiBody`: Used to describe the body of a `POST` request. You can specify the DTO (data transfer object) for the request body.

#### Example of `PUT` and `DELETE` Requests

```typescript
import { Controller, Put, Param, Body, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('cats')
@Controller('cats')
export class CatsController {
  
  @Put(':id')
  @ApiOperation({ summary: 'Update a cat' })
  @ApiParam({ name: 'id', description: 'ID of the cat' }) // Documenting route parameter
  @ApiResponse({ status: 200, description: 'Cat updated' })
  @ApiResponse({ status: 404, description: 'Cat not found' })
  updateCat(@Param('id') id: string, @Body() createCatDto: CreateCatDto) {
    return { id, ...createCatDto };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a cat' })
  @ApiParam({ name: 'id', description: 'ID of the cat' })
  @ApiResponse({ status: 200, description: 'Cat deleted' })
  @ApiResponse({ status: 404, description: 'Cat not found' })
  deleteCat(@Param('id') id: string) {
    return { id };
  }
}
```

* `@ApiParam`: Used to describe path parameters (e.g., the `id` in `/cats/:id`).
* `@ApiResponse`: Provides additional response status codes and descriptions.

### 4. **Documenting DTOs and Models**

To ensure that Swagger correctly documents your data structures, you should use the `@ApiProperty` decorator within your DTO classes.

Example:

```typescript
import { ApiProperty } from '@nestjs/swagger';

class CreateCatDto {
  @ApiProperty({ description: 'The name of the cat' })
  name: string;

  @ApiProperty({ description: 'The age of the cat' })
  age: number;
}
```

* `@ApiProperty`: This decorator tells Swagger how to document the properties of a DTO.

### 5. **Customizing Swagger with Advanced Options**

You can further customize your Swagger documentation with more options like authentication schemes, custom UI setup, or metadata.

#### Adding Bearer Token Authentication

If your API uses JWT authentication, you can document it with Swagger.

```typescript
const config = new DocumentBuilder()
  .setTitle('My API')
  .setDescription('API documentation for my project')
  .setVersion('1.0')
  .addBearerAuth() // Add Bearer token authentication
  .build();
```

#### Customizing Swagger UI

To customize Swagger UI (e.g., change the theme, layout, or documentation styles), you can pass options to `SwaggerModule.setup`.

```typescript
SwaggerModule.setup('api', app, document, {
  customCss: '.swagger-ui { background-color: #f4f4f4; }',
  customSiteTitle: 'My Custom API Docs',
});
```

### 6. **Error Handling and Response Documentation**

You can also specify the response model for various status codes and exceptions.

```typescript
@ApiResponse({ 
  status: 400, 
  description: 'Bad Request', 
  type: BadRequestResponseDto 
})
@ApiResponse({ 
  status: 500, 
  description: 'Internal Server Error', 
  type: InternalServerErrorDto 
})
```

This allows you to generate clear documentation for error responses as well, making your API more professional and easier to use.

### 7. **Versioning Your API (Optional)**

If you plan to version your API, you can document different versions using the `@ApiTags` and other decorators.

```typescript
@ApiTags('v1-cats')
@Controller('v1/cats')
export class V1CatsController {}
```

### 8. **Final Project Structure Example**

Here’s how the project structure might look after integrating Swagger:

```
src/
|-- app.module.ts
|-- cats/
|   |-- cats.controller.ts
|   |-- cats.service.ts
|   |-- dto/
|   |   |-- create-cat.dto.ts
|   |-- interfaces/
|       |-- cat.interface.ts
|-- main.ts
```

### 9. **Accessing Swagger UI**

Once you've set up Swagger, you can access the Swagger UI at the route defined in `SwaggerModule.setup`. For example:

* Open your browser and go to `http://localhost:3000/api` to view your API documentation.

### Conclusion

By using the `@nestjs/swagger` package in combination with decorators like `@ApiTags`, `@ApiOperation`, `@ApiResponse`, and `@ApiBody`, you can easily document your NestJS application’s API. These steps will ensure that your Swagger documentation looks professional and is complete, making it easier for others (or yourself in the future) to use and understand your API.
