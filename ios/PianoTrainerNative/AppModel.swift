import Foundation
import Combine
import WebKit

final class AppModel: ObservableObject {
    @Published var midiStatus = "未连接 MIDI"

    let midi = MIDIManager()
    weak var webView: WKWebView?

    init() {
        midi.onStatus = { [weak self] text in
            DispatchQueue.main.async {
                self?.midiStatus = text
                self?.sendMIDIStatus(text)
            }
        }

        midi.onNoteOn = { [weak self] note, velocity in
            DispatchQueue.main.async {
                self?.sendNoteOn(note: note, velocity: velocity)
            }
        }
    }

    func attach(webView: WKWebView) {
        self.webView = webView
        sendMIDIStatus(midiStatus)
    }

    func refreshMIDI() {
        midi.refreshSources()
    }

    private func sendNoteOn(note: UInt8, velocity: UInt8) {
        let script = "window.pianoTrainer?.receiveMIDINote(\(note), \(velocity));"
        webView?.evaluateJavaScript(script, completionHandler: nil)
    }

    private func sendMIDIStatus(_ status: String) {
        guard let encoded = try? JSONSerialization.data(withJSONObject: [status]),
              let json = String(data: encoded, encoding: .utf8) else { return }

        // JSON encoding gives us a safely escaped JS string inside a one-element array.
        let script = "window.pianoTrainer?.setMIDIStatus(\(json)[0]);"
        webView?.evaluateJavaScript(script, completionHandler: nil)
    }
}
