import Foundation
import AVFoundation
import AppKit
import CoreText
import ImageIO

let arguments = CommandLine.arguments
guard arguments.count == 4 else {
    fatalError("Usage: swift render.swift <site-root> <output-directory> <zh|en>")
}
let root = URL(fileURLWithPath: arguments[1])
let output = URL(fileURLWithPath: arguments[2])
let lang = arguments[3]
let zh = lang == "zh"
let width = 1080, height = 1920, fps: Int32 = 30
let duration = 24.0
let canvas = CGRect(x: 0, y: 0, width: width, height: height)
let space = CGColorSpace(name: CGColorSpace.sRGB)!

func color(_ rgb: UInt32, _ alpha: CGFloat = 1) -> CGColor {
    CGColor(srgbRed: CGFloat((rgb >> 16) & 255) / 255,
            green: CGFloat((rgb >> 8) & 255) / 255,
            blue: CGFloat(rgb & 255) / 255, alpha: alpha)
}
let paper = color(0xf1eadd)
let ink = color(0x222c29)
let muted = color(0x51605a)
let accent = color(0xa93824)
let white = color(0xfff9ed)

func load(_ path: String) -> CGImage {
    let source = CGImageSourceCreateWithURL(root.appendingPathComponent(path) as CFURL, nil)!
    return CGImageSourceCreateImageAtIndex(source, 0, nil)!
}

let stops = zh
    ? [("bund", "上海 · 外滩"), ("yuyuan", "上海 · 豫园"), ("westlake", "杭州 · 西湖"), ("lingyin", "杭州 · 灵隐"), ("zhuozheng", "苏州 · 拙政园")]
    : [("goldengate", "Golden Gate Bridge"), ("lombard", "Lombard Street"), ("bixby", "Bixby Creek Bridge"), ("mcway", "McWay Falls"), ("santamonica", "Santa Monica Pier")]
let photos = stops.map { load("assets/photos/\($0.0).jpg") }
let icon = load("assets/brand/icon.png")

func box(_ x: CGFloat, _ y: CGFloat, _ w: CGFloat, _ h: CGFloat) -> CGRect {
    CGRect(x: x, y: CGFloat(height) - y - h, width: w, height: h)
}

