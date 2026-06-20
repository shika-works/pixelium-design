---
slice-title: Formatter
title-level: 2
---

[[[zh
组件支持基于正则表达式匹配的时间格式化模板，可通过下列模板字符解析时间字符串中的各个部分。

| 模板   | 匹配规则      | 说明                                                        |
| ------ | ------------- | ----------------------------------------------------------- |
| `YYYY` | `(-?\d{4,6})` | 年份，支持 4 至 6 位数字，可包含负号（如公元前）                |
| `YY`   | `(\d{2})`     | 年份的后两位数字                                            |
| `MM`   | `(\d{2})`     | 月份，两位数字（01-12）                                     |
| `DD`   | `(\d{2})`     | 日期，两位数字（01-31）                                     |
| `HH`   | `(\d{2})`     | 小时（24小时制），两位数字（00-23）                         |
| `hh`   | `(\d{2})`     | 小时（12小时制），两位数字（01-12）                         |
| `mm`   | `(\d{2})`     | 分钟，两位数字（00-59）                                     |
| `ss`   | `(\d{2})`     | 秒钟，两位数字（00-59）                                     |
| `SSS`  | `(\d{3})`     | 毫秒，三位数字（000-999）                                   |
| `A`    | `(AM\|PM)`   | 上下午标记，大写 AM 或 PM                                   |
| `ww`   | `(\d{2})`     | 周数，一年中的第几周，两位数字（01-53，遵循 ISO 周历规则）  |
| `Q`    | `(\d{1})`     | 季度，一位数字（1-4）                                       |

`[]` 中括号中的文本会被提取出来原样保留，例如 `YYYY-[Q]Q` 可以生成 2026-Q1，中括号中的 Q 被原样保留。

周的计算方式遵循 ISO 8601 标准，一周的开始是周一，每年的第一周是包含该年第一个周四的那一周。
]]]

[[[en
The component supports time formatting templates based on regular expression matching. The following template tokens can be used to parse various parts of a time string.

| Token  | Regex Pattern | Description                                                                      |
| ------ | ------------- | -------------------------------------------------------------------------------- |
| `YYYY` | `(-?\d{4,6})` | Year, supports 4 to 6 digits, may include a minus sign (e.g., for BC)            |
| `YY`   | `(\d{2})`     | Last two digits of the year                                                      |
| `MM`   | `(\d{2})`     | Month, two digits (01-12)                                                        |
| `DD`   | `(\d{2})`     | Day of month, two digits (01-31)                                                 |
| `HH`   | `(\d{2})`     | Hour (24-hour clock), two digits (00-23)                                         |
| `hh`   | `(\d{2})`     | Hour (12-hour clock), two digits (01-12)                                         |
| `mm`   | `(\d{2})`     | Minute, two digits (00-59)                                                       |
| `ss`   | `(\d{2})`     | Second, two digits (00-59)                                                       |
| `SSS`  | `(\d{3})`     | Millisecond, three digits (000-999)                                              |
| `A`    | `(AM\|PM)`   | AM/PM marker, uppercase AM or PM                                                 |
| `ww`   | `(\d{2})`     | Week number, week of the year, two digits (01-53, following ISO week date rules) |
| `Q`    | `(\d{1})`     | Quarter, one digit (1-4)                                                         |

Text enclosed in square brackets `[]` will be extracted and preserved as-is. For example, `YYYY-[Q]Q` produces `2026-Q1`, where the `Q` inside brackets remains literal.

Week calculation follows the ISO 8601 standard: the week starts on Monday, and the first week of the year is the week that contains the first Thursday of that year.
]]]
