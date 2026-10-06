[app]
title = M-Fetch
package.name = mfetch
package.domain = org.misbah
source.dir = .
source.include_exts = py,png,jpg,html,css,js
version = 1.0
requirements = python3,pywebview,yt-dlp
orientation = portrait
fullscreen = 0
android.permissions = INTERNET, WRITE_EXTERNAL_STORAGE, READ_EXTERNAL_STORAGE
android.api = 33
android.minapi = 21
android.accept_sdk_license = True

[buildozer]
log_level = 2
warn_on_root = 1