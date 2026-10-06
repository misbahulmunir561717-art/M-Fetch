import os
import webview
from api.routes import Api

if __name__ == '__main__':
    api = Api()
    app_dir = os.path.dirname(os.path.abspath(__file__))
    ui_path = os.path.join(app_dir, 'ui', 'index.html')
    
    window = webview.create_window(
        'M-Fetch',
        url=ui_path,
        js_api=api,
        width=450,
        height=850,
        resizable=True
    )
    
    api.set_window(window)
    webview.start()