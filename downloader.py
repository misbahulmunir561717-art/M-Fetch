import threading
import yt_dlp
import os
from core.config import get_settings

class Downloader:
    def __init__(self, window):
        self.window = window

    def start(self, url, fmt, quality):
        threading.Thread(target=self._run, args=(url, fmt, quality), daemon=True).start()

    def _run(self, url, fmt, quality):
        def progress(d):
            if d['status'] == 'downloading':
                p = d.get('_percent_str', '0%').replace('%', '').strip()
                s = d.get('_speed_str', '0 B/s').strip()
                dl = d.get('_downloaded_bytes_str', '0 B').strip()
                t = d.get('_total_bytes_str', d.get('_total_bytes_estimate_str', '0 B')).strip()
                try:
                    p_fl = float(p)
                except:
                    p_fl = 0.0
                if self.window:
                    self.window.evaluate_js(f"window.updateDownloadProgress({p_fl}, '{s}', '{dl}', '{t}')")
            elif d['status'] == 'finished':
                if self.window:
                    self.window.evaluate_js("window.updateDownloadProgress(100, '0 B/s', 'Selesai', 'Selesai')")

        settings = get_settings()
        out_dir = settings.get("download_dir", os.path.expanduser("~"))
        
        opts = {
            'format': 'bestvideo+bestaudio/best' if fmt == 'mp4' else 'bestaudio/best',
            'outtmpl': os.path.join(out_dir, '%(title)s.%(ext)s'),
            'progress_hooks': [progress],
            'quiet': True,
            'noplaylist': True
        }

        if fmt == 'mp3':
            opts['postprocessors'] = [{
                'key': 'FFmpegExtractAudio',
                'preferredcodec': 'mp3',
                'preferredquality': '192',
            }]

        try:
            with yt_dlp.YoutubeDL(opts) as ydl:
                ydl.download([url])
        except Exception:
            pass