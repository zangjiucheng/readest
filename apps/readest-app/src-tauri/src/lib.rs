#[cfg(target_os = "macos")]
#[macro_use]
extern crate cocoa;

#[cfg(target_os = "macos")]
#[macro_use]
extern crate objc;

#[cfg(target_os = "macos")]
mod tauri_traffic_light_positioner_plugin;

#[cfg(target_os = "macos")]
use {
    tauri::menu::{SubmenuBuilder, HELP_SUBMENU_ID},
    tauri::TitleBarStyle,
    tauri_plugin_shell::ShellExt,
};

use tauri::{WebviewUrl, WebviewWindowBuilder};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let builder = tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init());

    #[cfg(target_os = "macos")]
    let builder = builder.plugin(tauri_traffic_light_positioner_plugin::init());

    builder
        .setup(|app| {
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }
            let win_builder = WebviewWindowBuilder::new(app, "main", WebviewUrl::default())
                .title("")
                .inner_size(800.0, 600.0)
                .resizable(true)
                .maximized(true);

            #[cfg(target_os = "macos")]
            let win_builder = win_builder
                .decorations(true)
                .title_bar_style(TitleBarStyle::Overlay);

            #[cfg(not(target_os = "macos"))]
            let win_builder = win_builder.decorations(false).transparent(true);

            let _ = win_builder.build().unwrap();

            #[cfg(target_os = "macos")]
            {
                let global_menu = app.menu().unwrap();
                if let Some(item) = global_menu.get(HELP_SUBMENU_ID) {
                    let _ = global_menu.remove(&item);
                }
                let _ = global_menu.append(
                    &SubmenuBuilder::new(app, "Help")
                        .text("privacy_policy", "Privacy Policy")
                        .separator()
                        .text("report_issue", "Report An Issue...")
                        .text("readest_help", "Readest Help")
                        .build()?,
                );

                app.on_menu_event(move |app, event| {
                    if event.id() == "privacy_policy" {
                        let _ = app.shell().open("https://readest.com/privacy-policy", None);
                    } else if event.id() == "report_issue" {
                        let _ = app.shell().open("mailto:support@bilingify.com", None);
                    } else if event.id() == "readest_help" {
                        let _ = app.shell().open("https://readest.com/support", None);
                    }
                });
            }

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
