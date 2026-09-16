import Foundation
import CoreMIDI

/// Receives standard MIDI 1.0 input from every CoreMIDI source currently visible
/// to the app. BLE-MIDI devices selected in Apple's Bluetooth MIDI picker become
/// ordinary CoreMIDI sources and are connected here automatically.
final class MIDIManager {
    var onNoteOn: ((UInt8, UInt8) -> Void)?
    var onStatus: ((String) -> Void)?

    private var client = MIDIClientRef()
    private var inputPort = MIDIPortRef()
    private var connectedSources = Set<MIDIEndpointRef>()
    private var runningStatus: UInt8?

    init() {
        let clientStatus = MIDIClientCreateWithBlock("Piano Trainer" as CFString, &client) { [weak self] _ in
            self?.refreshSources()
        }

        guard clientStatus == noErr else {
            report("CoreMIDI client error: \(clientStatus)")
            return
        }

        let portStatus = MIDIInputPortCreateWithBlock(client, "Piano Trainer Input" as CFString, &inputPort) { [weak self] packetList, _ in
            self?.handle(packetList)
        }

        guard portStatus == noErr else {
            report("MIDI input error: \(portStatus)")
            return
        }

        refreshSources()
    }

    deinit {
        if inputPort != 0 { MIDIPortDispose(inputPort) }
        if client != 0 { MIDIClientDispose(client) }
    }

    func refreshSources() {
        guard inputPort != 0 else { return }

        let count = MIDIGetNumberOfSources()
        var visibleNames: [String] = []

        for index in 0..<count {
            let source = MIDIGetSource(index)
            guard source != 0 else { continue }
            visibleNames.append(endpointName(source))

            if !connectedSources.contains(source) {
                let status = MIDIPortConnectSource(inputPort, source, nil)
                if status == noErr {
                    connectedSources.insert(source)
                }
            }
        }

        if visibleNames.isEmpty {
            report("未连接 MIDI")
        } else {
            report("MIDI: \(visibleNames.joined(separator: ", "))")
        }
    }

    private func handle(_ packetList: UnsafePointer<MIDIPacketList>) {
        for packet in packetList.unsafeSequence() {
            parse(Array(packet.bytes()))
        }
    }

    /// Minimal MIDI 1.0 channel-voice parser. For this app we only need Note On.
    /// Running status is supported so normal keyboard traffic remains robust.
    private func parse(_ bytes: [UInt8]) {
        var index = 0

        while index < bytes.count {
            let first = bytes[index]
            let status: UInt8
            let dataStart: Int

            if first & 0x80 != 0 {
                // Realtime messages may appear between channel messages.
                if first >= 0xF8 {
                    index += 1
                    continue
                }

                status = first
                dataStart = index + 1
                if status < 0xF0 {
                    runningStatus = status
                } else {
                    runningStatus = nil
                }
            } else if let currentStatus = runningStatus {
                status = currentStatus
                dataStart = index
            } else {
                index += 1
                continue
            }

            let messageType = status & 0xF0
            let dataLength: Int

            switch messageType {
            case 0xC0, 0xD0:
                dataLength = 1
            case 0x80, 0x90, 0xA0, 0xB0, 0xE0:
                dataLength = 2
            default:
                // This prototype does not need SysEx/system-common parsing.
                index = max(index + 1, dataStart)
                continue
            }

            guard dataStart + dataLength <= bytes.count else { return }

            if messageType == 0x90 {
                let note = bytes[dataStart]
                let velocity = bytes[dataStart + 1]
                if velocity > 0 {
                    onNoteOn?(note, velocity)
                }
            }

            index = dataStart + dataLength
        }
    }

    private func endpointName(_ endpoint: MIDIEndpointRef) -> String {
        var property: Unmanaged<CFString>?
        if MIDIObjectGetStringProperty(endpoint, kMIDIPropertyDisplayName, &property) == noErr,
           let value = property?.takeRetainedValue() {
            return value as String
        }

        property = nil
        if MIDIObjectGetStringProperty(endpoint, kMIDIPropertyName, &property) == noErr,
           let value = property?.takeRetainedValue() {
            return value as String
        }

        return "MIDI device"
    }

    private func report(_ text: String) {
        DispatchQueue.main.async { [weak self] in
            self?.onStatus?(text)
        }
    }
}
