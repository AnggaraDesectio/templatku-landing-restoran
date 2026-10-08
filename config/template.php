<?php

// Di-generate oleh php artisan template:zip - hanya berisi flavor "landing-restoran".
// Ganti brand/warna di bawah, atau set TEMPLATE_FLAVOR di .env.

return [
    'flavor' => env('TEMPLATE_FLAVOR', 'landing-restoran'),

    'flavors' => array (
  'landing-restoran' => 
  array (
    'label' => 'WARUNG NUSANTARA — Restoran',
    'brand_name' => 'WARUNG NUSANTARA',
    'brand_tagline' => 'Cita rasa Nusantara, satu meja penuh',
    'brand_initials' => 'WN',
    'accent' => '#ca8a04',
    'category' => 'kuliner',
    'home' => 'landings.restoran',
    'nav' => 
    array (
      'sections' => 
      array (
        0 => 
        array (
          'label' => 'Menu',
          'items' => 
          array (
            0 => 
            array (
              'label' => 'Landing',
              'to' => '/landings/restoran',
              'icon' => 'Home',
            ),
            1 => 
            array (
              'label' => 'Dashboard',
              'to' => '/dashboard',
              'icon' => 'LayoutDashboard',
            ),
            2 => 
            array (
              'label' => 'Pengaturan',
              'to' => '/settings',
              'icon' => 'Settings',
            ),
          ),
        ),
      ),
    ),
  ),
),
];
