import threading
import yt_dlp

class Api:
    def __init__(self):
        self.window = None

    def set_window(self, window):
        self.window = window

    def get_info(self, url):
        try:
            ydl_opts = {'quiet': True, 'noplaylist': True}
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                info = ydl.extract_info(url, download=False)
                
                filesize = info.get('filesize') or info.get('filesize_approx') or 0
                if filesize > 0:
                    filesize_mb = f"{filesize / (1024 * 1024):.2f} MB"
                else:
                    filesize_mb = "Unknown"

                return {
                    'title': info.get('title', 'Unknown'),
                    'duration': info.get('duration', 0),
                    'thumbnail': info.get('thumbnail', ''),
                    'filesize': filesize_mb
                }
        except Exception as e:
            return {'error': str(e)}

    def start_download(self, url, format_type, quality):
        thread = threading.Thread(target=self._process_download, args=(url, format_type, quality))
        thread.daemon = True
        thread.start()
        return True

    def _process_download(self, url, format_type, quality):
        def progress_hook(d):
            if d['status'] == 'downloading':
                percent_str = d.get('_percent_str', '0%').replace('%', '').strip()
                speed_str = d.get('_speed_str', '0 B/s').strip()
                downloaded_str = d.get('_downloaded_bytes_str', '0 B').strip()
                total_str = d.get('_total_bytes_str', d.get('_total_bytes_estimate_str', '0 B')).strip()

                try:
                    percent_float = float(percent_str)
                except:
                    percent_float = 0.0

                if self.window:
                    js_code = f"window.updateDownloadProgress({percent_float}, '{speed_str}', '{downloaded_str}', '{total_str}')"
                    self.window.evaluate_js(js_code)
                    
            elif d['status'] == 'finished':
                if self.window:
                    self.window.evaluate_js("window.updateDownloadProgress(100, '0 B/s', 'Selesai', 'Selesai')")

        ydl_opts = {
            'format': 'bestvideo+bestaudio/best' if format_type == 'mp4' else 'bestaudio/best',
            'outtmpl': '%(title)s.%(ext)s',
            'progress_hooks': [progress_hook],
            'quiet': True,
            'noplaylist': True
        }

        if format_type == 'mp3':
            ydl_opts['postprocessors'] = [{
                'key': 'FFmpegExtractAudio',
                'preferredcodec': 'mp3',
                'preferredquality': '192',
            }]

        try:
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                ydl.download([url])
        except Exception:
            pass