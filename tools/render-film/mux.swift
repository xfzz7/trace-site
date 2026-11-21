import Foundation
import AVFoundation
let args = CommandLine.arguments
let dir = URL(fileURLWithPath: args[1], isDirectory: true)
let wav = try AVAudioFile(forReading: dir.appendingPathComponent("score.wav"))
let audioURL = dir.appendingPathComponent("score.m4a")
let audio = try AVAudioFile(forWriting: audioURL, settings: [
    AVFormatIDKey: kAudioFormatMPEG4AAC,
    AVSampleRateKey: 48_000,
    AVNumberOfChannelsKey: 2,
    AVEncoderBitRateKey: 192_000
])
let pcm = AVAudioPCMBuffer(pcmFormat: wav.processingFormat, frameCapacity: AVAudioFrameCount(wav.length))!
try wav.read(into: pcm)
try audio.write(from: pcm)
try audio.close()

for lang in ["zh", "en"] {
    let videoAsset = AVURLAsset(url: dir.appendingPathComponent("silent-\(lang).mp4"))
    let audioAsset = AVURLAsset(url: audioURL)
    let composition = AVMutableComposition()
    let videoTrack = videoAsset.tracks(withMediaType: .video).first!
    let audioTrack = audioAsset.tracks(withMediaType: .audio).first!
    try composition.addMutableTrack(withMediaType: .video, preferredTrackID: kCMPersistentTrackID_Invalid)!
        .insertTimeRange(videoTrack.timeRange, of: videoTrack, at: .zero)
    let length = CMTimeMinimum(audioTrack.timeRange.duration, videoTrack.timeRange.duration)
    try composition.addMutableTrack(withMediaType: .audio, preferredTrackID: kCMPersistentTrackID_Invalid)!
        .insertTimeRange(CMTimeRange(start: audioTrack.timeRange.start, duration: length), of: audioTrack, at: .zero)
    let export = AVAssetExportSession(asset: composition, presetName: AVAssetExportPresetPassthrough)!
    export.shouldOptimizeForNetworkUse = true
    let final = dir.appendingPathComponent("trace-replay-\(lang).mp4")
    try await export.export(to: final, as: .mp4)
    let asset = AVURLAsset(url: final)
    let encodedVideo = try await asset.loadTracks(withMediaType: .video)
    let encodedAudio = try await asset.loadTracks(withMediaType: .audio)
    let size = try await encodedVideo[0].load(.naturalSize)
    let fps = try await encodedVideo[0].load(.nominalFrameRate)
    let duration = try await asset.load(.duration)
    print("\(final.lastPathComponent): \(Int(size.width))×\(Int(size.height)), \(fps) fps, \(duration.seconds)s, audio tracks: \(encodedAudio.count)")
}
