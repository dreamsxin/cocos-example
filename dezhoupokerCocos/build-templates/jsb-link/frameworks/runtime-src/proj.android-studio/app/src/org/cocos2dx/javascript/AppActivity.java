/*
 * @Author: burt
 * @Date: 2019-10-31 14:45:56
 * @LastEditors: burt
 * @LastEditTime: 2020-10-27 16:36:57
 * @Description:
 */
/****************************************************************************
 Copyright (c) 2015-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/
package org.cocos2dx.javascript;

import org.cocos2dx.lib.Cocos2dxActivity;
import org.cocos2dx.lib.Cocos2dxGLSurfaceView;
import org.cocos2dx.lib.Cocos2dxWebView;

import android.content.Context;
import android.content.pm.ActivityInfo;
import android.content.pm.ApplicationInfo;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;

import android.content.Intent;
import android.content.res.Configuration;
import android.support.v4.content.FileProvider;
import android.util.Log;

import java.io.File;
import android.view.WindowManager;

import android.content.ClipData;
import android.content.ClipboardManager;

import android.provider.Settings;

import org.cocos2dx.lib.Cocos2dxJavascriptJavaBridge;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.app.ProgressDialog;
import android.content.ContentResolver;
import android.content.CursorLoader;
import android.database.Cursor;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.drawable.BitmapDrawable;

import android.provider.MediaStore;
import android.widget.ImageView;

import java.io.ByteArrayOutputStream;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;

import java.io.FileOutputStream;

// import cz.msebera.android.httpclient.extras.Base64;
// import cz.msebera.android.httpclient.protocol.ResponseConnControl;
// import cz.msebera.android.httpclient.util.TextUtils;
import okhttp3.Call;
import okhttp3.MediaType;
import okhttp3.MultipartBody;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;

import com.hjq.permissions.OnPermission;
import com.hjq.permissions.Permission;
import com.hjq.permissions.XXPermissions;
import com.hjq.toast.ToastUtils;
import com.hjq.toast.style.ToastWhiteStyle;

import java.util.HashMap;
import java.util.List;
import android.content.pm.ResolveInfo;

import java.net.NetworkInterface;
import java.net.InetAddress;
import java.util.Enumeration;
import android.view.View;

public class AppActivity extends Cocos2dxActivity {
    private static AppActivity mApp;
    private static Cocos2dxWebView mWebView;
    public static ClipboardManager mClipboard = null;

    public static final int SELECT_PHOTO = 1;
    public static String img_src = "";
    public static ImageView imageView = null;
    public static String uploadUrls = null;
    public static String img_url = "";
    public static final int PHOTOZOOM = 2;
    public static final String IMAGE_UNSPECIFIED = "image/*";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        mApp = this;
        // setTheme(style.Theme_Black_NoTitleBar_Fullscreen);
        // setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE);
        super.onCreate(savedInstanceState);
        if (!isTaskRoot()) {
            // Android launched another instance of the root activity into an existing task
            //  so just quietly finish and go away, dropping the user back into the activity
            //  at the top of the stack (ie: the last state of this task)
            // Don't need to finish it again since it's finished in super.onCreate .
            // finish();
            return;
        }
        imageView = new ImageView(this);
        if (null == mClipboard) {
            mClipboard = (ClipboardManager)getSystemService(Context.CLIPBOARD_SERVICE);
        }
        // Workaround in https://stackoverflow.com/questions/16283079/re-launch-of-activity-on-home-button-but-only-the-first-time/16447508
        // DO OTHER INITIALIZATION BELOW
        SDKWrapper.getInstance().init(this);
        ToastUtils.init(getApplication(), new ToastWhiteStyle(this));

        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON); // 保持屏幕常亮
        // getWindow().addFlags(WindowManager.LayoutParams.FLAG_SECURE); // 防止屏幕录制

        View decorView = getWindow().getDecorView();
        int uiOptions = View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                        | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
                        | View.SYSTEM_UI_FLAG_FULLSCREEN
                        | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION;
        decorView.setSystemUiVisibility(uiOptions);

    }

    @Override
    public Cocos2dxGLSurfaceView onCreateView() {
        Cocos2dxGLSurfaceView glSurfaceView = new Cocos2dxGLSurfaceView(this);
        // TestCpp should create stencil buffer
        glSurfaceView.setEGLConfigChooser(5, 6, 5, 0, 16, 8);
        SDKWrapper.getInstance().setGLSurfaceView(glSurfaceView, this);

        return glSurfaceView;
    }

    // 新增函数
    private void hideSystemUI()
    {
        // Set the IMMERSIVE flag.
        // Set the content to appear under the system bars so that the content
        // doesn't resize when the system bars hide and show.
        Cocos2dxGLSurfaceView glSurfaceView = new Cocos2dxGLSurfaceView(this);
        glSurfaceView.setSystemUiVisibility(
                Cocos2dxGLSurfaceView.SYSTEM_UI_FLAG_LAYOUT_STABLE
                        | Cocos2dxGLSurfaceView.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                        | Cocos2dxGLSurfaceView.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                        | Cocos2dxGLSurfaceView.SYSTEM_UI_FLAG_HIDE_NAVIGATION // hide nav bar
                        | Cocos2dxGLSurfaceView.SYSTEM_UI_FLAG_FULLSCREEN // hide status bar
                        | Cocos2dxGLSurfaceView.SYSTEM_UI_FLAG_IMMERSIVE_STICKY);
    }

    @Override
    protected void onResume() {
        super.onResume();
        SDKWrapper.getInstance().onResume();

    }

    @Override
    protected void onPause() {
        super.onPause();
        SDKWrapper.getInstance().onPause();

    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        SDKWrapper.getInstance().onDestroy();

    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        SDKWrapper.getInstance().onActivityResult(requestCode, resultCode, data);

        switch (requestCode) {

            case SELECT_PHOTO:
                switch (resultCode) {
                    case RESULT_OK:
                        Uri uri = data.getData();
                        img_src = uri.getPath();
                        try {
                            // Log.i("resultCode22222",String.valueOf(resultCode));
                            ContentResolver contentResolver = mApp.getContentResolver();
                            Bitmap bitmap = BitmapFactory.decodeStream(contentResolver.openInputStream(uri));
                            /* ?Bitmap???ImageView */
                            imageView.setImageBitmap(bitmap);

                            String[] proj = {MediaStore.Images.Media.DATA};
                            CursorLoader loader = new CursorLoader(getContext(), uri, proj, null, null, null);
                            Cursor cursor = loader.loadInBackground();
                            if (cursor != null) {
                                int column_index = cursor.getColumnIndexOrThrow(MediaStore.Images.Media.DATA);
                                cursor.moveToFirst();

                                img_src = cursor.getString(column_index);//??????
                                String targetPath = FileUtils.getThumbDir()+"compressPic.png";
                                //调用压缩图片的方法，返回压缩后的path
                                final String compressImg = PictureUtil.compressImage(img_src,targetPath,30);

                                upload(compressImg);
                            }
                            cursor.close();
                        } catch (FileNotFoundException e) {
                            Log.e("Exception", e.getMessage(),e);
                        }

                        break;
                }
                break;

        }
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        SDKWrapper.getInstance().onNewIntent(intent);
    }

    @Override
    protected void onRestart() {
        super.onRestart();
        SDKWrapper.getInstance().onRestart();
    }

    @Override
    protected void onStop() {
        super.onStop();
        SDKWrapper.getInstance().onStop();
    }

    @Override
    public void onBackPressed() {
        SDKWrapper.getInstance().onBackPressed();
        super.onBackPressed();
    }

    @Override
    public void onConfigurationChanged(Configuration newConfig) {
        SDKWrapper.getInstance().onConfigurationChanged(newConfig);
        super.onConfigurationChanged(newConfig);
    }

    @Override
    protected void onRestoreInstanceState(Bundle savedInstanceState) {
        SDKWrapper.getInstance().onRestoreInstanceState(savedInstanceState);
        super.onRestoreInstanceState(savedInstanceState);
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        SDKWrapper.getInstance().onSaveInstanceState(outState);
        super.onSaveInstanceState(outState);
    }

    @Override
    protected void onStart() {
        SDKWrapper.getInstance().onStart();
        super.onStart();
    }
    //jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity","setOrientation","(Ljava/lang/String;)V","V");
    public static void setOrientation(String dir){
        if(dir.equals("V"))
            ((AppActivity)(SDKWrapper.getInstance().getContext())).setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_SENSOR_PORTRAIT);
        else
            ((AppActivity)(SDKWrapper.getInstance().getContext())).setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_SENSOR_LANDSCAPE);
    }

    //installApk
    public  static  void  installApkAction(String filepath) {
        File apkFile = new File(filepath);
        if(!apkFile.exists()) {
            return;
        }

        try {
            String[] args2 = { "chmod", "604", filepath};
            Runtime.getRuntime().exec(args2);
        } catch (IOException e) {
            e.printStackTrace();
        }

        try {
            Runtime.getRuntime().exec( "chmod 777 " + filepath);
        } catch (IOException e) {
            e.printStackTrace();
        }

        Intent install = new Intent(Intent.ACTION_VIEW);
        install.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        install.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
        install.addFlags(Intent.FLAG_GRANT_PERSISTABLE_URI_PERMISSION);
        install.addFlags(Intent.FLAG_ACTIVITY_FORWARD_RESULT);
        Uri uri;
        if(Build.VERSION.SDK_INT >= 24) { //判读版本是否在7.0以上
            uri = FileProvider.getUriForFile(mApp,mApp.getPackageName()+".fileProvider",apkFile);
        } else {
            uri = Uri.fromFile(apkFile);
        }
        install.setDataAndType(uri,"application/vnd.android.package-archive");
        mApp.grantUriPermission(mApp.getPackageName(),uri,Intent.FLAG_GRANT_READ_URI_PERMISSION);
        // 查询所有符合 intent 跳转目标应用类型的应用，注意此方法必须放置在 setDataAndType 方法之后
        List<ResolveInfo> resolveLists = mApp.getPackageManager().queryIntentActivities(install, PackageManager.MATCH_DEFAULT_ONLY);
        // 然后全部授权
        for (ResolveInfo resolveInfo : resolveLists){
            String packageName = resolveInfo.activityInfo.packageName;
            mApp.grantUriPermission(packageName, uri, Intent.FLAG_GRANT_READ_URI_PERMISSION | Intent.FLAG_GRANT_WRITE_URI_PERMISSION);
        }

        mApp.startActivity(install);
        android.os.Process.killProcess(android.os.Process.myPid());
    }

    //????
    public static boolean  clipBoardAction(String clipBoardStr) {
        try {
            if (mClipboard != null) {
                ClipData clip = ClipData.newPlainText("test",clipBoardStr);
                mClipboard.setPrimaryClip(clip);
            }
            return  true;
        } catch (Exception e) {
            return  false;
        }
    }

    //??????
    public static String getClipBoardText() {
        try {
            String text = "";
            if (mClipboard != null) {
                ClipData clip = mClipboard.getPrimaryClip();
                text = clip.getItemAt(0).getText().toString();

            }
            return  text;
        } catch (Exception e) {
            return "";
        }
    }

    /**
     * 选择图片
     * */
    public static void selectImg(String uploadUrl) {
        // System.out.println("uploadUrl === "+uploadUrl);
        uploadUrls = uploadUrl;
        Intent intent = new Intent(Intent.ACTION_PICK, MediaStore.Images.Media.EXTERNAL_CONTENT_URI);
        intent.setDataAndType(MediaStore.Images.Media.EXTERNAL_CONTENT_URI,"image/*");
        mApp.startActivityForResult(intent,SELECT_PHOTO);
    }

    /**
     * 上传图片
     * */
    private void upload(String picturePath) {
        imageUpLoad(picturePath);
    }

    /**
     * ????
     * */
    public static void imageUpLoad(String localPath) {
        if(uploadUrls == null) {
            return;
        }
        // System.out.println("uploadUrls = "+uploadUrls);
        MediaType MEDIA_TYPE_PNG = MediaType.parse("image/png");
        OkHttpClient client = new OkHttpClient();

        MultipartBody.Builder builder = new MultipartBody.Builder().setType(MultipartBody.FORM);
        File file = new File(localPath);
        builder.addFormDataPart("file",file.getName(), RequestBody.create(MEDIA_TYPE_PNG,file));

        final MultipartBody multipartBody = builder.build();

        final Request request = new Request.Builder()
                .url(uploadUrls)
                .post(multipartBody)
                .build();
        client.newCall(request).enqueue(new okhttp3.Callback() {
            @Override
            public void onFailure(Call call, IOException e) {
                // System.out.println("????:e.getLocalizedMessage() = " + e.getLocalizedMessage());
                mApp.runOnGLThread(new Runnable() {
                    @Override
                    public void run() {
                        String evalStr2 = "cc.gg.global.onUploadImageCallback("+ 2 + ", \"" + "Send Image Failed!" + "\")";
                        Cocos2dxJavascriptJavaBridge.evalString(evalStr2);
                    }
                });
            }

            @Override
            public void onResponse(Call call, Response response) throws IOException {
                String responseData = response.body().string();
                try {
                    JSONObject jsonObject = new JSONObject(responseData);
                    String responseDataStr = jsonObject.optString("data");
                    JSONObject responseDatas = new JSONObject(responseDataStr);
                    String url = responseDatas.optString("url");
                    img_url = url;
                    mApp.runOnGLThread(new Runnable() {
                        @Override
                        public void run() {
                            String evalStr2 = "cc.gg.global.onUploadImageCallback("+ 1 + ", \"" + img_url + "\")";
                            Cocos2dxJavascriptJavaBridge.evalString(evalStr2);
                        }
                    });
                } catch (JSONException e) {
                    e.printStackTrace();
                    mApp.runOnGLThread(new Runnable() {
                        @Override
                        public void run() {
                            String evalStr2 = "cc.gg.global.onUploadImageCallback("+ 2 + ", \"" + "Upload Image Failed!" + "\")";
                            Cocos2dxJavascriptJavaBridge.evalString(evalStr2);
                        }
                    });

                }
            }
        });
    }

    // 保存texture纹理到本地
    public static void saveTextureToLocal( String pngPath) {
        // System.out.println("pngPath"+pngPath);
        Intent intent = new Intent(Intent.ACTION_MEDIA_SCANNER_SCAN_FILE);
        Uri uri = Uri.fromFile(new File(pngPath));
        intent.setData(uri);
        mApp.sendBroadcast(intent);
    }

    public static String getAppPackageName() {
        return mApp.getPackageName();
    }
    /**
     * @Description: 获取安装包固定信息
     */
    public static String getHqqPackageInfo() {  
        return "{\"pinpai\":\"test\",\"huanjin\":\"dev\",\"system\":\"android\",\"version\":\"1.0.9\",\"proxyid\":\"351027469\",\"language\":\"CN\",\"country\":\"china\",\"currency\":\"rmb\",\"engine_version\":\"2.4.3\"}";
    }

    // 获取app版本号
    public static String getAppVersionName() {
        String versionName = "";
        // String versioncode = "";
        try {
            PackageManager pm = mApp.getPackageManager();
            PackageInfo pi = pm.getPackageInfo(mApp.getPackageName(), 0);
            versionName = pi.versionName;
            // versioncode = pi.versionCode;
            if (versionName == null || versionName.length() <= 0) {
                return "";
            }
        } catch (Exception e) {
            Log.e("VersionInfo", "Exception", e);
        }
        return versionName;
    }

    /**
     * 获取存储权限
     */
    public static void requestPermissionAction() {
        mApp.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                XXPermissions.with(mApp)
                        .permission(Permission.Group.STORAGE)
                        .request(new OnPermission() {
                            @Override
                            public void hasPermission(List<String> granted, boolean isAll) {
                                if (isAll) {
                                    ToastUtils.show("获取权限成功");
                                }else {
                                    ToastUtils.show("获取权限成功，部分权限未正常授予");
                                }
                            }

                            @Override
                            public void noPermission(List<String> denied, boolean quick) {
                                if(quick) {
                                    ToastUtils.show("被永久拒绝授权，请手动授予权限");
                                    //??????????????????????
                                    XXPermissions.gotoPermissionSettings(mApp);
                                }else {
                                    ToastUtils.show("获取权限失败");
                                }
                            }
                        });
            }
        });
    }

    /**
     * 是否已经获取存储权限
     * @return
     */
    public static boolean isHasStoragePermission() {
        if (XXPermissions.isHasPermission(mApp, Permission.Group.STORAGE)) {
            System.out.println("已经获取到权限，不需要再次申请了");
            return  true;
        }else {
            System.out.println("还没有获取到权限或者部分权限未授予");
            return false;
        }
    }

    public static boolean renameFile(String oldPath, String newPath) {
        File file = new File(oldPath);
        return file.renameTo(new File(newPath));
    }

    // // 打开相册 待测试
    // public static void openPhoto(){
    //     runOnUiThread(new Runnable() {
    //         @Override
    //         public void run() {
    //             Intent intent = new Intent(Intent.ACTION_PICK, null);
    //             intent.setDataAndType(MediaStore.Images.Media.EXTERNAL_CONTENT_URI,IMAGE_UNSPECIFIED);
    //             activity.startActivityForResult(intent, PHOTOZOOM);
    //         }
    //     });
    // }
    /**
     * @Description: 获取本地ip地址
     */
    public static String getLocalIpAddress() {  
        try {  
            for (Enumeration<NetworkInterface> en = NetworkInterface.getNetworkInterfaces(); en.hasMoreElements();) {  
                NetworkInterface intf = en.nextElement();  
                for (Enumeration<InetAddress> enumIpAddr = intf.getInetAddresses(); enumIpAddr.hasMoreElements();) {  
                    InetAddress inetAddress = enumIpAddr.nextElement();  
                    // if (!inetAddress.isLoopbackAddress()) {  
                    if (!inetAddress.isLoopbackAddress() && !inetAddress.isLinkLocalAddress()) {  
                        return inetAddress.getHostAddress().toString();  
                    }  
                }  
            }  
        } catch (Exception ex) {  
        }  
        return null;
    }
}
