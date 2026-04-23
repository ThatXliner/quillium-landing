/**
 * logger.ts -- Small structured-ish logger with production-friendly defaults.
 */

const levels = {
    debug: 10,
    info: 20,
    warn: 30,
    error: 40,
} as const;

type LogLevel = keyof typeof levels;

const configuredLevel = process.env.LOG_LEVEL?.toLowerCase() as LogLevel | undefined;
const currentLevel = configuredLevel && configuredLevel in levels ? configuredLevel : "info";

function shouldLog(level: LogLevel): boolean {
    return levels[level] >= levels[currentLevel];
}

function write(level: LogLevel, scope: string, message: string, ...args: unknown[]): void {
    if (!shouldLog(level)) {
        return;
    }

    const line = `[${scope}] ${message}`;

    if (level === "error") {
        console.error(line, ...args);
    } else if (level === "warn") {
        console.warn(line, ...args);
    } else {
        console.log(line, ...args);
    }
}

export function createLogger(scope: string) {
    return {
        debug: (message: string, ...args: unknown[]) => write("debug", scope, message, ...args),
        info: (message: string, ...args: unknown[]) => write("info", scope, message, ...args),
        warn: (message: string, ...args: unknown[]) => write("warn", scope, message, ...args),
        error: (message: string, ...args: unknown[]) => write("error", scope, message, ...args),
    };
}
