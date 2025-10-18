use std::fs;

use tauri::Emitter;

#[tauri::command]
pub fn init(handler: tauri::AppHandle) {
	let args: Vec<String> = std::env::args().collect();
	if args.len() > 1 {
		let file_path = args[1].clone();
		println!("Opening file from command line: {}", file_path);
		let _ = handler.emit("open-file", &file_path);
	}
}

#[tauri::command]
pub fn read_file(path: String) -> Option<String> {
	match fs::read_to_string(path) {
		Ok(content) => {
			println!("File read successfully.");
			Some(content)
		},
		Err(_) => None,
	}
}

#[tauri::command]
pub fn write_file(path: String, content: String) -> bool {
	match fs::write(path, content) {
		Ok(_) => {
			println!("File written successfully.");
			true
		},
		Err(_) => false,
	}
}
