import {TableCell, TableHeader} from "@tiptap/extension-table";

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
