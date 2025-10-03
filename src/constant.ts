export const EXAMPLE_MARKDOWN = `
# 一级标题

## 二级标题

这是一个普通段落，包含**粗体**、*斜体*、~~删除线~~、\`行内代码\`、$E = mc^2$ 行内数学公式。

> 这是一个块引用
> 包含多行内容
> 
> > 嵌套块引用

- 无序列表项 1
- 无序列表项 2
  - 嵌套列表项
- [ ] 未完成任务
- [x] 已完成任务

1. 有序列表项 1
2. 有序列表项 2
   1. 嵌套有序列表

这是一个脚注引用[^1]，这是另一个脚注引用[^footnote]。

[^1]: 第一个脚注定义
[^footnote]: 第二个脚注定义
    可以包含多行内容

这是一个[普通链接](https://example.com "标题文本")和一个[引用式链接][link1]。

这是一个![普通图片](image.jpg "图片标题")和一个![引用式图片][img1]。

[link1]: https://example.com "链接标题"
[img1]: image.jpg "图片标题"

| 左对齐 | 居中对齐 | 右对齐 |
|:-------|:--------:|-------:|
| 单元格1 | 单元格2  | 单元格3 |
| 单元格4 | 单元格5  | 单元格6 |

| 无align:列1 | Title with new line<br/>newline | Center Align:left:列3 |
|-----|-----:|:-----:|
| 数据1 | Table cell with new line<br/>数据2 | 数据3 |

\`\`\`python
# 代码块
def hello():
    print("Hello, World!")
\`\`\`

$$
f(x) = \\int_{-\\infty}^{\\infty} \\hat f(\\xi)\\,e^{2 \\pi i \\xi x} \\,d\\xi
$$

***

水平分割线

这是最后一段内容，包含一个[简写链接]和![简写图片]。

[简写链接]: https://example.com
[简写图片]: image.jpg
`
