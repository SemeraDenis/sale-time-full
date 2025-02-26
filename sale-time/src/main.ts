import { NestFactory } from '@nestjs/core';
import { AppModule } from './module/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('The API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  //app.useGlobalFilters(new CustomExceptionHandler());
  SwaggerModule.setup('/swagger-ui/index.html', app, document);

  app.use(cookieParser());
  app.enableCors({
    origin: 'http://localhost:3001',
    credentials: true,
  })

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
