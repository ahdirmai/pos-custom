# 🎨 Tema Dinamis (Warna Dasar)

Fitur mengatur **warna dasar (primary)** dashboard & toko dari satu setting. Semua kelas `primary-*` (50–950) ikut berubah.

## Cara Pakai

**Pengaturan → Tema Warna** (`/dashboard/settings/theme`):
- Pilih **preset** (Gold, Indigo, Emerald, Rose, Sky, Violet, Orange, Slate), atau
- **Warna kustom** lewat color picker / input hex.
- Pratinjau langsung (live preview) + gradasi shade 50→950.
- **Simpan Tema**.

## Cara Kerja

1. Tailwind `primary.*` dipetakan ke CSS variable: `rgb(var(--color-primary-NNN) / <alpha-value>)` (`tailwind.config.js`).
2. Nilai default tersimpan di `resources/css/design-tokens.css` (gold `#cfaa08`).
3. `ThemeService` membuat 11 shade (tint/shade mixing) dari 1 warna dasar.
4. Setting `theme_primary` (hex) disimpan via `Setting::set`.
5. `app.blade.php` menyuntik `<style>:root{--color-primary-*}</style>` dari `ThemeService::cssVars()` → override default saat load.

## Arsitektur

| Komponen | Path |
|---|---|
| Generator shade | `app/Services/ThemeService.php` |
| Controller | `SettingController@theme`, `@updateTheme` |
| Halaman | `resources/js/Pages/Dashboard/Settings/Theme.jsx` |
| Inject CSS var | `resources/views/app.blade.php` |
| Shared prop | `themePrimary` di `HandleInertiaRequests` |

## Routes

| Method | URI | Name | Permission |
|---|---|---|---|
| GET | `/dashboard/settings/theme` | `settings.theme` | `dashboard-access` |
| POST | `/dashboard/settings/theme` | `settings.theme.update` | `dashboard-access` |

## Catatan
- Scope: dashboard **dan** toko pelanggan (keduanya pakai `primary-*` + blade head sama).
- Cukup `Setting::set('theme_primary', '#hex')` untuk ubah programatik.
- Test: `tests/Feature/Settings/ThemeTest.php`.
