import webpack from 'webpack';
import chalk from 'chalk';

export const printStats = (err: null | Error | undefined, stats: webpack.Stats | undefined) => {
    if (err) {
        console.log(chalk.red('Server critical error'));
        throw err;
    }

    if (!stats) return false;

    const jsonStats = stats.toJson();
    if (stats.hasErrors()) {
        jsonStats.errors?.forEach((err) => {
            const { stack, details, message } = err;
            const error = stack || details || message;
            console.error(`${chalk.red('[Error]: ')}${error}`)
        });
        // jsonStats.errors?.forEach((err) => console.error(err));
    }
    if (stats.hasWarnings()) {
        jsonStats.warnings?.forEach((err) => {
            const { stack, details, message } = err;
            const warn = stack || details || message;
            console.warn(`${chalk.yellow('[Warning]: ')}${warn}`)
        });
    }

    if (stats.hasErrors()) return false;
    return true;
}