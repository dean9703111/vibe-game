export const getBossImage = (seed) => {
    // Using 'bottts' style for a robot/pixel-ish look, or 'pixel-art' if available.
    // DiceBear v9 API format: https://api.dicebear.com/9.x/[style]/svg?seed=[seed]
    // 'pixel-art' is a valid style in DiceBear.
    return `https://api.dicebear.com/9.x/pixel-art/svg?seed=${seed}`;
};
