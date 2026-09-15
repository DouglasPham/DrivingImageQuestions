mod scenes;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            scenes::save_scene,
            scenes::load_scene,
            scenes::list_scenes
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
