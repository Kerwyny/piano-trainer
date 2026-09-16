# iPhone Bluetooth MIDI prototype

This folder is the native iOS bridge for the existing piano-trainer web UI.

## Why a native bridge

The current GitHub Pages PWA remains the main practice UI. On iPhone, Safari does not expose the Web MIDI API, so Bluetooth MIDI cannot be read directly by the PWA. The iOS wrapper uses Apple's CoreMIDI/CoreAudioKit APIs and forwards MIDI Note On events into the existing JavaScript trainer.

## Intended flow

1. Open the iOS app.
2. Tap **Connect FP-10 / MIDI**.
3. Apple's Bluetooth MIDI picker shows nearby BLE-MIDI keyboards.
4. Select `FP-10`.
5. CoreMIDI receives MIDI Note On events.
6. The native wrapper calls `window.pianoTrainer.receiveMIDINote(noteNumber, velocity)` in the web trainer.
7. The trainer compares the exact MIDI note, including octave, with the displayed staff note.

This is not hard-coded to Roland. Any keyboard that exposes standard MIDI input through CoreMIDI should work.

## Prototype files

- `PianoTrainerApp.swift` — app entry point
- `ContentView.swift` — native shell and Bluetooth MIDI button
- `TrainerWebView.swift` — hosts the existing GitHub Pages trainer
- `AppModel.swift` — bridge from native MIDI to JavaScript
- `MIDIManager.swift` — CoreMIDI input and Note On parsing
- `BluetoothMIDIPicker.swift` — Apple's BLE-MIDI device picker

## Xcode project setup (one-time)

The source is staged here first so the working PWA is not disturbed. To install it on an iPhone, create/open an iOS SwiftUI project in Xcode and add these files. The target should include these frameworks:

- CoreMIDI
- CoreAudioKit
- WebKit

Add this key to the app target's Info settings:

- `Privacy - Bluetooth Always Usage Description` (`NSBluetoothAlwaysUsageDescription`): `Connect to a piano or MIDI keyboard for note-reading practice.`

Use iOS 16 or later as the deployment target.

## Current test target

First hardware target: Roland FP-10 over Bluetooth MIDI. Roland documents the FP-10 as supporting Bluetooth MIDI on iPhone/iPad.

## Later microphone mode

Do not mix microphone pitch detection into this first MIDI milestone. A later acoustic-piano mode can use the microphone for onset + pitch detection. That mode should include a short tuning/calibration step (for example detecting the piano's actual A4 reference or estimating a global cents offset) so it can adapt to pianos that are not exactly at A4 = 440 Hz.
