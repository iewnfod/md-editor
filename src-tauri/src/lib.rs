use crate::md::*;
use crate::init::*;
use tauri_plugin_prevent_default::Flags;

mod md;
mod init;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let prevent = tauri_plugin_prevent_default::Builder::new()
        .with_flags(Flags::PRINT | Flags::CONTEXT_MENU | Flags::RELOAD)
        .build();

    tauri::Builder::default()
        .plugin(prevent)
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            init,
            read_file,
            write_file,
            md2html,
            html2md
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
