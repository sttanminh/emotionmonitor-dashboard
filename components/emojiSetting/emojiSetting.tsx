import React, { useState } from "react";
import styles from "./emojiSetting.module.css"; // Import the CSS module

interface EmojiSettingProps {
    emojis: string[]
    onEmojiChange: (index: number, newEmoji: string) => void;
}

const EmojiSetting: React.FC<EmojiSettingProps> = ({ emojis, onEmojiChange}) => {

    const emojiRange = Array.from({ length: 128591 - 128513 + 1 }, (_, i) => 128513 + i);

    const onEmojiSelect = (event: React.ChangeEvent<HTMLSelectElement>, emojiIndex: number) => {
        const newEmoji = event.target.value;
        onEmojiChange(emojiIndex, newEmoji);
    }

    return (
        <div className={styles.emojiContainer}>
            {
                emojis.map((emoji, index) => (
                    <select key={index} value={emoji} className={styles.dropdown} onChange={(event) => onEmojiSelect(event, index)}>
                        {
                            emojiRange.map((emojiInNumber) => (
                                <option>
                                    {String.fromCodePoint(emojiInNumber)}
                                </option>
                            ))
                        }
                    </select>
                ))
            }
        </div>
        
    )
}

export default EmojiSetting;