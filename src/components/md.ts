import {save} from "@tauri-apps/plugin-dialog";
import {toast} from "react-toastify";
import {invoke} from "@tauri-apps/api/core";

function getTextContent(html: string) {
    const dom = document.createElement("div");
    dom.innerHTML = html;
    return dom.innerText;
}

export function solveMdHtml(data: string) {
    data = data.replaceAll(/<pre><code class="language-math math-display">[\s\S]*?<\/code><\/pre>/g, (match) => {
        const formula = getTextContent(match);
        return `<div data-type="block-math" data-latex="${formula}"></div>`;
    });
    data = data.replaceAll(/<code class="language-math math-inline">[\s\S]*?<\/code>/g, (match) => {
        const formula = getTextContent(match);
        return `<span data-type="inline-math" data-latex="${formula}"></span>`;
    });
    data = data.replaceAll('&lt;', '<');
    data = data.replaceAll('&gt;', '>');
    data = data.replaceAll('&amp;', '&');

    return data;
}

export async function handleSave(md: string, path: string, setPath: (path: string) => void, setSaved: (saved: boolean) => void) {
    console.log("Saving file...");

    try {
        if (md) {
            let p = "";
            if (path) {
                p = path;
            } else {
                p = await save({
                    filters: [
                        {
                            name: 'Markdown',
                            extensions: ['md']
                        }
                    ]
                }) || "";
            }
            if (p) {
                const success = await invoke("write_file", {path: p, content: md});
                if (success) {
                    setPath(p);
                    console.log("File saved to", p);
                    toast.success("File saved to " + p);
                    setSaved(true);
                }
            } else {
                console.log("Save cancelled");
                toast.error("Save cancelled");
            }
        }
    } catch (e) {
        console.error("Failed to save file:", e);
        toast.error("Failed to save file: " + e);
    }
}
