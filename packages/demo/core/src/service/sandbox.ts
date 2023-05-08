import { getQuickJS, Scope, type QuickJSContext, type QuickJSHandle } from "quickjs-emscripten"

const consoleFactory = (vm: QuickJSContext, consoleHandle: QuickJSHandle, fnName: keyof Console) => {
    const handle = vm.newFunction(fnName, (...args) => {
        const nativeArgs = args.map(vm.dump);
        (console as any)[fnName]("[QuickJS]：", ...nativeArgs);
    });

    vm.setProp(consoleHandle, fnName, handle);
    handle.dispose();
}

const injectConsole = (vm: QuickJSContext) => {
    const consoleHandle = vm.newObject();

    consoleFactory(vm, consoleHandle, 'log');
    consoleFactory(vm, consoleHandle, 'warn');
    consoleFactory(vm, consoleHandle, 'error');

    vm.setProp(vm.global, 'console', consoleHandle);

    consoleHandle.dispose();
}

export const main = async () => {
    const qs = await getQuickJS();
    const runtime = qs.newRuntime();
    const ctx = runtime.newContext();
    
    Scope.withScope((scope) => {
        const htmlInVm = scope.manage(ctx.newString('<html><body>11111</body></html>'))
        ctx.setProp(ctx.global, "__html__", htmlInVm);

        injectConsole(ctx);
        // console.log(ctx.getProp(ctx.global, "__html__").consume(ctx.getString), 'xxxxxxxxxxxxxxxxxx');

        ctx.evalCode("const a = { b: 1 }; console.log(a); a.b++; console.log(a);console.warn('error');");

    });
}
