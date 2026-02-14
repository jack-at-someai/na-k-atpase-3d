// Generated from FlutterFire CLI + Firebase SDK configs.
// Project: charlotte-substrate
// Apps: maestro (android), maestro (ios), maestro (web)

import 'package:firebase_core/firebase_core.dart' show FirebaseOptions;
import 'package:flutter/foundation.dart'
    show defaultTargetPlatform, kIsWeb, TargetPlatform;

class DefaultFirebaseOptions {
  static FirebaseOptions get currentPlatform {
    if (kIsWeb) return web;
    switch (defaultTargetPlatform) {
      case TargetPlatform.android:
        return android;
      case TargetPlatform.iOS:
        return ios;
      default:
        throw UnsupportedError('Unsupported platform');
    }
  }

  static const web = FirebaseOptions(
    apiKey: 'AIzaSyDekj5vhSs84o6jhjjCl1ntaFWGQtCzveo',
    appId: '1:446244769194:web:98ffd97673405d9af0efd3',
    messagingSenderId: '446244769194',
    projectId: 'charlotte-substrate',
    authDomain: 'charlotte-substrate.firebaseapp.com',
    storageBucket: 'charlotte-substrate.firebasestorage.app',
  );

  static const android = FirebaseOptions(
    apiKey: 'AIzaSyBcuQf466lK-pPuvUO4mKk8HalEyL6Jw1Q',
    appId: '1:446244769194:android:ac64998e209fbaedf0efd3',
    messagingSenderId: '446244769194',
    projectId: 'charlotte-substrate',
    storageBucket: 'charlotte-substrate.firebasestorage.app',
  );

  static const ios = FirebaseOptions(
    apiKey: 'AIzaSyATJkrTc7d2WiYlhsj9vb6H4IKeq4JAyf8',
    appId: '1:446244769194:ios:518be8195a3a55b1f0efd3',
    messagingSenderId: '446244769194',
    projectId: 'charlotte-substrate',
    storageBucket: 'charlotte-substrate.firebasestorage.app',
    iosBundleId: 'com.someai.maestro',
  );
}
