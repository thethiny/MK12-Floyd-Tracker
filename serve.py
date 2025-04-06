from http.server import SimpleHTTPRequestHandler, HTTPServer
import os


class MyHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        raw_path = self.path

        # Separate path and query
        if "?" in raw_path:
            path_only, query = raw_path.split("?", 1)
            query = "?" + query
        else:
            path_only = raw_path
            query = ""

        # If it's root `/`, serve `/index.html`
        if path_only == "/":
            self.path = "/index.html" + query
            return super().do_GET()

        # If path has extension (like .png, .css, .js), serve normally
        if os.path.splitext(path_only)[1]:
            return super().do_GET()

        # Otherwise, add .html
        self.path = path_only + ".html" + query
        return super().do_GET()


if __name__ == "__main__":
    server = HTTPServer(("0.0.0.0", 8000), MyHandler)
    print("Serving at http://localhost:8000")
    server.serve_forever()
