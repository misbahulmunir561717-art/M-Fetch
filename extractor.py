import yt_dlp

def get_metadata(url):
    try:
        opts = {'quiet': True, 'noplaylist': True}
        with yt_dlp.YoutubeDL(opts) as ydl:
            info = ydl.extract_info(url, download=False)
            size = info.get('filesize') or info.get('filesize_approx') or 0
            return {
                'title': info.get('title', 'Unknown'),
                'duration': info.get('duration', 0),
                'thumbnail': info.get('thumbnail', ''),
                'filesize': f"{size / 1048576:.2f} MB" if size > 0 else "Unknown"
            }
    except Exception as e:
        return {'error': str(e)}