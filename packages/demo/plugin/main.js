pixso.showUI(__html__, {
    height: 930,
    width: 580
});

pixso.on("run", (options) => {
    console.log(options, '1111111')
});

pixso.notify("我更新了")