func fill(_ c: CGContext, _ rect: CGRect, _ paint: CGColor, radius: CGFloat = 0) {
    c.setFillColor(paint)
    c.addPath(CGPath(roundedRect: rect, cornerWidth: radius, cornerHeight: radius, transform: nil))
    c.fillPath()
}
func image(_ c: CGContext, _ img: CGImage, _ rect: CGRect, radius: CGFloat = 0, zoom: CGFloat = 1) {
    c.saveGState()
    c.addPath(CGPath(roundedRect: rect, cornerWidth: radius, cornerHeight: radius, transform: nil))
    c.clip()
    let factor = max(rect.width / CGFloat(img.width), rect.height / CGFloat(img.height)) * zoom
    let w = CGFloat(img.width) * factor
    let h = CGFloat(img.height) * factor
    c.draw(img, in: CGRect(x: rect.midX - w / 2, y: rect.midY - h / 2, width: w, height: h))
    c.restoreGState()
}
func text(_ c: CGContext, _ s: String, _ x: CGFloat, _ y: CGFloat, _ size: CGFloat,
          _ paint: CGColor, serif: Bool = false, bold: Bool = false, center: Bool = false) {
    let font: CTFont
    if serif {
        font = CTFontCreateWithName((zh ? "STSongti-SC-Bold" : "Georgia-Bold") as CFString, size, nil)
    } else {
        let system = NSFont.systemFont(ofSize: size, weight: bold ? .semibold : .regular)
        font = CTFontCreateWithName(system.fontName as CFString, size, nil)
    }
    let attrs = [
        kCTFontAttributeName as String: font,
        kCTForegroundColorAttributeName as String: paint
    ] as CFDictionary
    let line = CTLineCreateWithAttributedString(CFAttributedStringCreate(nil, s as CFString, attrs))
    let metrics = CTLineGetTypographicBounds(line, nil, nil, nil)
    precondition(metrics <= 960, "Line too wide: \(s)")
    c.textPosition = CGPoint(x: center ? x - metrics / 2 : x, y: CGFloat(height) - y)
    CTLineDraw(line, c)
}
func title(_ c: CGContext, _ lines: [String], at y: CGFloat, size: CGFloat, centered: Bool = false, paint: CGColor = ink) {
    for (index, line) in lines.enumerated() {
        text(c, line, centered ? 540 : 82, y + CGFloat(index) * size * 1.13, size, paint, serif: true, center: centered)
    }
}
func line(_ c: CGContext, from a: CGPoint, to b: CGPoint, paint: CGColor, weight: CGFloat) {
    c.setStrokeColor(paint); c.setLineWidth(weight)
    c.move(to: CGPoint(x: a.x, y: CGFloat(height) - a.y))
    c.addLine(to: CGPoint(x: b.x, y: CGFloat(height) - b.y))
    c.strokePath()
}
func dot(_ c: CGContext, _ x: CGFloat, _ y: CGFloat, _ r: CGFloat, _ paint: CGColor) {
    c.setFillColor(paint); c.fillEllipse(in: box(x-r, y-r, r*2, r*2))
}
func tag(_ c: CGContext, _ label: String, at y: CGFloat, paint: CGColor = accent) {
    dot(c, 91, y - 12, 8, paint)
    text(c, label, 112, y, 34, paint, bold: true)
}
func grid(_ c: CGContext) {
    for x in stride(from: 24, to: width, by: 40) {
        for y in stride(from: 24, to: height, by: 40) {
            dot(c, CGFloat(x), CGFloat(y), 1.6, color(0x6d7361, 0.16))
        }
    }
}
func shade(_ c: CGContext, _ area: CGRect) {
    let colors = [color(0x162220, 0.88), color(0x162220, 0.0)] as CFArray
    let gradient = CGGradient(colorsSpace: space, colors: colors, locations: [0, 1])!
    c.saveGState()
    c.clip(to: area)
    c.drawLinearGradient(gradient, start: CGPoint(x: 0, y: area.minY),
                         end: CGPoint(x: 0, y: area.maxY), options: [])
    c.restoreGState()
}

let source = AVURLAsset(url: root.appendingPathComponent("assets/video/\(lang)-\(zh ? "sat" : "std").mp4"))
let track = source.tracks(withMediaType: .video).first!
let reader = try AVAssetReader(asset: source)
let stream = AVAssetReaderTrackOutput(track: track, outputSettings: [
    kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_32BGRA
])
stream.alwaysCopiesSampleData = false
reader.add(stream)
guard reader.startReading() else { fatalError("Could not read app recording: \(String(describing: reader.error))") }
let ci = CIContext(options: [.cacheIntermediates: false])
var nextSample = stream.copyNextSampleBuffer()
var currentFrame: CGImage?
func recording(at time: Double) -> CGImage {
    var sample: CMSampleBuffer?
    while let next = nextSample, CMSampleBufferGetPresentationTimeStamp(next).seconds <= time {
        sample = next
        nextSample = stream.copyNextSampleBuffer()
    }
    if let sample, let buffer = CMSampleBufferGetImageBuffer(sample) {
        let frame = CIImage(cvPixelBuffer: buffer)
        currentFrame = ci.createCGImage(frame, from: frame.extent)
    }
    return currentFrame!
}

