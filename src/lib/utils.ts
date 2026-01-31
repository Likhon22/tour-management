export const getEmojiForCategory = (name: string) => {
    const n = name?.toLowerCase() || "";
    if (n.includes("water")) return "💧";
    if (n.includes("transport") || n.includes("rickshaw") || n.includes("auto") || n.includes("bus") || n.includes("train") || n.includes("plane")) return "🚗";
    if (n.includes("food") || n.includes("lunch") || n.includes("dinner") || n.includes("breakfast") || n.includes("snacks")) return "🍱";
    if (n.includes("hotel") || n.includes("rent") || n.includes("stay") || n.includes("room")) return "🏨";
    if (n.includes("smoke") || n.includes("cigarette") || n.includes("bidi")) return "🚬";
    if (n.includes("drink") || n.includes("tea") || n.includes("coffee") || n.includes("juice")) return "🥤";
    if (n.includes("parking")) return "🅿️";
    if (n.includes("ticket") || n.includes("entry")) return "🎟️";
    if (n.includes("shopping") || n.includes("gift")) return "🛍️";
    return "💰";
};
