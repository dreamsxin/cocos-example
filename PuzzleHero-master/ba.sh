/Applications/CocosCreator.app/Contents/MacOS/CocosCreator --path ./ --build "platform=android;debug=false;appABIs=['armeabi-v7a','x86','arm64-v8a']"
cd /Users/maxleung/iphonepj/puzzlehero/build/jsb-link/frameworks/runtime-src/proj.android-studio
gradle assembleDebug
