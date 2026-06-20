


export function getCurrentTimeDhaka(): string {
    const formatter = new Intl.DateTimeFormat("en-US", {
        timeZone: "Asia/Dhaka",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false // Force 24-hour mode
    });

    // Format parts array splits it cleanly into variables
    const parts = formatter.formatToParts(new Date());
    const map = Object.fromEntries(parts.map(p => [p.type, p.value]));

    // Construct standard: YYYY-MM-DD HH:mm:ss
    const dhakaIsoString = `${map.year}-${map.month}-${map.day} ${map.hour}:${map.minute}:${map.second}`;

    return dhakaIsoString
    // Output: "2026-06-20 17:29:25"
}