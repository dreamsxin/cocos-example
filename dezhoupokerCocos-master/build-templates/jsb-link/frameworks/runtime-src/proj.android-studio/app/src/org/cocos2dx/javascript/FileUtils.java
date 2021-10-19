package org.cocos2dx.javascript;

import android.content.Context;
import android.os.Environment;
import android.util.Base64;

import java.io.File;
import java.io.FileInputStream;

/**
 * Created by Administrator on 2017/2/21.
 */

public class FileUtils {

    private static final String ROOT_FILE_NAME = "Rectuit";
    private static final String IMG_FILE_NAME = "imgs";

    public static Context context;
    private static FileUtils instant;

    public static void initContext(Context con) {
        context = con;
    }
//    public static FileUtils getInstant() {
//        if (instant == null)
//            instant = new FileUtils();
//        return instant;
//    }
//    private FileUtils() {}

    public static String getThumbDir() {
        File file = new File(getSDPath() + File.separator + ROOT_FILE_NAME + File.separator + IMG_FILE_NAME);
        if (!file.exists()) file.mkdirs();
        return file.getPath();
    }

    public static String getSDPath() {
        File sdDir = null;
        boolean sdCardExist = Environment.getExternalStorageState()
                .equals(Environment.MEDIA_MOUNTED);//判断sd卡是否存在
        if (sdCardExist) {
            sdDir = Environment.getExternalStorageDirectory();//获取跟目录
        } else {
            sdDir = context.getFilesDir();
        }
        return sdDir.getPath();
    }

    public String getimgFile() {
        File file = new File(getSDPath() + File.separator + ROOT_FILE_NAME + File.separator + IMG_FILE_NAME);
        if (!file.exists()) file.mkdirs();
        return file.getPath();
    }

    /**
     * 文件转base64
     * @param path
     * @return
     * @throws Exception
     */
    public static String encodeBase64File(String path) throws Exception {
        File file = new File(path);
        FileInputStream inputFile = new FileInputStream(file);
        byte[] buffer = new byte[(int) file.length()];
        inputFile.read(buffer);
        inputFile.close();
        return Base64.encodeToString(buffer, Base64.DEFAULT);
    }

}
