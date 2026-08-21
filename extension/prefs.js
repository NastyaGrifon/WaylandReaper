import Adw from 'gi://Adw';
import Gio from 'gi://Gio';
import Gtk from 'gi://Gtk';
import {ExtensionPreferences, gettext as _}
    from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';

/* WaylandReaper prefs — AI GENERATED CODE (Monika / Hermes Agent for
 * Nastya Grifon). Review before use. GPL-2.0-or-later.
 *
 * Two hotkey slots (Super Q / Alt F4 toggles) + editable whitelist
 * with a preset of session-critical processes. All bindings live-apply.
 */

const WHITELIST_PRESET_INFO = {
    'gnome-shell': 'Сама сессия GNOME Shell — убьёт весь рабочий стол',
    'ddterm': 'Терминал ddterm (расширение, выпадающий терминал)',
    'yakuake': 'Терминал yakuake (выпадающий Quake-style)',
    'guake': 'Терминал guake (выпадающий)',
    'kitty': 'Основной терминал kitty — чтобы Super+Q в нём не убил сессию',
    'alacritty': 'Терминал alacritty',
};

export default class WaylandReaperPreferences extends ExtensionPreferences {
    fillPreferencesWindow(window) {
        const settings = this.getSettings();

        // ── Page ──
        const page = new Adw.PreferencesPage({
            title: _('WaylandReaper'),
            icon_name: 'process-stop-symbolic',
        });
        window.add(page);

        // ── Group: hotkeys ──
        const keysGroup = new Adw.PreferencesGroup({
            title: _('Горячие клавиши убийства'),
            description: _('Каждый переключатель включает или отключает свою комбинацию'),
        });
        page.add(keysGroup);

        const keyDefs = [
            ['kill-focused-window', '<Super>q', 'Super + Q'],
            ['kill-focused-window-alt', '<Alt>F4', 'Alt + F4'],
        ];

        this._keyRows = [];
        for (const [keyName, accel, label] of keyDefs) {
            const switchRow = new Adw.SwitchRow({
                title: label,
                subtitle: `GSettings: ${this._schemaId}.${keyName}`,
            });
            // Reflect whether the binding currently has any accelerator
            const current = settings.get_strv(keyName);
            switchRow.active = current.length > 0;
            // Toggling writes/removes the accelerator; the combo stays fixed
            switchRow.connect('notify::active', row => {
                if (row.active)
                    settings.set_strv(keyName, [accel]);
                else
                    settings.set_strv(keyName, []);
            });
            keysGroup.add(switchRow);
            this._keyRows.push(switchRow);
        }

        // ── Group: whitelist ──
        const wlGroup = new Adw.PreferencesGroup({
            title: _('Whitelist — процессы, которые нельзя убивать'),
            description: _('Точное совпадение имени из /proc/PID/comm'),
        });
        page.add(wlGroup);

        this._wlList = settings.get_strv('whitelist');

        // Entry row to add new process names
        const entryRow = new Adw.EntryRow({title: _('Добавить имя процесса')});
        const addBtn = new Gtk.Button({
            icon_name: 'list-add-symbolic',
            valign: Gtk.Align.CENTER,
            css_classes: ['flat'],
            sensitive: false,
        });
        entryRow.add_suffix(addBtn);
        entryRow.connect('notify::text', row => {
            addBtn.sensitive = row.text.trim().length > 0;
        });
        addBtn.connect('clicked', () => {
            const name = entryRow.text.trim();
            if (name && !this._wlList.includes(name)) {
                this._wlList.push(name);
                settings.set_strv('whitelist', this._wlList);
                this._addWhitelistRow(wlGroup, name);
            }
            entryRow.set_text('');
            addBtn.sensitive = false;
        });
        wlGroup.add(entryRow);

        // One removable row per whitelisted process
        for (const name of [...this._wlList])
            this._addWhitelistRow(wlGroup, name);

        // ── Group: timing ──
        const graceGroup = new Adw.PreferencesGroup({title: _('Тайминги')});
        page.add(graceGroup);

        const graceSpin = new Adw.SpinRow({
            title: _('SIGTERM grace period'),
            subtitle: _('Сколько ждать между SIGTERM и SIGKILL (мс)'),
            adjustment: new Gtk.Adjustment({
                lower: 100, upper: 5000,
                step_increment: 100, page_increment: 500,
                value: settings.get_int('grace-period-ms'),
            }),
        });
        settings.bind('grace-period-ms', graceSpin, 'value',
            Gio.SettingsBindFlags.DEFAULT);
        graceGroup.add(graceSpin);

        // ── Group: behaviour ──
        const behGroup = new Adw.PreferencesGroup({
            title: _('Поведение'),
        });
        page.add(behGroup);

        const notifySwitch = new Adw.SwitchRow({
            title: _('Показывать уведомления'),
            subtitle: _('Сообщение при каждом убийстве/пропуске. Ошибки пишутся в журнал независимо от этой настройки.'),
            active: settings.get_boolean('show-notifications'),
        });
        settings.bind('show-notifications', notifySwitch, 'active',
            Gio.SettingsBindFlags.DEFAULT);
        behGroup.add(notifySwitch);
    }

    _addWhitelistRow(group, name) {
        const note = WHITELIST_PRESET_INFO[name];
        const row = new Adw.ActionRow({
            title: name,
            subtitle: note ? `пресет: ${note}` : null,
        });
        const delBtn = new Gtk.Button({
            icon_name: 'user-trash-symbolic',
            valign: Gtk.Align.CENTER,
            css_classes: ['flat', 'destructive-action'],
            tooltip_text: _('Убрать из whitelist'),
        });
        delBtn.connect('clicked', () => {
            this._wlList = this._wlList.filter(n => n !== name);
            this.getSettings().set_strv('whitelist', this._wlList);
            group.remove(row);
        });
        row.add_suffix(delBtn);
        group.add(row);
    }
}