func draw(_ c: CGContext, time: Double) {
    c.setFillColor(paper); c.fill(canvas)
    if time < 3.0 {
        let cuts = [0.0, 1.0, 2.0]
        let index = min(Int(time), 2)
        let photo = [0, 2, 4][index]
        let local = time - cuts[index]
        image(c, photos[photo], box(0, 0, 1080, 1120), zoom: 1 + local * 0.035)
        shade(c, box(0, 830, 1080, 290))
        line(c, from: CGPoint(x: 83, y: 1011), to: CGPoint(x: 997, y: 1011), paint: color(0xfff9ed, 0.48), weight: 2)
        for i in 0..<3 {
            dot(c, 92 + CGFloat(i) * 39, 1011, i == index ? 9 : 5, i == index ? white : color(0xfff9ed, 0.58))
        }
        text(c, stops[photo].1, 82, 1080, 41, white, bold: true)
        tag(c, zh ? "迹绎  /  TRACE" : "TRACE", at: 1240)
        title(c, zh ? ["把旅行照片，", "放回地图。"] : ["Put your trip", "back on the map."],
              at: 1380, size: zh ? 104 : 98)
        return
    }
    if time >= 8.3 && time < 12.3 {
        let index = time < 10.3 ? 2 : 3
        let local = time - (index == 2 ? 8.3 : 10.3)
        grid(c)
        tag(c, zh ? "按拍摄顺序" : "IN CAPTURE ORDER", at: 220)
        title(c, zh ? ["每一张，都是一站。"] : ["Every photo is a stop."], at: 344, size: zh ? 82 : 72)
        image(c, photos[index], box(82, 456, 916, 1040), radius: 18, zoom: 1 + CGFloat(local) * 0.028)
        line(c, from: CGPoint(x: 82, y: 1573), to: CGPoint(x: 998, y: 1573), paint: color(0xa93824, 0.43), weight: 2)
        dot(c, index == 2 ? 488 : 654, 1573, 9, accent)
        text(c, stops[index].1, 82, 1662, 44, ink, bold: true)
        return
    }
    if time < 19.8 {
        let local = time - 3.0
        let second = time >= 12.3
        // Trim the moments where the map tiles are still loading.
        let videoTime = second
            ? (zh ? 18.7 : 17.2) + (time - 12.3) * 0.70
            : (zh ? 0.45 : 0.15) + local * (zh ? 1.12 : 0.49)
        grid(c)
        tag(c, zh ? "真机画面" : "IN THE APP", at: 178)
        title(c, second
              ? (zh ? ["地图沿着照片移动。"] : ["Follow it on the map."])
              : (zh ? ["从第一张照片出发。"] : ["Start with the first photo."]),
              at: 294, size: zh ? 80 : (second ? 77 : 59))
        let frame = recording(at: videoTime)
        let area = box(205, 359, 670, 1456)
        c.saveGState()
        c.setShadow(offset: CGSize(width: 0, height: -17), blur: 29, color: color(0x17241d, 0.27))
        fill(c, area.insetBy(dx: -10, dy: -10), ink, radius: 57)
        c.restoreGState()
        image(c, frame, area, radius: 48)
        // A slim route line tracks the progression of this excerpt.
        line(c, from: CGPoint(x: 108, y: 524), to: CGPoint(x: 108, y: 1658), paint: color(0x6d7361, 0.28), weight: 3)
        let travel = CGFloat(local / 16.8)
        line(c, from: CGPoint(x: 108, y: 524), to: CGPoint(x: 108, y: 524 + 1134 * travel), paint: accent, weight: 3)
        dot(c, 108, 524 + 1134 * travel, 10, accent)
        return
    }
    grid(c)
    tag(c, zh ? "旅程回放" : "A TRIP TO KEEP", at: 218)
    title(c, zh ? ["把走过的路，", "再看一遍。"] : ["Revisit the trip,", "one photo at a time."],
          at: 367, size: zh ? 104 : 86)
    let start: CGFloat = 82, step: CGFloat = 187
    for i in 0..<5 {
        let x = start + step * CGFloat(i)
        let dt = time - 19.8 - 0.09 * Double(i)
        let offset = 25 * max(0, 1 - CGFloat(dt / 0.3))
        image(c, photos[i], box(x, 608 + offset, 168, 198), radius: 12)
        dot(c, x + 84, 856, 8, accent)
    }
    line(c, from: CGPoint(x: 166, y: 856), to: CGPoint(x: 914, y: 856), paint: color(0xa93824, 0.45), weight: 2)
    text(c, zh ? "上海 → 杭州 → 苏州" : "San Francisco to Santa Monica", 82, 939, 41, muted)
    image(c, icon, box(445, 1060, 190, 190), radius: 44)
    title(c, [zh ? "迹绎" : "Trace"], at: 1380, size: 107, centered: true)
    fill(c, box(292, 1440, 496, 104), ink, radius: 52)
    text(c, zh ? "前往 App Store" : "Get it on the App Store", 540, 1506, 38, white, bold: true, center: true)
    text(c, zh ? "适用于 iPhone 与 iPad" : "For iPhone and iPad", 540, 1628, 35, muted, center: true)
}

