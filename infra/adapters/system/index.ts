import type { EnvironmentResultType } from "+infra/env";
import { createCertificateInspector } from "./certificate-inspector.adapter";
import { createClock } from "./clock.adapter";
import { createDiskSpaceChecker } from "./disk-space-checker.adapter";
import { createFileCleaner } from "./file-cleaner.adapter";
import { createFileInspection } from "./file-inspection.adapter";
import { FileReaderJson } from "./file-reader-json.adapter";
import { createFileRenamer } from "./file-renamer.adapter";
import { FileWriter } from "./file-writer.adapter";
import { createHashFile } from "./hash-file.adapter";
import { IdProvider } from "./id-provider.adapter";
import { createImageProcessor } from "./image-processor.adapter";
import { createLogger } from "./logger.adapter";
import { createRemoteFileStorage } from "./remote-file-storage.adapter";
import { createSleeper } from "./sleeper.adapter";
import { createTemporaryFile } from "./temporary-file.adapter";
import { createTimekeeper } from "./timekeeper.adapter";
import { createTimeoutRunner } from "./timeout-runner.adapter";

export async function createSystemAdapters(Env: EnvironmentResultType) {
  const Clock = createClock(Env);
  const Logger = createLogger(Env, { Clock });
  const FileCleaner = createFileCleaner(Env);
  const FileRenamer = createFileRenamer(Env);
  const Sleeper = createSleeper(Env);
  const TimeoutRunner = createTimeoutRunner(Env);
  const TemporaryFile = createTemporaryFile(Env, { FileCleaner, FileRenamer, FileWriter });
  const Timekeeper = createTimekeeper(Env, { Clock });
  const FileInspection = createFileInspection(Env);
  const HashFile = createHashFile({ FileInspection });

  return {
    CertificateInspector: createCertificateInspector(Env, { Clock }),
    Clock,
    DiskSpaceChecker: createDiskSpaceChecker(Env),
    IdProvider,
    FileReaderJson,
    Logger,
    Timekeeper,
    FileCleaner,
    FileRenamer,
    TemporaryFile,
    HashFile,
    ImageProcessor: createImageProcessor(Env, { FileCleaner, FileRenamer, FileReaderJson, FileWriter }),
    Sleeper,
    TimeoutRunner,
    RemoteFileStorage: createRemoteFileStorage(Env, { HashFile, FileCleaner, FileRenamer, Logger, Clock }),
    FileInspection,
  };
}
