/*
 * @Author: burt
 * @Date: 2019-09-13 08:53:14
 * @LastEditors: burt
 * @LastEditTime: 2019-10-11 15:42:39
 * @Description: 
 */
package org.cocos2dx.javascript;

import android.content.Context;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.provider.Settings;
import org.cocos2dx.lib.Cocos2dxActivity;
import java.io.File;
import android.os.Environment;
import android.util.Base64;
import android.content.Intent;
import android.widget.Toast;

import java.io.OutputStream;
import java.io.FileOutputStream;


public class NativeAndroidClass extends  Cocos2dxActivity {
    //获取设备唯一标识
    public static String getUniqueIdAction() {
        Context context = getContext();
        String uuId = Settings.Secure.getString(context.getContentResolver(), Settings.Secure.ANDROID_ID);
        return  uuId;
    }

    //保存图片到本地 base64
    public static boolean savePicture(String base64DataStr) {
        // 1.去掉base64中的前缀
        String base64Str = base64DataStr.substring(base64DataStr.indexOf(",") + 1, base64DataStr.length());
        // 获取手机相册的路径地址
        String galleryPath= Environment.getExternalStorageDirectory()
                + File.separator + Environment.DIRECTORY_DCIM
                +File.separator+"Camera"+File.separator;
        //创建文件来保存，第二个参数是文件名称，可以根据自己来命名
        File file = new File(galleryPath, System.currentTimeMillis() + ".png");
        String fileName = file.toString();
        // 3. 解析保存图片
        byte[] data = Base64.decode(base64Str, Base64.DEFAULT);

        for (int i = 0; i < data.length; i++) {
            if (data[i] < 0) {
                data[i] += 256;
            }
        }
        OutputStream os = null;
        try {
            os = new FileOutputStream(fileName);
            os.write(data);
            os.flush();
            os.close();
           return  true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        } finally {
            Intent intent = new Intent(Intent.ACTION_MEDIA_SCANNER_SCAN_FILE);
            Uri uri = Uri.fromFile(file);
            intent.setData(uri);
            getContext().sendBroadcast(intent);
            Toast.makeText(getContext(),"图片保存成功",Toast.LENGTH_SHORT);
        }
    }

    private void checkPermission() {
        PackageManager pm = getPackageManager();
        boolean permission_writeStorage = (PackageManager.PERMISSION_GRANTED ==
                pm.checkPermission("android.permission.WRITE_EXTERNAL_STORAGE","org.cocos2dx.javascript"));

        if (!permission_writeStorage) {

        }
    }
}
