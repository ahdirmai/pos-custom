<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register', [
            'store_name' => \App\Models\Setting::where('key', 'store_name')->first()?->value,
            'store_logo' => \App\Models\Setting::where('key', 'store_logo')->first()?->value,
        ]);
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:' . User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

  
        try {
            \DB::beginTransaction();

            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
            ]);

            // Assign 'customer' role to new user
            if (Role::where('name', 'customer')->exists()) {
                $user->assignRole('customer');
            }

            // Create customer record for the new user
            \App\Models\Customer::create([
                'user_id' => $user->id,
                'name' => $request->name,
                // 'email' => $request->email,
                'no_telp' => null, // Can be updated later in profile
                'address' => null, // Can be updated later in profile
            ]);

            event(new Registered($user));

            \DB::commit();

            Auth::login($user);

            return redirect('/');
        } catch (\Exception $e) {
            \DB::rollBack();

            return back()->withErrors([
                'email' => 'Terjadi kesalahan saat mendaftar. Silakan coba lagi.' . $e->getMessage(),
            ])->withInput($request->except('password', 'password_confirmation'));
        }
    }
}
