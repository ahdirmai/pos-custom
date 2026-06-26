<?php

namespace Tests\Feature\Settings;

use App\Models\Setting;
use App\Models\User;
use App\Services\ThemeService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Permission;
use Tests\TestCase;

class ThemeTest extends TestCase
{
    use RefreshDatabase;

    private function admin(): User
    {
        Permission::firstOrCreate(['name' => 'dashboard-access', 'guard_name' => 'web']);
        $user = User::factory()->create();
        $user->givePermissionTo('dashboard-access');

        return $user;
    }

    public function test_theme_defaults_to_gold_when_unset(): void
    {
        $this->assertSame(ThemeService::DEFAULT_PRIMARY, app(ThemeService::class)->primaryHex());
    }

    public function test_palette_generates_eleven_shades(): void
    {
        $palette = app(ThemeService::class)->palette('#4f46e5');

        $this->assertCount(11, $palette);
        $this->assertArrayHasKey(50, $palette);
        $this->assertArrayHasKey(950, $palette);
        // base shade 600 equals the input rgb
        $this->assertSame('79 70 229', $palette[600]);
    }

    public function test_update_theme_persists_setting(): void
    {
        $response = $this->actingAs($this->admin())
            ->post(route('settings.theme.update'), ['theme_primary' => '#4F46E5']);

        $response->assertRedirect();
        $this->assertSame('#4f46e5', Setting::get('theme_primary'));
        $this->assertSame('#4f46e5', app(ThemeService::class)->primaryHex());
    }

    public function test_update_theme_rejects_invalid_hex(): void
    {
        $response = $this->actingAs($this->admin())
            ->from(route('settings.theme'))
            ->post(route('settings.theme.update'), ['theme_primary' => 'notacolor']);

        $response->assertSessionHasErrors('theme_primary');
        $this->assertNull(Setting::get('theme_primary'));
    }

    public function test_css_vars_block_contains_all_shades(): void
    {
        $css = app(ThemeService::class)->cssVars('#cfaa08');

        $this->assertStringContainsString('--color-primary-50:', $css);
        $this->assertStringContainsString('--color-primary-950:', $css);
        $this->assertStringStartsWith(':root{', $css);
    }
}
