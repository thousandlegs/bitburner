export const well_known_ports = {
    "HACK_TARGET": 1,
    "GANG_ACTIVITY": 2
};


function _toportold(v) {
    if (Number.isInteger(v)) {
        return v;
    } else {
        return well_known_ports[v];
    }
}


function _toport(ns, v) {
    for (const pnam in well_known_ports) {
        const pnum = well_known_ports[pnam];
        if (v == pnam || v == pnum) {
            ns.tprint
            return ns.getPortHandle(pnum);
        }
    }
}

function _portval(port) {
    let pval;
    if (port.empty()) {
        pval = "(empty)";
    } else {
        pval = port.peek();
    }

    if (port.full()) {
        pval += " (full)";
    }

    return pval;
}


function report (ns) {
    for (const pp in well_known_ports) {
        const pnum = well_known_ports[pp];
        ns.tprint(pp, " (port ", pnum, "): ", get_port_val(ns, pnum));
    }
}


export function get_port_val(ns, pdesc) {
    return _portval(_toport(ns, pdesc));
}

export function get_hack_target(ns) {
    const port = _toport(ns, "HACK_TARGET");
    if (!port.empty()) {
        return port.peek();
    }
}

export function get_gang_activity(ns) {
    const port = _toport(ns, "GANG_ACTIVITY");
    if (!port.empty()) {
        return port.peek();
    }
}


/** @param {NS} ns **/
export async function main(ns) {
    let show_report = true;

    if (ns.args[0] == "poke") {
        const port = _toport(ns, ns.args[1]);
        const val = ns.args[2];
        port.clear();
        port.write(val);
    } else if (ns.args[0] == "peek") {
        ns.tprint(get_port_val(ns, ns.args[1]));
        show_report = false;
    } 
    
    if (show_report) {
        report(ns);
    }
}