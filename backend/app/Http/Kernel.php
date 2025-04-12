protected $middlewareGroups = [
    // ... existing middleware groups ...

    'api' => [
        \App\Http\Middleware\ForceJsonResponse::class,
        // ... other api middleware
    ],
];
