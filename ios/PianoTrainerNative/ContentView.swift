import SwiftUI

struct ContentView: View {
    @StateObject private var model = AppModel()
    @State private var showBluetoothPicker = false

    var body: some View {
        VStack(spacing: 0) {
            HStack(spacing: 10) {
                VStack(alignment: .leading, spacing: 2) {
                    Text("MIDI 输入")
                        .font(.caption)
                        .foregroundStyle(.secondary)
                    Text(model.midiStatus)
                        .font(.footnote.weight(.medium))
                        .lineLimit(1)
                }

                Spacer(minLength: 8)

                Button("连接 FP-10 / MIDI") {
                    showBluetoothPicker = true
                }
                .buttonStyle(.borderedProminent)
            }
            .padding(.horizontal, 12)
            .padding(.vertical, 8)
            .background(.bar)

            TrainerWebView(model: model)
        }
        .sheet(isPresented: $showBluetoothPicker, onDismiss: {
            model.refreshMIDI()
        }) {
            NavigationStack {
                BluetoothMIDIPicker()
                    .navigationTitle("Bluetooth MIDI")
                    .navigationBarTitleDisplayMode(.inline)
                    .toolbar {
                        ToolbarItem(placement: .topBarTrailing) {
                            Button("完成") {
                                showBluetoothPicker = false
                            }
                        }
                    }
            }
        }
    }
}
