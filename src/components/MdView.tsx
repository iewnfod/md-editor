import "./MdStyles.css";
import "katex/dist/katex.min.css";

import {useEffect} from "react";
import {invoke} from "@tauri-apps/api/core";
import {EXAMPLE_MARKDOWN} from "../constant.ts";
import {EditorContent, useEditor} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {TextStyleKit} from "@tiptap/extension-text-style";
import {Table, TableRow} from "@tiptap/extension-table";
import CodeBlock from "@tiptap/extension-code-block";
import Mathematics, {migrateMathStrings} from "@tiptap/extension-mathematics";
import {handleSave, solveMdHtml} from "./md.ts";
import {renderToMarkdown} from "@tiptap/static-renderer/pm/markdown";
import {
    CustomTableCell,
    CustomTableHeader,
    renderTable,
    renderTableCell,
    renderTableHeader
} from "../extensions/CustomTable.ts";

const extensions = [
    TextStyleKit,
    Table.configure({
        resizable: true,
    }),
    TableRow,
    CustomTableHeader,
    CustomTableCell,
    StarterKit.configure({
        codeBlock: false
    }),
    Mathematics,
    CodeBlock,
];

export default function MdView({
    fp,
    setFp
}: {
    fp: string,
    setFp: (fp: string) => void
}) {
    const editor = useEditor({
        extensions,
        content: "",
        onCreate: ({editor}) => {
            migrateMathStrings(editor);
        },
    });

    useEffect(() => {
        invoke("md2html", {value: EXAMPLE_MARKDOWN}).then((data) => {
            if (data && typeof data === "string") {
                data = solveMdHtml(data);
                console.log(data);
                editor.commands.setContent(data as string);
            }
        });
    }, []);

    const handleKeyDown = (event: KeyboardEvent) => {
        if (event.repeat) {
            return;
        }

        if ((event.ctrlKey || event.metaKey) && event.key === 's') {
            event.preventDefault();
            if (editor) {
                console.log(editor.getJSON());
                const md = renderToMarkdown({
                    content: editor.getJSON(),
                    extensions: extensions,
                    options: {
                        nodeMapping: {
                            blockMath: ({node}) => `$$\n${node.attrs.latex.trim()}\n$$`,
                            inlineMath: ({node}) => `$${node.attrs.latex.trim()}$`,
                            table: ({children}) => renderTable({children: children || []}),
                            // @ts-ignore
                            tableHeader: ({node, children}) => renderTableHeader({node, children}),
                            tableCell: ({children}) => renderTableCell({children}),
                        }
                    }
                });
                console.log(md);
                handleSave(md, fp, setFp).then();
            }
        }
    };

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [fp, setFp]);

    return (
        <EditorContent editor={editor} className="tiptap"/>
    );
}
