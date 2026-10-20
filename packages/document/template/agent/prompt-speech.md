[[[zh
# 提示词语音输入 PromptSpeech

Prompt 的语音输入由内置语音模块驱动，`speechConfig` 负责配置，PromptSpeechTrigger 负责开关，PromptSpeechPanel 负责录制面板。
]]]
[[[en
# PromptSpeech

The speech input of Prompt is powered by the built-in speech module; `speechConfig` configures it, PromptSpeechTrigger toggles the recording and PromptSpeechPanel renders the recording panel.
]]]

[[[zh
## 基础使用

给 Prompt 传入 `speechConfig` 后，在工具栏中放置 PromptSpeechTrigger 即可开始录音。`mode` 为 `'click'` 时点击开始，面板的确认入口提交、取消入口放弃；为 `'hold'` 时按住面板说话，松开后自动提交。识别结果会写入 Prompt 的输入内容。

> 浏览器内置语音识别可能存在兼容性问题和对网络环境有要求。
]]]
[[[en
## Basic Usage

Pass `speechConfig` to Prompt and place PromptSpeechTrigger in the toolbar to start recording. With `mode` set to `'click'`, click the trigger to start, then submit with the confirm entry or discard with the cancel entry of the panel; with `'hold'`, the panel records while it is pressed and submits on release. The recognition result is written into the input content of Prompt.

> Built-in browser speech recognition may have compatibility issues and require a suitable network environment.
]]]

<preview path="./prompt-speech-basic.vue"></preview>

[[[zh
## 自定义识别

`customRecognize` 用于接管内置的语音识别，你可以接入自己的语音识别模型，或者直接把音频交给服务器处理。

下面的例子通过 Transformers.js 在浏览器本地运行 Whisper tiny 模型，对录音做本地转写；模型和运行时在页面加载时从 CDN 下载（首次合计约 45MB 流量，之后使用浏览器缓存），音频不会离开浏览器。

示例把 `acceptTimeout` 设为 `-1`，由自定义识别在转写完成后调用 `end()`。
]]]
[[[en
## Custom Recognition

`customRecognize` is used to take over the built-in speech recognition. You can plug in your own speech recognition model, or send the audio directly to a server for processing.

The following example uses Transformers.js to run the Whisper tiny model locally in the browser and perform local transcription of the recording. The model and runtime are downloaded from a CDN when the page loads (about 45 MB of traffic on the first load; afterwards they are served from the browser cache), and the audio never leaves the browser.

The example sets `acceptTimeout` to `-1`, and the custom recognizer calls `end()` after transcription is complete.
]]]

<preview path="./prompt-speech-custom.vue"></preview>

## API
[[[api prompt-speech-trigger zh
slots.trigger: 语音开关区域，替换内置的按钮。
slots.icon: 语音开关的图标。
]]]
[[[api prompt-speech-trigger en
slots.trigger: The speech toggle area, replacing the internal button.
slots.icon: The icon of the speech toggle.
]]]

[[[api prompt-speech-panel zh
slots.cancel: 语音录制面板的取消入口。
slots.visualizer: 语音录制面板的波形区域。
slots.text: 语音识别的实时文本区域。
slots.accept: 语音录制面板的确认入口。
]]]
[[[api prompt-speech-panel en
slots.cancel: The cancel entry of the speech recording panel.
slots.visualizer: The visualizer area of the speech recording panel.
slots.text: The live text area of the speech recognition.
slots.accept: The confirm entry of the speech recording panel.
]]]

[[[zh
`PromptSpeechConfig` 是 `speechConfig` 的类型，包含以下属性与嵌套配置类型。
]]]
[[[en
`PromptSpeechConfig` is the type of `speechConfig`, covering the following properties and nested configuration types.
]]]

