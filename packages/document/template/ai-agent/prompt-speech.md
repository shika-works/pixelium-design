[[[zh
# 提示词语音输入 PromptSpeech

Prompt 的语音输入由 PromptSpeechProvider 驱动，PromptSpeechTrigger 负责开关，PromptSpeechPanel 负责录制面板，三者配合 `speechConfig` 使用。
]]]
[[[en
# PromptSpeech

The speech input of Prompt is driven by PromptSpeechProvider, switched by PromptSpeechTrigger and recorded by PromptSpeechPanel; the three work with `speechConfig`.
]]]

[[[zh
## 基础使用

给 Prompt 传入 `speechConfig` 后，在工具栏中放置 PromptSpeechTrigger 即可开始录音。`mode` 为 `'click'` 时点击开始，面板的确认入口提交、取消入口放弃；为 `'hold'` 时按住面板说话，松开后自动提交。识别结果会写入 Prompt 的输入内容。
]]]
[[[en
## Basic Usage

Pass `speechConfig` to Prompt and place PromptSpeechTrigger in the toolbar to start recording. With `mode` set to `'click'`, click the trigger to start, then submit with the confirm entry or discard with the cancel entry of the panel; with `'hold'`, the panel records while it is pressed and submits on release. The recognition result is written into the input content of Prompt.
]]]

<preview path="./prompt-speech-basic.vue"></preview>

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
lang: 语音识别的语言。
barConfig: 波形柱的配置。
spectrumConfig: 音频频谱的配置。
customRecognize: 自定义的识别过程，接管内置的语音识别。
acceptTimeout: 确认录制后等待识别结果的最长时间。

events.update:recording: 录制状态变化时触发。
events.update:live: 实时录制状态变化时触发。
events.accept: 识别结果被确认时触发。

slots.default: PromptSpeechProvider 的内容。
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
lang: The language of the speech recognition.
barConfig: The configuration of the visualizer bars.
spectrumConfig: The configuration of the audio spectrum.
customRecognize: The custom recognition process, taking over the internal speech recognition.
acceptTimeout: The longest waiting time for the recognition result after the recording is confirmed.

events.update:recording: Triggered when the recording state changes.
events.update:live: Triggered when the live recording state changes.
events.accept: Triggered when a recognition result is confirmed.

slots.default: The content of PromptSpeechProvider.
]]]

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

### PromptSpeechPanelScope

```ts
export type PromptSpeechPanelScope = {
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
