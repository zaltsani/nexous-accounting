import { NestFactory, Reflector } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ResponseInterceptor } from "@nexous-accounting/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const _reflector = app.get(Reflector);

  app.setGlobalPrefix("/api");
  app.enableCors();
  app.useGlobalInterceptors(new ResponseInterceptor());

  const config = new DocumentBuilder()
    .setTitle("Nexous Accounting")
    .setDescription("Nexous Accounting")
    .setVersion("1.0")
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
