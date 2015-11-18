function getCExp(dt) {
    var val = new Date(dt);
    var retVal = parseInt(val.getMonth() + 1) + "月" + val.getDate() + "日";

    return retVal;
}

function padding(n, width, z) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

function getDExp(dt) {

    var val = new Date(dt);
    var retVal = padding(val.getHours(), 2) + ":" + padding(val.getMinutes(), 2);

    return retVal;
}
