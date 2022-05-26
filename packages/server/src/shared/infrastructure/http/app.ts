import '../../utils/paths.utils';
import { initializeHttpServer } from '@Shared/infrastructure/config/initialize-http';
import { initializeDB } from '@Shared/infrastructure/config/initialize-db';
import { PORT, NODE_ENV } from '@Shared/utils/constants';

export const bootstrap = async () => {
  await initializeDB();

  const { httpServer } = await initializeHttpServer();

  if (NODE_ENV !== 'test') {
    await new Promise<void>((resolve) =>
      httpServer.listen({ port: PORT }, resolve)
    );
  }

  console.log('🚀 Initializing Server...');
};

bootstrap();
