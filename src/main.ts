import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // فعال‌سازی CORS برای ارتباط با فرانت‌اند Next.js
  app.enableCors();

  // تنظیمات Swagger
  const config = new DocumentBuilder()
    .setTitle('Bio-Link Generator API')
    .setDescription('مستندات و اندپوینت‌های سرویس بک‌اند بیولینک')
    .setVersion('1.0')
    .addBearerAuth() // برای توکن‌های JWT بعدی
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 Application is running on: http://localhost:${port}`);
  console.log(`📄 Swagger Docs available at: http://localhost:${port}/api/docs`);
}
bootstrap();
