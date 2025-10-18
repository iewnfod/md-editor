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
import {ListKit} from "@tiptap/extension-list";
import {toast} from "react-toastify";
import Image from "@tiptap/extension-image";

const extensions = [
    TextStyleKit,
    Table.configure({
        resizable: true,
    }),
    TableRow,
    CustomTableHeader,
    CustomTableCell,
    ListKit,
    StarterKit.configure({
        codeBlock: false,
        bulletList: false,
        orderedList: false,
        listItem: false,
        listKeymap: false,
    }),
    Mathematics,
    CodeBlock.configure({
        languageClassPrefix: "language-",
        enableTabIndentation: true,
    }),
    Image.configure({
        inline: true,
        allowBase64: true
    })
];

export default function MdView({
    fp,
    setFp,
    saved,
    setSaved
}: {
    fp: string,
    setFp: (fp: string) => void,
    saved: boolean,
    setSaved: (saved: boolean) => void
}) {
    const editor = useEditor({
        extensions,
        content: "",
        onCreate: ({editor}) => {
            migrateMathStrings(editor);
        },
        onUpdate: () => {
            console.log("update");
            setSaved(false);
        }
    });

    useEffect(() => {
        invoke("init").then(() => {
            console.log("Initialized");
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
                handleSave(md, fp, setFp, setSaved).then();
            }
        }
    };

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [fp, setFp]);

    useEffect(() => {
        if (!fp) {
            return;
        }
        toast(`File path changed: ${fp}`);
        invoke("read_file", {path: fp}).then((content) => {
            if (typeof content === "string") {
                invoke("md2html", {value: content}).then((data) => {
                    if (typeof data === "string") {
                        data = solveMdHtml(data);
                        editor.commands.setContent(data as string);
                    }
                });
            }
        });
    }, [fp]);

    return (
        <EditorContent editor={editor} className="tiptap"/>
    );
}