let silentURL = output.appendingPathComponent("silent-\(lang).mp4")
let writer = try AVAssetWriter(outputURL: silentURL, fileType: .mp4)
let input = AVAssetWriterInput(mediaType: .video, outputSettings: [
    AVVideoCodecKey: AVVideoCodecType.h264, AVVideoWidthKey: width, AVVideoHeightKey: height,
    AVVideoCompressionPropertiesKey: [AVVideoAverageBitRateKey: 9_000_000, AVVideoExpectedSourceFrameRateKey: fps]
])
let pixelFormat = kCVPixelFormatType_32BGRA
let adaptor = AVAssetWriterInputPixelBufferAdaptor(assetWriterInput: input, sourcePixelBufferAttributes: [
    kCVPixelBufferPixelFormatTypeKey as String: pixelFormat, kCVPixelBufferWidthKey as String: width,
    kCVPixelBufferHeightKey as String: height, kCVPixelBufferCGImageCompatibilityKey as String: true,
    kCVPixelBufferCGBitmapContextCompatibilityKey as String: true
])
writer.add(input)
guard writer.startWriting() else { fatalError("Could not start encoder: \(String(describing: writer.error))") }
writer.startSession(atSourceTime: .zero)
let frames = Int(duration * Double(fps))
for i in 0..<frames {
    while !input.isReadyForMoreMediaData {
        guard writer.status == .writing else { fatalError("Encoder stopped: \(String(describing: writer.error))") }
        Thread.sleep(forTimeInterval: 0.004)
    }
    autoreleasepool {
        var px: CVPixelBuffer?
        let result = CVPixelBufferPoolCreatePixelBuffer(nil, adaptor.pixelBufferPool!, &px)
        precondition(result == kCVReturnSuccess)
        let buffer = px!
        CVPixelBufferLockBaseAddress(buffer, [])
        let c = CGContext(data: CVPixelBufferGetBaseAddress(buffer), width: width, height: height,
                          bitsPerComponent: 8, bytesPerRow: CVPixelBufferGetBytesPerRow(buffer),
                          space: space, bitmapInfo: CGImageAlphaInfo.noneSkipFirst.rawValue | CGBitmapInfo.byteOrder32Little.rawValue)!
        c.interpolationQuality = .high
        draw(c, time: Double(i) / Double(fps))
        if [20, 141, 365, 658].contains(i) {
            let name = i == 20 ? "poster-\(lang).jpg" : "proof-\(lang)-\(i).jpg"
            let dest = CGImageDestinationCreateWithURL(output.appendingPathComponent(name) as CFURL, "public.jpeg" as CFString, 1, nil)!
            CGImageDestinationAddImage(dest, c.makeImage()!, [kCGImageDestinationLossyCompressionQuality: 0.88] as CFDictionary)
            CGImageDestinationFinalize(dest)
        }
        CVPixelBufferUnlockBaseAddress(buffer, [])
        precondition(adaptor.append(buffer, withPresentationTime: CMTime(value: Int64(i), timescale: fps)), "Frame \(i) failed")
    }
}
input.markAsFinished()
writer.endSession(atSourceTime: CMTime(value: Int64(frames), timescale: fps))
let finished = DispatchSemaphore(value: 0)
writer.finishWriting { finished.signal() }
finished.wait()
guard writer.status == .completed else { fatalError("Encoder failed: \(String(describing: writer.error))") }
