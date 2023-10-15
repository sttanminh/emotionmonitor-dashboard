import React, { useState } from "react";
import styles from "./emojiSetting.module.css"; // Import the CSS module
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { SelectChangeEvent } from "@mui/material/Select";

interface EmojiSettingProps {
  emojis: string[];
  onEmojiChange: (index: number, newEmoji: string) => void;
}

const EmojiSetting: React.FC<EmojiSettingProps> = ({
  emojis,
  onEmojiChange,
}) => {
  const emojiRange = Array.from(
    { length: 128591 - 128513 + 1 },
    (_, i) => 128513 + i
  );

  const onEmojiSelect = (
    event: SelectChangeEvent<string>,
    emojiIndex: number
  ) => {
    const newEmoji = event.target.value;
    onEmojiChange(emojiIndex, newEmoji);
  };

  return (
    <div className={styles.emojiContainer}>
      {emojis.map((emoji, index) => (
        <Select
          key={index}
          value={emoji}
          className={styles.dropdown}
          onChange={(event) => onEmojiSelect(event, index)}
        >
          {emojiRange.map((emojiInNumber) => (
            <MenuItem value={String.fromCodePoint(emojiInNumber)}>
              {String.fromCodePoint(emojiInNumber)}
            </MenuItem>
          ))}
        </Select>
      ))}
    </div>
  );
};

export default EmojiSetting;
