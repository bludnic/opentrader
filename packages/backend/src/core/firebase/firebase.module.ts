import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import { getFirebaseInstance } from 'src/core/firebase/utils/get-firebase-instance';
import { FirebaseConstants } from './constants';
import { FirebaseAdmin, FirebaseModuleOptions } from './interfaces';

@Global()
@Module({})
export class FirebaseModule {
  public static forRoot(options: FirebaseModuleOptions): DynamicModule {
    const provider: Provider<FirebaseAdmin> = {
      provide: FirebaseConstants.FIREBASE_TOKEN,
      useValue: getFirebaseInstance(options),
    };

    return {
      exports: [provider],
      module: FirebaseModule,
      providers: [provider],
    };
  }
}