[[[api prompt-speech-provider zh
minHz: 频谱分析的最低频率。
maxHz: 频谱分析的最高频率。
minDb: 映射为最小高度的分贝值。
maxDb: 映射为最大高度的分贝值。
smoothing: 频谱变化的平滑系数。
fftSize: 频谱分析使用的采样窗口大小。

count: 波形柱的数量。
minHeight: 波形柱的最小高度。
maxHeight: 波形柱的最大高度。

mode: 语音识别的交互方式。
lang: 浏览器内置语音识别的语言设置，取值为 BCP 47 语言标签，合法值见 <a href="https&#58;//developer.mozilla.org/en-US/docs/Glossary/BCP_47_language_tag">BCP 47 语言标签</a>。
barConfig: 波形柱的配置。
spectrumConfig: 音频频谱的配置。
customRecognize: 自定义的识别过程，接管内置的语音识别。
acceptTimeout: 确认录制后等待识别结果的最长时间。

promptSpeechScope.mode: 当前的语音交互方式。
promptSpeechScope.recording: 是否处于录音会话中。
promptSpeechScope.live: 是否正在实时录音；按住模式下未按下时为 false。
promptSpeechScope.committing: 是否已确认录音并等待识别结果。
promptSpeechScope.disabled: 语音输入是否不可用。
promptSpeechScope.supported: 浏览器是否支持内置语音识别。
promptSpeechScope.text: 当前的识别文本。
promptSpeechScope.pending: 识别文本是否为未定稿的临时结果。
promptSpeechScope.levels: 波形柱的实时电平，取值 0 到 1。
promptSpeechScope.source: 波形电平的来源。`microphone` 表示来自麦克风的实时频谱，`simulated` 表示由动画模拟生成的电平，`null` 表示没有电平来源。
promptSpeechScope.barConfig: 实际生效的波形柱配置，已应用默认值。
promptSpeechScope.enter: 开始录音。
promptSpeechScope.cancel: 放弃本次录音。
promptSpeechScope.accept: 确认录音并提交识别结果。
promptSpeechScope.press: 按住模式下按下。
promptSpeechScope.release: 按住模式下松开。
]]]
[[[api prompt-speech-provider en
minHz: The lowest frequency of the spectrum analysis.
maxHz: The highest frequency of the spectrum analysis.
minDb: The decibel value mapped to the minimum height.
maxDb: The decibel value mapped to the maximum height.
smoothing: The smoothing factor of the spectrum changes.
fftSize: The sampling window size used by the spectrum analysis.

count: The number of the visualizer bars.
minHeight: The minimum height of the visualizer bars.
maxHeight: The maximum height of the visualizer bars.

mode: The interaction mode of the speech recognition.
lang: The language setting of the built-in browser speech recognition, given as a BCP 47 language tag. See <a href="https&#58;//developer.mozilla.org/en-US/docs/Glossary/BCP_47_language_tag">BCP 47 language tag</a> for the valid values.
barConfig: The configuration of the visualizer bars.
spectrumConfig: The configuration of the audio spectrum.
customRecognize: The custom recognition process, taking over the internal speech recognition.
acceptTimeout: The longest waiting time for the recognition result after the recording is confirmed.

promptSpeechScope.mode: The current speech interaction mode.
promptSpeechScope.recording: Whether a recording session is active.
promptSpeechScope.live: Whether the recording is live; false in hold mode before it is pressed.
promptSpeechScope.committing: Whether the recording is confirmed and the recognition result is pending.
promptSpeechScope.disabled: Whether the speech input is unavailable.
promptSpeechScope.supported: Whether the browser supports the built-in speech recognition.
promptSpeechScope.text: The current transcript.
promptSpeechScope.pending: Whether the transcript is a pending interim result.
promptSpeechScope.levels: The live levels of the visualizer bars, from 0 to 1.
promptSpeechScope.source: The source of the bar levels. `microphone` means the levels come from the live microphone spectrum, `simulated` means the levels are generated by the animation, and `null` means there is no level source.
promptSpeechScope.barConfig: The effective bar configuration after defaults are applied.
promptSpeechScope.enter: Starts recording.
promptSpeechScope.cancel: Discards the current recording.
promptSpeechScope.accept: Confirms the recording and submits the recognition result.
promptSpeechScope.press: Handles the press in hold mode.
promptSpeechScope.release: Handles the release in hold mode.
]]]

```ts
export type PromptSpeechScope = {
	mode: PromptSpeechMode
	recording: boolean
	live: boolean
	committing: boolean
	disabled: boolean
	supported: boolean
	text: string
	pending: boolean
	levels: number[]
	source: 'microphone' | 'simulated' | null
	barConfig: Required<PromptSpeechBarConfig>
	enter: () => void
	cancel: () => void
	accept: () => void
	press: () => void
	release: () => void
}
```

### PromptSpeechMode

```ts
export type PromptSpeechMode = 'click' | 'hold'
```

### CustomRecognizeOptions

```ts
export interface CustomRecognizeOptions {
	stream: MediaStream | null
	audio: () => Promise<Blob | null>
	setText: (text: string, final?: boolean) => void
	end: () => void
	onAccept: (handler: () => void) => void
	onClose: (handler: (committed: boolean) => void) => void
}

export type CustomRecognize = (options: CustomRecognizeOptions) => void
```

