use tauri::menu::{CheckMenuItemBuilder, MenuBuilder, MenuItem, SubmenuBuilder};
use tauri::App;

// 菜单初始化
pub fn init_menu(app: &App) -> Result<(), Box<dyn std::error::Error>> {
    let check_sub_item_en = CheckMenuItemBuilder::with_id("en", "EN")
        .checked(true)
        .build(app)?;

    let check_sub_item_zh = CheckMenuItemBuilder::with_id("zh", "ZH")
        .checked(false)
        .build(app)?;

    let text_menu = MenuItem::with_id(
        app,
        "menu1_about",
        &"关于".to_string(),
        true,
        Some("Ctrl+Z"),
    )
    .unwrap();

    let menu_item = SubmenuBuilder::new(app, "自定义菜单示例")
        .item(&text_menu)
        .items(&[&check_sub_item_en, &check_sub_item_zh])
        .build()?;
    let menu = MenuBuilder::new(app).items(&[&menu_item]).build()?;

    app.set_menu(menu).expect("TODO: panic message");

    // 注册菜单事件处理
    app.on_menu_event(
        move |_app_handle: &tauri::AppHandle, event| match event.id().0.as_str() {
            "menu1_about" => {}

            "en" | "zh" => {
                check_sub_item_en
                    .set_checked(event.id().0.as_str() == "en")
                    .expect("Change check error");
                check_sub_item_zh
                    .set_checked(event.id().0.as_str() == "zh")
                    .expect("Change check error");
                check_sub_item_zh
                    .set_accelerator(Some("Ctrl+L"))
                    .expect("Change accelerator error");
            }
            _ => {
                println!("unexpected menu event");
            }
        },
    );

    Ok(())
}
