<?php

namespace App\Services;

use App\Models\Setting;

class ThemeService
{
    /** Default base color when no theme is set (gold #cfaa08). */
    public const DEFAULT_PRIMARY = '#cfaa08';

    /**
     * Tailwind shade keys mapped to a mix ratio.
     * Positive = mix with white (tint), negative = mix with black (shade), 0 = base (600).
     */
    private const SHADES = [
        50 => 0.92,
        100 => 0.82,
        200 => 0.64,
        300 => 0.46,
        400 => 0.26,
        500 => 0.12,
        600 => 0.0,
        700 => -0.18,
        800 => -0.34,
        900 => -0.48,
        950 => -0.66,
    ];

    /**
     * Get the configured primary base hex (or default).
     */
    public function primaryHex(): string
    {
        $hex = Setting::get('theme_primary', self::DEFAULT_PRIMARY);

        return self::isValidHex($hex) ? strtolower($hex) : self::DEFAULT_PRIMARY;
    }

    /**
     * Build the full shade palette as RGB triplet strings keyed by shade.
     *
     * @return array<int,string> e.g. [50 => '253 250 230', ...]
     */
    public function palette(?string $hex = null): array
    {
        $hex ??= $this->primaryHex();
        [$r, $g, $b] = self::hexToRgb($hex);

        $palette = [];
        foreach (self::SHADES as $shade => $ratio) {
            if ($ratio > 0) {
                $mr = (int) round($r + (255 - $r) * $ratio);
                $mg = (int) round($g + (255 - $g) * $ratio);
                $mb = (int) round($b + (255 - $b) * $ratio);
            } elseif ($ratio < 0) {
                $f = 1 + $ratio; // ratio negative -> darken factor
                $mr = (int) round($r * $f);
                $mg = (int) round($g * $f);
                $mb = (int) round($b * $f);
            } else {
                [$mr, $mg, $mb] = [$r, $g, $b];
            }
            $palette[$shade] = "{$mr} {$mg} {$mb}";
        }

        return $palette;
    }

    /**
     * Render the palette as a `:root { --color-primary-NNN: r g b; }` CSS block.
     */
    public function cssVars(?string $hex = null): string
    {
        $lines = [];
        foreach ($this->palette($hex) as $shade => $triplet) {
            $lines[] = "--color-primary-{$shade}: {$triplet};";
        }

        return ':root{'.implode('', $lines).'}';
    }

    public static function isValidHex(?string $hex): bool
    {
        return is_string($hex) && preg_match('/^#?[0-9a-fA-F]{6}$/', $hex) === 1;
    }

    /**
     * @return array{0:int,1:int,2:int}
     */
    public static function hexToRgb(string $hex): array
    {
        $hex = ltrim($hex, '#');

        return [
            (int) hexdec(substr($hex, 0, 2)),
            (int) hexdec(substr($hex, 2, 2)),
            (int) hexdec(substr($hex, 4, 2)),
        ];
    }
}
