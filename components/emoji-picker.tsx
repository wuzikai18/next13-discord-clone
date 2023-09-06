'use client';

import { Smile } from 'lucide-react';
import { FC } from 'react';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface EmojiPickerProps {
  onChange: (value: string) => void;
}

const EmojiPicker: FC<EmojiPickerProps> = ({ onChange }) => {
  return (
    <Popover>
      <PopoverTrigger>
        <Smile className="transition text-zinc-500 dark:text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300" />
      </PopoverTrigger>
      <PopoverContent
        side="right"
        sideOffset={40}
        className="mb-16 bg-transparent border-none shadow-none drop-shadow-none"
      >
        {/* <Picker
          theme={resolvedTheme}
          data={data}
          onEmojiSelect={(emoji: any) => onChange(emoji.native)}
        /> */}
      </PopoverContent>
    </Popover>
  );
};

export { EmojiPicker };
