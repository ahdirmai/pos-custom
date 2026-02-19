<?php

use App\Http\Controllers\Admin\VoucherController;
use App\Http\Controllers\Apps\CategoryController;
use App\Http\Controllers\Apps\CustomerController;
use App\Http\Controllers\Apps\PaymentSettingController;
use App\Http\Controllers\Apps\ProductController;
use App\Http\Controllers\Apps\TransactionController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Reports\PphReportController;
use App\Http\Controllers\Reports\ProfitReportController;
use App\Http\Controllers\Reports\SalesReportController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect()->route('user.index');
    // return Inertia::render('Welcome', [
    //     'canLogin'       => Route::has('login'),
    //     'canRegister'    => Route::has('register'),
    //     'laravelVersion' => Application::VERSION,
    //     'phpVersion'     => PHP_VERSION,
    // ]);
});

Route::get('/dashboard/access', function () {
    return Inertia::render('Dashboard/Access');
})->middleware(['auth'])->name('dashboard.access');

// Public share routes (no login)
Route::get('/share/transactions/{invoice}', [\App\Http\Controllers\DocumentController::class, 'publicInvoice'])
    ->name('transactions.public');

Route::group(['prefix' => 'dashboard', 'middleware' => ['auth']], function () {
    Route::get('/', [DashboardController::class, 'index'])->middleware(['auth', 'verified', 'permission:dashboard-access'])->name('dashboard');
    Route::get('/permissions', [PermissionController::class, 'index'])->middleware('permission:permissions-access')->name('permissions.index');
    // roles route
    Route::resource('/roles', RoleController::class)
        ->except(['create', 'edit', 'show'])
        ->middlewareFor('index', 'permission:roles-access')
        ->middlewareFor('store', 'permission:roles-create')
        ->middlewareFor('update', 'permission:roles-update')
        ->middlewareFor('destroy', 'permission:roles-delete');
    // users route
    Route::resource('/users', UserController::class)
        ->except('show')
        ->middlewareFor('index', 'permission:users-access')
        ->middlewareFor(['create', 'store'], 'permission:users-create')
        ->middlewareFor(['edit', 'update'], 'permission:users-update')
        ->middlewareFor('destroy', 'permission:users-delete');
    Route::post('/notifications/read', [NotificationController::class, 'markAsRead'])->name('notifications.read');
    Route::post('/notifications/read-all', [NotificationController::class, 'markAllAsRead'])->name('notifications.readAll');
    Route::get('/regions/regencies', [\App\Http\Controllers\RegionController::class, 'regencies'])->name('regions.regencies');
    Route::get('/regions/districts', [\App\Http\Controllers\RegionController::class, 'districts'])->name('regions.districts');
    Route::get('/regions/villages', [\App\Http\Controllers\RegionController::class, 'villages'])->name('regions.villages');

    Route::resource('categories', CategoryController::class)
        ->middlewareFor(['index', 'show'], 'permission:categories-access')
        ->middlewareFor(['create', 'store'], 'permission:categories-create')
        ->middlewareFor(['edit', 'update'], 'permission:categories-edit')
        ->middlewareFor('destroy', 'permission:categories-delete');
    Route::resource('products', ProductController::class)
        ->middlewareFor(['index', 'show'], 'permission:products-access')
        ->middlewareFor(['create', 'store'], 'permission:products-create')
        ->middlewareFor(['edit', 'update'], 'permission:products-edit')
        ->middlewareFor('destroy', 'permission:products-delete');
    Route::resource('customers', CustomerController::class)
        ->middlewareFor(['index', 'show'], 'permission:customers-access')
        ->middlewareFor(['create', 'store'], 'permission:customers-create')
        ->middlewareFor(['edit', 'update'], 'permission:customers-edit')
        ->middlewareFor('destroy', 'permission:customers-delete');

    // route customer history
    Route::get('/customers/{customer}/history', [CustomerController::class, 'getHistory'])->middleware('permission:transactions-access')->name('customers.history');

    // route customer store via AJAX (no redirect)
    Route::post('/customers/store-ajax', [CustomerController::class, 'storeAjax'])->middleware('permission:customers-create')->name('customers.storeAjax');

    // route transaction
    Route::get('/transactions', [TransactionController::class, 'index'])->middleware('permission:transactions-access')->name('transactions.index');
    
    // route online orders (admin)
    Route::get('/transactions/orders', [TransactionController::class, 'orders'])->middleware('permission:transactions-access')->name('transactions.orders');
    Route::patch('/transactions/{transaction}/status', [TransactionController::class, 'updateStatus'])->middleware('permission:transactions-access')->name('transactions.updateStatus');
    Route::patch('/transactions/{transaction}/resi', [TransactionController::class, 'updateResi'])->middleware('permission:transactions-access')->name('transactions.updateResi');

    // route transaction searchProduct
    Route::post('/transactions/searchProduct', [TransactionController::class, 'searchProduct'])->middleware('permission:transactions-access')->name('transactions.searchProduct');

    // route transaction addToCart
    Route::post('/transactions/addToCart', [TransactionController::class, 'addToCart'])->middleware('permission:transactions-access')->name('transactions.addToCart');

    // route transaction destroyCart
    Route::delete('/transactions/{cart_id}/destroyCart', [TransactionController::class, 'destroyCart'])->middleware('permission:transactions-access')->name('transactions.destroyCart');

    // route transaction updateCart
    Route::patch('/transactions/{cart_id}/updateCart', [TransactionController::class, 'updateCart'])->middleware('permission:transactions-access')->name('transactions.updateCart');

    // route hold transaction
    Route::post('/transactions/hold', [TransactionController::class, 'holdCart'])->middleware('permission:transactions-access')->name('transactions.hold');
    Route::post('/transactions/{holdId}/resume', [TransactionController::class, 'resumeCart'])->middleware('permission:transactions-access')->name('transactions.resume');
    Route::delete('/transactions/{holdId}/clearHold', [TransactionController::class, 'clearHold'])->middleware('permission:transactions-access')->name('transactions.clearHold');
    Route::get('/transactions/held', [TransactionController::class, 'getHeldCarts'])->middleware('permission:transactions-access')->name('transactions.held');

    // route transaction store
    Route::post('/transactions/store', [TransactionController::class, 'store'])->middleware('permission:transactions-access')->name('transactions.store');
    Route::get('/transactions/{invoice}/print', [TransactionController::class, 'print'])->middleware('permission:transactions-access')->name('transactions.print');
    Route::post('/transactions/check-voucher', [TransactionController::class, 'checkVoucher'])->middleware('permission:transactions-access')->name('transactions.checkVoucher');
    Route::get('/transactions-history', [TransactionController::class, 'history'])->middleware('permission:transactions-access')->name('transactions.history');
    // receivables (nota barang)
    Route::get('/receivables', [\App\Http\Controllers\Apps\ReceivableController::class, 'index'])->middleware('permission:receivables-access')->name('receivables.index');
    Route::get('/receivables/{receivable}', [\App\Http\Controllers\Apps\ReceivableController::class, 'show'])->middleware('permission:receivables-access')->name('receivables.show');
    Route::post('/receivables/{receivable}/pay', [\App\Http\Controllers\Apps\ReceivableController::class, 'pay'])->middleware('permission:receivables-pay')->name('receivables.pay');
    // suppliers & payables
    Route::get('/suppliers', [\App\Http\Controllers\Apps\SupplierController::class, 'index'])->middleware('permission:suppliers-access')->name('suppliers.index');
    Route::post('/suppliers', [\App\Http\Controllers\Apps\SupplierController::class, 'store'])->middleware('permission:suppliers-access')->name('suppliers.store');
    Route::put('/suppliers/{supplier}', [\App\Http\Controllers\Apps\SupplierController::class, 'update'])->middleware('permission:suppliers-access')->name('suppliers.update');
    Route::delete('/suppliers/{supplier}', [\App\Http\Controllers\Apps\SupplierController::class, 'destroy'])->middleware('permission:suppliers-access')->name('suppliers.destroy');
    Route::get('/payables', [\App\Http\Controllers\Apps\PayableController::class, 'index'])->middleware('permission:payables-access')->name('payables.index');
    Route::post('/payables', [\App\Http\Controllers\Apps\PayableController::class, 'store'])->middleware('permission:payables-access')->name('payables.store');
    Route::put('/payables/{payable}', [\App\Http\Controllers\Apps\PayableController::class, 'update'])->middleware('permission:payables-access')->name('payables.update');
    Route::get('/payables/{payable}', [\App\Http\Controllers\Apps\PayableController::class, 'show'])->middleware('permission:payables-access')->name('payables.show');
    Route::post('/payables/{payable}/pay', [\App\Http\Controllers\Apps\PayableController::class, 'pay'])->middleware('permission:payables-pay')->name('payables.pay');

    // vouchers
    Route::resource('vouchers', VoucherController::class);

    // shipping couriers
    Route::resource('shipping-couriers', \App\Http\Controllers\Apps\ShippingCourierController::class);
    Route::patch('/shipping-couriers/{shippingCourier}/toggle', [\App\Http\Controllers\Apps\ShippingCourierController::class, 'toggleActive'])->middleware('permission:dashboard-access')->name('shipping-couriers.toggle');

    // blog management
    Route::resource('blog-categories', \App\Http\Controllers\Apps\BlogCategoryController::class, ['as' => 'apps'])
        ->middleware('permission:dashboard-access');
    Route::resource('blog-tags', \App\Http\Controllers\Apps\BlogTagController::class, ['as' => 'apps'])
        ->middleware('permission:dashboard-access');
    Route::resource('blog-posts', \App\Http\Controllers\Apps\BlogPostController::class, ['as' => 'apps'])
        ->middleware('permission:dashboard-access');

    // banners
    Route::resource('banners', \App\Http\Controllers\Apps\BannerController::class)
        ->middlewareFor(['index', 'show'], 'permission:dashboard-access')
        ->middlewareFor(['create', 'store'], 'permission:dashboard-access')
        ->middlewareFor(['edit', 'update'], 'permission:dashboard-access')
        ->middlewareFor('destroy', 'permission:dashboard-access');

    // pdf documents
    Route::resource('shipping-couriers', \App\Http\Controllers\Apps\ShippingCourierController::class);
    Route::patch('/shipping-couriers/{shippingCourier}/toggle', [\App\Http\Controllers\Apps\ShippingCourierController::class, 'toggleActive'])->middleware('permission:dashboard-access')->name('shipping-couriers.toggle');

    // reviews moderation (per product)
    Route::get('/products/{product}/reviews', [\App\Http\Controllers\Apps\ReviewController::class, 'index'])->middleware('permission:dashboard-access')->name('products.reviews');
    Route::patch('/reviews/{review}/toggle', [\App\Http\Controllers\Apps\ReviewController::class, 'toggleVisibility'])->middleware('permission:dashboard-access')->name('reviews.toggle');
    Route::delete('/reviews/{review}', [\App\Http\Controllers\Apps\ReviewController::class, 'destroy'])->middleware('permission:dashboard-access')->name('reviews.destroy');

    // pdf documents
    Route::get('/documents/transactions/{invoice}/pdf/invoice', [\App\Http\Controllers\DocumentController::class, 'invoice'])->middleware('permission:transactions-access')->name('pdf.transactions.invoice');
    Route::get('/documents/transactions/{invoice}/pdf/receipt/{size?}', [\App\Http\Controllers\DocumentController::class, 'receipt'])->middleware('permission:transactions-access')->name('pdf.transactions.receipt');
    Route::get('/documents/transactions/{invoice}/pdf/shipping', [\App\Http\Controllers\DocumentController::class, 'shipping'])->middleware('permission:transactions-access')->name('pdf.transactions.shipping');
    Route::get('/documents/receivables/{receivable}/pdf', [\App\Http\Controllers\DocumentController::class, 'receivable'])->middleware('permission:receivables-access')->name('pdf.receivables.show');
    Route::get('/documents/payables/{payable}/pdf', [\App\Http\Controllers\DocumentController::class, 'payable'])->middleware('permission:payables-access')->name('pdf.payables.show');

    Route::get('/settings/payments', [PaymentSettingController::class, 'edit'])->middleware('permission:payment-settings-access')->name('settings.payments.edit');
    Route::put('/settings/payments', [PaymentSettingController::class, 'update'])->middleware('permission:payment-settings-access')->name('settings.payments.update');

    // settings target penjualan
    Route::get('/settings/target', [\App\Http\Controllers\Apps\SettingController::class, 'target'])->middleware('permission:dashboard-access')->name('settings.target');
    Route::post('/settings/target', [\App\Http\Controllers\Apps\SettingController::class, 'updateTarget'])->middleware('permission:dashboard-access')->name('settings.target.update');
    Route::get('/settings/store', [\App\Http\Controllers\Apps\SettingController::class, 'storeProfile'])->middleware('permission:dashboard-access')->name('settings.store');
    Route::post('/settings/store', [\App\Http\Controllers\Apps\SettingController::class, 'updateStoreProfile'])->middleware('permission:dashboard-access')->name('settings.store.update');
    Route::get('/settings/shipping', [\App\Http\Controllers\Apps\SettingController::class, 'shipping'])->middleware('permission:dashboard-access')->name('settings.shipping');
    Route::post('/settings/shipping', [\App\Http\Controllers\Apps\SettingController::class, 'updateShipping'])->middleware('permission:dashboard-access')->name('settings.shipping.update');

    // shipping testing (cek ongkir)
    Route::get('/settings/shipping/test', [\App\Http\Controllers\Apps\ShippingController::class, 'test'])->middleware('permission:dashboard-access')->name('settings.shipping.test');
    Route::post('/settings/shipping/check-rates', [\App\Http\Controllers\Apps\ShippingController::class, 'checkRates'])->middleware('permission:dashboard-access')->name('settings.shipping.check-rates');

    // settings bank accounts
    Route::get('/settings/bank-accounts', [\App\Http\Controllers\Apps\BankAccountController::class, 'index'])->middleware('permission:payment-settings-access')->name('settings.bank-accounts.index');
    Route::get('/settings/bank-accounts/create', [\App\Http\Controllers\Apps\BankAccountController::class, 'create'])->middleware('permission:payment-settings-access')->name('settings.bank-accounts.create');
    Route::post('/settings/bank-accounts', [\App\Http\Controllers\Apps\BankAccountController::class, 'store'])->middleware('permission:payment-settings-access')->name('settings.bank-accounts.store');
    Route::get('/settings/bank-accounts/{bankAccount}/edit', [\App\Http\Controllers\Apps\BankAccountController::class, 'edit'])->middleware('permission:payment-settings-access')->name('settings.bank-accounts.edit');
    Route::put('/settings/bank-accounts/{bankAccount}', [\App\Http\Controllers\Apps\BankAccountController::class, 'update'])->middleware('permission:payment-settings-access')->name('settings.bank-accounts.update');
    Route::delete('/settings/bank-accounts/{bankAccount}', [\App\Http\Controllers\Apps\BankAccountController::class, 'destroy'])->middleware('permission:payment-settings-access')->name('settings.bank-accounts.destroy');
    Route::patch('/settings/bank-accounts/{bankAccount}/toggle', [\App\Http\Controllers\Apps\BankAccountController::class, 'toggleActive'])->middleware('permission:payment-settings-access')->name('settings.bank-accounts.toggle');
    Route::post('/settings/bank-accounts/order', [\App\Http\Controllers\Apps\BankAccountController::class, 'updateOrder'])->middleware('permission:payment-settings-access')->name('settings.bank-accounts.order');

    // confirm payment for bank transfer
    Route::patch('/transactions/{transaction}/confirm-payment', [TransactionController::class, 'confirmPayment'])->middleware('permission:transactions-access')->name('transactions.confirm-payment');

    // reports
    Route::get('/reports/sales', [SalesReportController::class, 'index'])->middleware('permission:reports-access')->name('reports.sales.index');
    Route::get('/reports/profits', [ProfitReportController::class, 'index'])->middleware('permission:profits-access')->name('reports.profits.index');
    Route::get('/reports/pph23', [PphReportController::class, 'index'])->middleware('permission:reports-access')->name('reports.pph23.index');
    Route::get('/reports/pph23/export/pdf', [\App\Http\Controllers\DocumentController::class, 'pphPdf'])->middleware('permission:reports-access')->name('reports.pph23.export.pdf');
    Route::get('/reports/pph23/export/excel', [PphReportController::class, 'exportExcel'])->middleware('permission:reports-access')->name('reports.pph23.export.excel');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// end user page (customer) public
Route::name('user.')->group(function () {
    Route::get('/', [\App\Http\Controllers\User\HomeController::class, 'index'])->name('index');
    Route::get('/products', [\App\Http\Controllers\User\ProductController::class, 'index'])->name('products');
    Route::get('/search', [\App\Http\Controllers\User\ProductController::class, 'search'])->name('search');
    Route::get('/articles', [\App\Http\Controllers\User\HomeController::class, 'articles'])->name('articles');
    // Article Detail
    Route::get('/article/{slug}', [\App\Http\Controllers\User\HomeController::class, 'articleShow'])->name('article.show');
    Route::get('/product/{slug}', [\App\Http\Controllers\User\ProductController::class, 'show'])->name('product.show');
});

// end user page (customer) protected
Route::middleware(['auth'])->name('user.')->group(function () {
    // Checkout
    Route::match(['get', 'post'], '/checkout', [\App\Http\Controllers\User\CheckoutController::class, 'index'])->name('checkout');
    Route::post('/checkout/store', [\App\Http\Controllers\User\CheckoutController::class, 'store'])->name('checkout.store');
    Route::post('/checkout/check-rates', [\App\Http\Controllers\User\CheckoutController::class, 'checkRates'])->name('checkout.check-rates');
    Route::post('/checkout/check-voucher', [\App\Http\Controllers\User\CheckoutController::class, 'checkVoucher'])->name('checkout.check-voucher');

    // Orders
    Route::get('/pesanan', [\App\Http\Controllers\User\OrderController::class, 'index'])->name('orders.index');
    Route::post('/pesanan/{id}/complete', [\App\Http\Controllers\User\OrderController::class, 'complete'])->name('orders.complete');
    Route::post('/pesanan/{id}/review', [\App\Http\Controllers\User\OrderController::class, 'storeReview'])->name('orders.review');
    Route::post('/pesanan/{id}/bulk-review', [\App\Http\Controllers\User\OrderController::class, 'storeBulkReview'])->name('orders.bulk-review');
    Route::get('/nota/{id}', [\App\Http\Controllers\User\OrderController::class, 'show'])->name('invoice');

    // Cart
    Route::post('/cart', [\App\Http\Controllers\User\CartController::class, 'store'])->name('cart.store');
    Route::delete('/cart/{id}', [\App\Http\Controllers\User\CartController::class, 'destroy'])->name('cart.destroy');
    Route::patch('/cart/{id}', [\App\Http\Controllers\User\CartController::class, 'update'])->name('cart.update');

    // Addresses
    Route::post('/addresses', [\App\Http\Controllers\User\AddressController::class, 'store'])->name('addresses.store');
    Route::put('/addresses/{id}', [\App\Http\Controllers\User\AddressController::class, 'update'])->name('addresses.update');
    Route::delete('/addresses/{id}', [\App\Http\Controllers\User\AddressController::class, 'destroy'])->name('addresses.destroy');
    Route::post('/addresses/{id}/set-primary', [\App\Http\Controllers\User\AddressController::class, 'setPrimary'])->name('addresses.setPrimary');

    // Payment Proof Upload
    Route::post('/orders/{id}/upload-payment-proof', [\App\Http\Controllers\User\PaymentProofController::class, 'upload'])->name('orders.upload-payment-proof');

    Route::get('/profile', [\App\Http\Controllers\User\ProfileController::class, 'index'])->name('profile');
});

require __DIR__.'/auth.php';
