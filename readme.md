# panel

[![Deploy](https://github.com/bgord/panel/actions/workflows/deploy-server.yml/badge.svg)](https://github.com/bgord/panel/actions/workflows/deploy-server.yml)

[![Healthcheck](https://github.com/bgord/panel/actions/workflows/healthcheck.yml/badge.svg)](https://github.com/bgord/panel/actions/workflows/healthcheck.yml)

[Check status](https://bgord.github.io/statuses/history/panel)

## Configuration:

Clone the repository

```
git clone git@github.com:bgord/panel.git --recurse-submodules
```

Install packages

```
bun i
```

Create env files

```
cp .env.example .env.local
cp .env.example .env.test
```

Start the app

```
./bgord-scripts/server-start-local.sh
```

Run the tests

```
./bgord-scripts/test.sh
```

Generate production master key

Master key fils hould include 64 hex characters

```
bun run bgord-scripts/secrets-encrypt.ts --master-key /run/master-key.txt --input /project/path/.env.production --output /project/path/infra/secrets.enc
```

## Domain:

```
modules/
├── languages.ts
├── panel
│   ├── command-handlers
│   │   ├── handleGeneratePanelCommand.ts
│   ├── commands
│   │   ├── GENERATE_PANEL_COMMAND.ts
│   ├── job-handlers
│   │   ├── generate-panel-job.handler.ts
│   ├── jobs
│   │   ├── GENERATE_PANEL_JOB.ts
│   ├── ports
│   │   ├── panel-template-generator.ts
│   │   └── weather-provider.ts
│   ├── services
│   │   ├── generate-panel-scheduler.ts
│   │   └── panel-template.ts
│   └── value-objects
│       ├── panel-height.ts
│       ├── panel-key.ts
│       ├── panel-location.ts
│       ├── panel-mime-registry.ts
│       └── panel-width.ts
└── supported-languages.ts
```

## App:

```
app/
├── http
│   ├── error-handler.ts
│   └── panel
│       ├── get-panel.ts
```

## Infra:

```
infra/
├── adapters
│   ├── panel
│   │   ├── panel-template-generator.adapter.ts
│   │   ├── weather-provider-open-meteo.adapter.ts
│   │   ├── weather-provider.adapter.ts
│   │   └── wmo-codes.ts
│   └── system
│       ├── certificate-inspector.adapter.ts
│       ├── clock.adapter.ts
│       ├── disk-space-checker.adapter.ts
│       ├── file-cleaner.adapter.ts
│       ├── file-inspection.adapter.ts
│       ├── file-reader-json.adapter.ts
│       ├── file-reader-text.adapter.ts
│       ├── file-renamer.adapter.ts
│       ├── file-writer.adapter.ts
│       ├── hash-file.adapter.ts
│       ├── id-provider.adapter.ts
│       ├── image-generator.adapter.ts
│       ├── image-grayscale.adapter.ts
│       ├── image-processor.adapter.ts
│       ├── logger.adapter.ts
│       ├── remote-file-storage.adapter.ts
│       ├── sleeper.adapter.ts
│       ├── temporary-file.adapter.ts
│       ├── timekeeper.adapter.ts
│       ├── timeout-runner.adapter.ts
│       └── tmp
│           ├── 1778842860007.png
│           ├── 1778843040005.png
│           ├── 1778843100002.png
│           ├── 1778843160008.png
│           ├── 1778843219999.png
│           ├── 1778843340014.png
│           ├── 1778843400007.png
│           ├── 1778843460002.png
│           ├── 1778843520006.png
│           ├── 1778843580003.png
│           ├── 1778844120016.png
│           ├── 1778844480012.png
│           ├── 1778844540004.png
│           ├── 1778845260007.png
│           ├── 1778845320006.png
│           ├── 1778845500014.png
│           ├── 1778845560007.png
│           ├── 1778846100011.png
│           ├── 1778846160009.png
│           ├── 1778846820012.png
│           ├── 1778847600012.png
│           ├── 1778847660008.png
│           ├── 1778847900004.png
│           ├── 1778848260008.png
│           ├── 1778848740008.png
│           ├── 1778848800017.png
│           ├── 1778848860002.png
│           ├── 1778848920006.png
│           ├── 1778849040006.png
│           ├── 1778849100007.png
│           ├── 1778852220012.png
│           ├── 1778852280006.png
│           ├── 1778853663527.png
│           ├── 1778853695430.png
│           ├── 1778853731131.png
│           ├── 1778853769544.png
│           ├── 1778853790066.png
│           ├── 1778853819215.png
│           ├── 1778853828860.png
│           ├── 1778853855252.png
│           ├── 1778853923183.png
│           ├── 1778853990339.png
│           ├── 1778854056089.png
│           ├── 1778854078172.png
│           ├── 1778854117281.png
│           ├── 1778854140353.png
│           ├── 1778854150349.png
│           ├── 1778854167512.png
│           ├── 1778854225360.png
│           ├── 1778854271693.png
│           ├── 1778854291166.png
│           ├── 1778854313945.png
│           ├── 1778854322489.png
│           ├── 1778854348270.png
│           ├── 1778854369281.png
│           ├── 1778854384028.png
│           ├── 1778854396125.png
│           ├── 1778854409401.png
│           ├── 1778855896958.png
│           ├── 1778855917145.png
│           ├── 1778855939129.png
│           ├── 1778855951572.png
│           ├── 1778855975028.png
│           ├── 1778855977827.png
│           ├── 1778856018518.png
│           ├── 1778856052228.png
│           ├── 1778856062864.png
│           ├── 1778856075716.png
│           ├── 1778856084922.png
│           ├── 1778856094763.png
│           ├── 1778856104008.png
│           ├── 1778856220358.png
│           ├── 1778856223866.png
│           ├── 1778856235210.png
│           ├── 1778856251394.png
│           ├── 1778856258790.png
│           ├── 1778856283989.png
│           ├── 1778856310808.png
│           ├── 1778856345744.png
│           ├── 1778856364485.png
│           ├── 1778856372360.png
│           ├── 1778856407010.png
│           ├── 1778856409918.png
│           ├── 1778856435712.png
│           ├── 1778856449673.png
│           ├── 1778856464920.png
│           ├── 1778856484544.png
│           ├── 1778856493111.png
│           ├── 1778857733715.png
│           ├── 1778857808259.png
│           ├── 1778857833892.png
│           ├── 1778857846380.png
│           ├── 1778857863441.png
│           ├── 1778857878114.png
│           ├── 1778857889684.png
│           ├── 1778857899237.png
│           ├── 1778857926323.png
│           ├── 1778857993537.png
│           ├── 1778858006944.png
│           ├── 1778858056079.png
│           ├── 1778858064703.png
│           ├── 1778858071749.png
│           ├── 1778858095532.png
│           ├── 1778858120768.png
│           ├── 1778858127471.png
│           ├── 1778858162190.png
│           ├── 1778858172152.png
│           ├── 1778858181406.png
│           ├── 1778860337299.png
│           ├── 1778860357710.png
│           ├── 1778860373281.png
│           ├── 1778860389559.png
│           ├── 1778860415005.png
│           ├── 1778860428383.png
│           ├── 1778860452926.png
│           ├── 1778860499109.png
│           ├── 1778860518406.png
│           ├── 1778860538920.png
│           ├── 1778860577195.png
│           ├── 1778860586088.png
│           ├── 1778860626386.png
│           ├── 1778860636546.png
│           ├── 1778860644752.png
│           ├── 1778860660645.png
│           ├── 1778860667564.png
│           ├── 1778860678453.png
│           ├── 1778860699194.png
│           ├── 1778860713508.png
│           ├── 1778860720640.png
│           ├── 1778861249488.png
│           ├── 1778862840006.png
│           ├── 1778863020018.png
│           ├── 1778863080003.png
│           ├── 1778863140002.png
│           ├── 1778863200006.png
│           ├── 1778863359649.png
│           ├── 1778863582342.png
│           ├── 1778864095775.png
│           ├── 1778866976198.png
│           ├── 1778867674802.png
│           ├── 1778868291236.png
│           ├── 1778868321128.png
│           ├── 1778868432987.png
│           ├── 1778868448405.png
│           ├── 1778868464790.png
│           ├── 1778868473516.png
│           ├── 1778868536100.png
│           ├── 1778868553502.png
│           ├── 1778868628586.png
│           ├── 1778868653183.png
│           ├── 1778868697355.png
│           ├── 1778869265517.png
│           ├── 1778869878442.png
│           ├── 1778870035236.png
│           ├── 1778870269297.png
│           ├── 1778870283756.png
│           ├── 1778870293022.png
│           ├── 1778870308896.png
│           ├── 1778870319566.png
│           ├── 1778870328879.png
│           ├── 1778870340376.png
│           └── 1781945861096.png
├── bootstrap.ts
├── env.ts
├── register-command-handlers.ts
├── register-cron-tasks.ts
└── tools
    ├── build-info-config.adapter.ts
    ├── cache-response.ts
    ├── command-bus.ts
    ├── cron-scheduler.adapter.ts
    ├── hash-content.strategy.ts
    ├── job-queue.adapter.ts
    ├── prerequisites.ts
    ├── shield-basic-auth.strategy.ts
    ├── shield-rate-limit.strategy.ts
    ├── shield-security.strategy.ts
    └── shield-timeout.strategy.ts
```
