import SwiftUI
import WebKit

struct TrainerWebView: UIViewRepresentable {
    @ObservedObject var model: AppModel

    func makeCoordinator() -> Coordinator {
        Coordinator(model: model)
    }

    func makeUIView(context: Context) -> WKWebView {
        let configuration = WKWebViewConfiguration()
        configuration.websiteDataStore = .default()

        let webView = WKWebView(frame: .zero, configuration: configuration)
        webView.navigationDelegate = context.coordinator
        webView.scrollView.contentInsetAdjustmentBehavior = .never

        let url = URL(string: "https://kerwyny.github.io/piano-trainer/")!
        let request = URLRequest(
            url: url,
            cachePolicy: .returnCacheDataElseLoad,
            timeoutInterval: 20
        )
        webView.load(request)
        return webView
    }

    func updateUIView(_ uiView: WKWebView, context: Context) {}

    final class Coordinator: NSObject, WKNavigationDelegate {
        let model: AppModel

        init(model: AppModel) {
            self.model = model
        }

        func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
            model.attach(webView: webView)
            model.refreshMIDI()
        }
    }
}
