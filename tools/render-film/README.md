# 迹绎新版宣传片源文件

在 macOS 上从宣传仓库根目录运行下列命令。请为每次导出使用新的临时目录。

```sh
trace_out=$(mktemp -d)
swiftc -O tools/render-film/render.swift -o "$trace_out/render"
swiftc -O tools/render-film/mux.swift -o "$trace_out/mux"
"$trace_out/render" "$PWD" "$trace_out" zh
"$trace_out/render" "$PWD" "$trace_out" en
python3 tools/render-film/score.py "$trace_out/score.wav"
"$trace_out/mux" "$trace_out"
```

输出的 `trace-replay-zh.mp4`、`trace-replay-en.mp4` 和封面可复制到 `film/` 更新预览页。录屏和旅行照片取自本仓库的 `assets`。
