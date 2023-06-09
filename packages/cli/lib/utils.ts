import chokidar from "chokidar";

export const watchFile = (path: string, callback: (path: string) => any) => {
    return chokidar
        .watch(path)
        .on("add", callback)
        .on("change", callback)
        .on("unlink", callback);
}
