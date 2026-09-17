import SwiftUI
import CoreAudioKit

/// Apple's built-in BLE-MIDI browser. Selecting a compatible keyboard makes it
/// available to CoreMIDI, where MIDIManager will pick it up automatically.
struct BluetoothMIDIPicker: UIViewControllerRepresentable {
    func makeUIViewController(context: Context) -> CABTMIDICentralViewController {
        CABTMIDICentralViewController()
    }

    func updateUIViewController(_ uiViewController: CABTMIDICentralViewController, context: Context) {
        // No configuration is required; CoreAudioKit owns the discovery UI.
    }
}
