def request_permissions():
    try:
        from jnius import autoclass
        PythonActivity = autoclass('org.kivy.android.PythonActivity')
        ContextCompat = autoclass('androidx.core.content.ContextCompat')
        Manifest = autoclass('android.Manifest')
        PackageManager = autoclass('android.content.pm.PackageManager')
        
        context = PythonActivity.mActivity
        
        permissions = [
            Manifest.permission.INTERNET,
            Manifest.permission.READ_EXTERNAL_STORAGE,
            Manifest.permission.WRITE_EXTERNAL_STORAGE,
        ]
        
        for perm in permissions:
            if ContextCompat.checkSelfPermission(context, perm) != PackageManager.PERMISSION_GRANTED:
                context.requestPermissions([perm], 1)
    except Exception:
        pass