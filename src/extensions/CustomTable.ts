import {TableCell, TableHeader} from "@tiptap/extension-table";
import {Node} from "@tiptap/react";

export const CustomTableCell = TableCell.extend({
    addAttributes() {
        return {
            ...this.parent?.(),
            align: {
                default: "left",
                // @ts-ignore
                parseHTML: (element) => element.align,
                renderHTML: (attributes) => {
                    return {
                        align: attributes.align,
                        style: `text-align: ${attributes.align}`
                    };
                },
            },
        };
    },
});

export const CustomTableHeader = TableHeader.extend({
    addAttributes() {
        return {
            ...this.parent?.(),
            align: {
                default: "left",
                // @ts-ignore
                parseHTML: (element) => element.align,
                renderHTML: (attributes) => {
                    return {
                        align: attributes.align,
                        style: `text-align: ${attributes.align}`
                    };
                },
            },
        };
    },
});

function children2Text(children: string | string[] | undefined) {
    let content = "";
    if (children) {
        if (typeof children === "string") {
            content = children.trim();
        } else {
            const c = children.map(x => x.trim());
            content = c.join("<br/>");
        }
    }
    content = content.replaceAll('\n', '<br/>');
    return content.trim();
}

export function renderTableHeader({node, children} : {node: Node, children: string | string[] | undefined}) {
    // @ts-ignore
    const align = node.attrs.align || "";
    let content = children2Text(children);
    return `${content}:${align}`;
}

export function renderTableCell({children} : {children: string | string[] | undefined}) {
    return children2Text(children);
}

export function renderTable({children} : { children: string | string[] }) {
    if (children.length > 0) {
        const thData = children[0].toString().trim();
        const thCells = thData.split("|").map((x) => x.trim());
        const dividers: string[] = [];
        const thContents: string[] = [];
        thCells.forEach((x) => {
            if (x) {
                const data = x.split(':');
                const align = data[data.length-1];
                const content = data.slice(0, -1).join(':').trim();
                switch (align) {
                    case "left":
                        dividers.push(":---");
                        break;
                    case "right":
                        dividers.push("---:");
                        break;
                    case "center":
                        dividers.push(":---:");
                        break;
                    default:
                        dividers.push("---");
                        break;
                }
                thContents.push(content);
            }
        });
        const th = "| " + thContents.join(" | ") + " |";
        const dividerRow = "| " + dividers.join(" | ") + " |";
        const rows = [...children].slice(1).map(r => r.toString().trim());
        return "\n" + th + "\n" + dividerRow + "\n" + rows.join("\n") + "\n";
    } else {
        return "";
    }
}
