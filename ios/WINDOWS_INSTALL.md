# Windows-only: install the FP-10 MIDI prototype on your iPhone

The MIDI version is a **native iOS app**, not the GitHub Pages PWA. The existing PWA is unchanged and can stay on your Home Screen. This version bundles the same note-reading UI for offline use and receives MIDI through CoreMIDI; the first real-device test is still pending.

## Build without a Mac

GitHub Actions runs Xcode on a hosted Mac and generates an **unsigned** iPhone IPA. Open **Actions → Build iPhone MIDI app (unsigned) → latest successful run**, and download the artifact named `piano-trainer-unsigned-ipa`. Unzip the artifact ZIP to get `PianoTrainer-unsigned.ipa`. The workflow keeps artifacts for 14 days. A green workflow only proves that the code compiled and its web resources were included; it is **not** a test on a physical iPhone or FP-10.

## Free personal test on Windows: AltStore Classic

Official documentation: https://faq.altstore.io/altstore-classic/how-to-install-altstore-windows

1. Install iTunes and iCloud for Windows according to the **AltStore Classic Windows guide**, ideally Apple's direct downloads rather than the Microsoft Store editions.
2. Install **AltServer for Windows** using https://altstore.io/ . This is a third-party tool, not an Apple product. Only obtain it from its official site.
3. Unlock your iPhone, connect it to Windows with a cable and tap **Trust** when asked. Run AltServer and choose **Install AltStore** for your iPhone. Follow the official setup instructions.
4. On iPhone, allow the developer app under **Settings → General → VPN & Device Management**, and enable **Settings → Privacy & Security → Developer Mode** if asked. Restart when iOS prompts you.
5. Transfer the extracted `PianoTrainer-unsigned.ipa` to the iPhone Files app (for example using iCloud Drive). In **AltStore Classic → My Apps**, use the **+** button to choose and sign the IPA. You may need AltServer running on your Windows PC during installation.
6. Launch **读谱训练**. Tap **连接 FP-10 / MIDI**, pick the FP-10 in Apple's Bluetooth MIDI dialog, dismiss the dialog, and play a displayed note. The small status label should list a MIDI source; the trainer should show correct/wrong according to the exact note **and octave**.

**Important limitation:** Apps installed through AltStore with a free Apple account must be refreshed at least once every **7 days** using AltStore/AltServer, or they will stop launching until refreshed. This is an iOS signing constraint, not a bug in the trainer. On free accounts AltStore also has a three-active-app limit. Never send Apple account credentials to anyone in this repository or chat.

## More convenient long-term option

An Apple Developer Program membership (currently **US$99/year**) can distribute test builds with TestFlight. A Mac is not strictly necessary if you use a cloud build/submit service, but this prototype does not yet include that paid signing and distribution setup. Do not purchase membership just to try the first prototype unless you want to avoid AltStore's seven-day refresh workflow.

## Future updates

Changing GitHub Pages does **not** update the native app's bundled UI. For native updates, produce a new IPA from a successful build, install it through the same signing route, and do not uninstall the old app first if you want to preserve any future locally stored progress. The microphone/acoustic tuning feature is a later, separate milestone.
