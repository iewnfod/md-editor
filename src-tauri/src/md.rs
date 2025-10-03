#[tauri::command]
pub fn md2html(value: String) -> Option<String> {
    let mut options = markdown::ParseOptions::gfm();
    options.math_text_single_dollar = true;
    options.constructs.math_flow = true;
    options.constructs.math_text = true;
    // options.constructs.html_flow = true;
    options.constructs.html_text = true;
    let mut opt = markdown::Options::default();
    opt.parse = options;
    opt.compile.allow_any_img_src = true;
    if let Ok(html) = markdown::to_html_with_options(&value, &opt) {
        Some(html)
    } else {
        None
    }
}

#[tauri::command]
pub fn html2md(value: String) -> Option<String> {
    if let Ok(md) = htmd::convert(&value) {
        Some(md)
    } else {
        None
    }
}
